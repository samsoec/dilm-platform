import {
  REVALIDATE_LIMITS,
  REVALIDATE_SIGNATURE_HEADER,
  REVALIDATE_TIMESTAMP_HEADER,
  parseRevalidationRequest,
  verifyRevalidation,
  type RevalidationPurge,
} from "@dilm/runtime-config";

import type { PurgeOutcome, Purger } from "./cloudflare";

export const WARM_LIMIT = 50;
export const WARM_TIMEOUT_MS = 8_000;
export const WARM_CONCURRENCY = 5;

export type WarmTarget = { host: string; path: string };

export type RevalidateDeps = {
  secret: string | undefined;
  now?: number;
  knownHost(host: string): boolean;
  expireTag(tag: string): void | Promise<void>;
  warm(target: WarmTarget): Promise<boolean>;
  purge: Purger;
  log: {
    info(data: object, message: string): void;
    error(data: object, message: string): void;
  };
};

export type RevalidateResult = {
  status: number;
  body: Record<string, unknown>;
};

function reject(status: number, error: string): RevalidateResult {
  return { status, body: { ok: false, error } };
}

async function inBatches<T>(
  items: T[],
  size: number,
  run: (item: T) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(run));
  }
}

export async function handleRevalidate(
  request: Request,
  deps: RevalidateDeps,
): Promise<RevalidateResult> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > REVALIDATE_LIMITS.bodyBytes) {
    return reject(413, "The body is too large.");
  }
  const body = await request.text();
  if (Buffer.byteLength(body) > REVALIDATE_LIMITS.bodyBytes) {
    return reject(413, "The body is too large.");
  }
  const check = verifyRevalidation(
    {
      body,
      timestamp: request.headers.get(REVALIDATE_TIMESTAMP_HEADER),
      signature: request.headers.get(REVALIDATE_SIGNATURE_HEADER),
    },
    deps.secret,
    deps.now,
  );
  if (!check.ok) {
    if (check.reason === "unconfigured") {
      deps.log.error({}, "Revalidation refused: REVALIDATE_SECRET is not set");
      return reject(503, "Revalidation is not configured.");
    }
    deps.log.error({ reason: check.reason }, "Revalidation refused");
    return reject(401, "The request is not signed correctly.");
  }
  const parsed = parseRevalidationRequest(body);
  if (!parsed.ok) return reject(400, parsed.problem);
  const { tags, purge } = parsed.value;
  if (!purge.every((entry) => deps.knownHost(entry.host))) {
    return reject(400, "purge names a host this site does not serve.");
  }

  const failedTags: string[] = [];
  for (const tag of new Set(tags)) {
    try {
      await deps.expireTag(tag);
    } catch (error) {
      failedTags.push(tag);
      deps.log.error({ err: error, tag }, "Tag expiry failed");
    }
  }

  const exact: RevalidationPurge[] = purge.filter((entry) => entry.exact);
  const targets = exact.slice(0, WARM_LIMIT);
  let warmed = 0;
  const failedWarms: string[] = [];
  await inBatches(targets, WARM_CONCURRENCY, async (entry) => {
    let ok = false;
    try {
      ok = await deps.warm({ host: entry.host, path: entry.pathPrefix });
    } catch (error) {
      deps.log.error(
        { err: error, host: entry.host, path: entry.pathPrefix },
        "Warm request threw",
      );
    }
    if (ok) warmed += 1;
    else failedWarms.push(`${entry.host}${entry.pathPrefix}`);
  });
  if (failedWarms.length > 0) {
    deps.log.error({ paths: failedWarms }, "Some pages could not be warmed");
  }

  let purged: PurgeOutcome;
  try {
    purged = await deps.purge(purge);
  } catch (error) {
    purged = {
      status: "failed",
      requests: 0,
      failures: [error instanceof Error ? error.message : String(error)],
    };
  }
  if (purged.status === "failed") {
    deps.log.error({ failures: purged.failures }, "Edge purge failed");
  } else if (purged.status === "skipped") {
    deps.log.info({ reason: purged.reason }, "Edge purge skipped");
  }

  const partial =
    failedTags.length > 0 ||
    failedWarms.length > 0 ||
    exact.length > targets.length ||
    purged.status === "failed";
  deps.log.info(
    { tags: tags.length, warmed, purge: purged.status, partial },
    "Revalidation handled",
  );
  return {
    status: 200,
    body: {
      ok: !partial,
      tags: tags.length - failedTags.length,
      failedTags,
      warmed,
      failedWarms,
      unwarmed: exact.length - targets.length,
      purge: purged,
    },
  };
}
