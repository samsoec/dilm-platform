export const TENANT_SLUGS = ["indoacid", "duniakimia", "likutelaga"] as const;

export type TenantSlug = (typeof TENANT_SLUGS)[number];

export const TENANT_DOMAINS: Record<TenantSlug, string> = {
  indoacid: "indonesianacids.com",
  duniakimia: "duniakimia.com",
  likutelaga: "likutelaga.com",
};

export const TENANT_NAMES: Record<TenantSlug, string> = {
  indoacid: "Indonesian Acids Industry",
  duniakimia: "Dunia Kimia Utama",
  likutelaga: "Liku Telaga",
};

export function tenantSenderAddress(slug: TenantSlug): string {
  return `noreply@${TENANT_DOMAINS[slug]}`;
}

export type SenderSetting =
  { mode: "tenant" } | { mode: "shared"; address: string; identity: string };

export function senderSetting(
  sharedAddress?: string,
  sharedIdentity?: string,
): SenderSetting {
  const address = sharedAddress?.trim().toLowerCase();
  if (address === undefined || address === "") return { mode: "tenant" };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
    throw new Error(
      `The shared sender must be an email address, got "${address}".`,
    );
  }
  const identity = sharedIdentity?.trim().toLowerCase();
  return {
    mode: "shared",
    address,
    identity: identity === undefined || identity === "" ? address : identity,
  };
}

export function senderAddress(
  slug: TenantSlug,
  setting: SenderSetting,
): string {
  return setting.mode === "shared"
    ? setting.address
    : tenantSenderAddress(slug);
}

export function senderAddresses(setting: SenderSetting): string[] {
  return setting.mode === "shared"
    ? [setting.address]
    : TENANT_SLUGS.map(tenantSenderAddress);
}

export function senderIdentities(setting: SenderSetting): string[] {
  return setting.mode === "shared"
    ? [setting.identity]
    : TENANT_SLUGS.map((slug) => TENANT_DOMAINS[slug]);
}
