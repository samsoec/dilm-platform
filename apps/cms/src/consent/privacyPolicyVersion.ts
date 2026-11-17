import type { FieldHook, Payload, PayloadRequest } from "payload";

export const PRIVACY_POLICY_VERSION_START = "2026-11";

export const PRIVACY_POLICY_VERSION_HINT =
  "Recorded with every form consent. Change it whenever the Privacy Policy changes in a way that affects consent, for example 2026-11.";

export function privacyPolicyVersionWarning(
  was: string | undefined,
  domain: string | undefined,
): string {
  return `Was ${was?.trim() ? was.trim() : "not set"}. After you save, every form consent on ${domain ?? "this site"} is recorded against the new version. Change it only when the Privacy Policy changes in a way that affects consent.`;
}

function tenantId(value: unknown): number | string | undefined {
  const id =
    value && typeof value === "object" && "id" in value
      ? (value as { id: unknown }).id
      : value;
  return typeof id === "number" || typeof id === "string" ? id : undefined;
}

export async function readPrivacyPolicyVersion(
  payload: Payload,
  tenant: number | string,
): Promise<string | null> {
  const {
    docs: [settings],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    select: { privacyPolicyVersion: true },
  });
  const version = (settings as { privacyPolicyVersion?: unknown } | undefined)
    ?.privacyPolicyVersion;
  return typeof version === "string" && version !== "" ? version : null;
}

const CACHE_KEY = "privacyPolicyVersions";

export function requestTenant(
  data: unknown,
  req: Pick<PayloadRequest, "context">,
): number | string | undefined {
  return (
    tenantId((data as { tenant?: unknown } | undefined)?.tenant) ??
    tenantId((req.context as { tenantId?: unknown } | undefined)?.tenantId)
  );
}

export const attachPrivacyPolicyVersion: FieldHook = async ({ data, req }) => {
  const tenant = requestTenant(data, req);
  if (tenant === undefined) return null;
  const cache = ((req.context as Record<string, unknown>)[CACHE_KEY] ??=
    new Map<number | string, Promise<string | null>>()) as Map<
    number | string,
    Promise<string | null>
  >;
  let pending = cache.get(tenant);
  if (!pending) {
    pending = readPrivacyPolicyVersion(req.payload, tenant);
    cache.set(tenant, pending);
  }
  return pending;
};
