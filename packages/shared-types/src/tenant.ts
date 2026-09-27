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
