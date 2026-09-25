export const TENANT_SLUGS = ["indoacid", "duniakimia", "likutelaga"] as const;

export type TenantSlug = (typeof TENANT_SLUGS)[number];

export const TENANT_DOMAINS: Record<TenantSlug, string> = {
  indoacid: "indonesianacids.com",
  duniakimia: "duniakimia.com",
  likutelaga: "likutelaga.com",
};
