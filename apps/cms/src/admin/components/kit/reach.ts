export const ALL_SITES_COUNT = 3;

export const ALL_SITE_COLLECTIONS = [
  "shared-pages",
  "shared-detail-templates",
  "products",
  "solutions",
  "categories",
] as const;

export type ReachTenant = { id?: number | string; domain?: string | null };

export type ReachDoc = {
  tenant?: number | string | ReachTenant | null;
};

export type Reach =
  | { scope: "all"; sites: number; label: string }
  | { scope: "tenant"; domain?: string; label: string };

export type ReachOptions = {
  collection?: string;
  tenants?: readonly ReachTenant[];
  sites?: number;
};

function tenantDomain(
  tenant: NonNullable<ReachDoc["tenant"]>,
  tenants: readonly ReachTenant[] = [],
): string | undefined {
  if (typeof tenant === "object") return tenant.domain || undefined;
  return (
    tenants.find(({ id }) => String(id) === String(tenant))?.domain ?? undefined
  );
}

export function allSitesLabel(sites: number = ALL_SITES_COUNT): string {
  return `All ${sites} sites`;
}

export function getReach(
  doc: ReachDoc | null | undefined,
  { collection, tenants, sites = ALL_SITES_COUNT }: ReachOptions = {},
): Reach {
  const sharedByKind =
    collection !== undefined &&
    (ALL_SITE_COLLECTIONS as readonly string[]).includes(collection);
  const tenant = doc?.tenant;
  if (
    sharedByKind ||
    tenant === undefined ||
    tenant === null ||
    tenant === ""
  ) {
    return { scope: "all", sites, label: allSitesLabel(sites) };
  }
  const domain = tenantDomain(tenant, tenants);
  return {
    scope: "tenant",
    domain,
    label: domain ? `This site only (${domain})` : "This site only",
  };
}
