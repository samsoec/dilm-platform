import { createHmac, timingSafeEqual } from "node:crypto";

export const REVALIDATE_PATH = "/api/revalidate";
export const REVALIDATE_TIMESTAMP_HEADER = "x-dilm-timestamp";
export const REVALIDATE_SIGNATURE_HEADER = "x-dilm-signature";
export const REVALIDATE_MAX_AGE_MS = 5 * 60_000;
export const REVALIDATE_MAX_SKEW_MS = 30_000;

export type RevalidationSignature = {
  timestamp: string;
  signature: string;
};

export type RevalidationCheck =
  | { ok: true }
  | {
      ok: false;
      reason: "malformed" | "stale" | "tampered" | "unconfigured";
    };

function digest(timestamp: string, body: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

export function signRevalidation(
  body: string,
  secret: string,
  now: number = Date.now(),
): RevalidationSignature {
  if (!secret) throw new Error("REVALIDATE_SECRET is not configured.");
  const timestamp = String(now);
  return { timestamp, signature: digest(timestamp, body, secret) };
}

export function revalidationHeaders(
  signed: RevalidationSignature,
): Record<string, string> {
  return {
    [REVALIDATE_TIMESTAMP_HEADER]: signed.timestamp,
    [REVALIDATE_SIGNATURE_HEADER]: signed.signature,
  };
}

export function verifyRevalidation(
  input: {
    body: string;
    timestamp: string | null | undefined;
    signature: string | null | undefined;
  },
  secret: string | undefined,
  now: number = Date.now(),
): RevalidationCheck {
  if (!secret) return { ok: false, reason: "unconfigured" };
  const { body, timestamp, signature } = input;
  if (
    !timestamp ||
    !signature ||
    !/^\d{1,15}$/.test(timestamp) ||
    !/^[0-9a-f]{64}$/.test(signature)
  ) {
    return { ok: false, reason: "malformed" };
  }
  const wanted = Buffer.from(digest(timestamp, body, secret), "hex");
  const given = Buffer.from(signature, "hex");
  if (wanted.length !== given.length || !timingSafeEqual(wanted, given)) {
    return { ok: false, reason: "tampered" };
  }
  const age = now - Number(timestamp);
  if (age > REVALIDATE_MAX_AGE_MS || age < -REVALIDATE_MAX_SKEW_MS) {
    return { ok: false, reason: "stale" };
  }
  return { ok: true };
}

export type RevalidationPurge = {
  host: string;
  pathPrefix: string;
  exact?: boolean;
};

export type RevalidationRequest = {
  tags: string[];
  purge: RevalidationPurge[];
};

export const REVALIDATE_LIMITS = {
  bodyBytes: 256 * 1024,
  tags: 500,
  purge: 500,
  tagLength: 256,
  pathLength: 1024,
} as const;

export function parseRevalidationRequest(
  body: string,
): { ok: true; value: RevalidationRequest } | { ok: false; problem: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return { ok: false, problem: "The body is not JSON." };
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, problem: "The body must be an object." };
  }
  const { tags, purge } = raw as Record<string, unknown>;
  if (
    !Array.isArray(tags) ||
    tags.length > REVALIDATE_LIMITS.tags ||
    !tags.every(
      (tag) =>
        typeof tag === "string" &&
        tag.length > 0 &&
        tag.length <= REVALIDATE_LIMITS.tagLength,
    )
  ) {
    return { ok: false, problem: "tags must be a short list of strings." };
  }
  if (!Array.isArray(purge) || purge.length > REVALIDATE_LIMITS.purge) {
    return { ok: false, problem: "purge must be a short list." };
  }
  const entries: RevalidationPurge[] = [];
  for (const entry of purge as unknown[]) {
    const item = entry as Partial<RevalidationPurge> | null;
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.host !== "string" ||
      item.host === "" ||
      typeof item.pathPrefix !== "string" ||
      !item.pathPrefix.startsWith("/") ||
      item.pathPrefix.startsWith("//") ||
      item.pathPrefix.length > REVALIDATE_LIMITS.pathLength ||
      (item.exact !== undefined && typeof item.exact !== "boolean")
    ) {
      return { ok: false, problem: "purge has a malformed entry." };
    }
    entries.push({
      host: item.host,
      pathPrefix: item.pathPrefix,
      ...(item.exact ? { exact: true } : {}),
    });
  }
  return { ok: true, value: { tags: tags as string[], purge: entries } };
}

export type CloudflareConfig = {
  apiToken: string;
  zones: Record<string, string>;
};

export type EdgeConfig = {
  revalidateSecret?: string;
  cloudflare?: CloudflareConfig;
};

const UNSET = "unset";

function present(value: string | undefined): string | undefined {
  const text = value?.trim();
  return text && text !== UNSET ? text : undefined;
}

export function parseCloudflareZones(
  raw: string | undefined,
): Record<string, string> {
  const text = present(raw);
  if (!text) return {};
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(
      "CLOUDFLARE_ZONE_IDS must be a JSON object of host to zone id.",
    );
  }
  const zones: Record<string, string> = {};
  for (const [host, zone] of Object.entries(parsed)) {
    if (typeof zone !== "string" || zone === "") {
      throw new Error(`CLOUDFLARE_ZONE_IDS has no zone id for ${host}.`);
    }
    zones[host.toLowerCase()] = zone;
  }
  return zones;
}

export function edgeConfigFrom(
  values: Partial<
    Record<
      "REVALIDATE_SECRET" | "CLOUDFLARE_API_TOKEN" | "CLOUDFLARE_ZONE_IDS",
      string
    >
  >,
): EdgeConfig {
  const apiToken = present(values.CLOUDFLARE_API_TOKEN);
  const zones = parseCloudflareZones(values.CLOUDFLARE_ZONE_IDS);
  return {
    revalidateSecret: present(values.REVALIDATE_SECRET),
    cloudflare:
      apiToken && Object.keys(zones).length > 0
        ? { apiToken, zones }
        : undefined,
  };
}

export const EDGE_PARAMETER_NAMES = [
  "REVALIDATE_SECRET",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ZONE_IDS",
] as const;
