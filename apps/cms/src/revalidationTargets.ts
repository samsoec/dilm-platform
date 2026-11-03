import { CATEGORY_PREFIX_PATHS, localeCodes } from "./paths";
import type {
  PurgePrefix,
  RevalidationChange,
  RevalidationReason,
  TenantIdentity,
} from "./revalidation";
import type { RouteSnapshot } from "./routeIndex";

export type Tenant = TenantIdentity & { id: string };

export const LIST_COLLECTIONS = [
  "products",
  "solutions",
  "jobs",
  "posts",
  "categories",
] as const;

export type ListCollection = (typeof LIST_COLLECTIONS)[number];

export type TemplateKind = "shared" | "tenant";

export type TemplateRecordType =
  "product" | "solution" | "job" | "post" | "category";

export const TEMPLATE_COLLECTION: Record<TemplateRecordType, ListCollection> = {
  product: "products",
  solution: "solutions",
  job: "jobs",
  post: "posts",
  category: "categories",
};

export type Referrer = {
  tenant: string | null;
  paths: Record<string, string>;
};

const SHARED = "shared";

export function routeTag(
  tenantSlug: string | null,
  locale: string,
  path: string,
): string {
  return `route:${tenantSlug ?? SHARED}:${locale}:${path}`;
}

export function listTag(scope: string, collection: string): string {
  return `list:${scope}:${collection}`;
}

export function publicPath(locale: string, path: string): string {
  return path === "/" ? `/${locale}/` : `/${locale}${path}`;
}

function isListCollection(collection: string): collection is ListCollection {
  return (LIST_COLLECTIONS as readonly string[]).includes(collection);
}

function hostsFor(tenant: string | null, tenants: Tenant[]): Tenant[] {
  return tenant === null
    ? tenants
    : tenants.filter((candidate) => candidate.id === tenant);
}

function slugOf(tenant: string | null, tenants: Tenant[]): string | undefined {
  return tenant === null
    ? SHARED
    : tenants.find((candidate) => candidate.id === tenant)?.slug;
}

export class Collector {
  readonly tags = new Set<string>();
  private readonly purges = new Map<string, PurgePrefix>();

  addPurge(purge: PurgePrefix): void {
    this.purges.set(
      `${purge.host}|${purge.exact ? "=" : "^"}|${purge.pathPrefix}`,
      purge,
    );
  }

  addRoute(row: RouteSnapshot, tenants: Tenant[]): void {
    const slug = slugOf(row.tenant, tenants);
    if (slug === undefined) return;
    this.tags.add(
      routeTag(row.tenant === null ? null : slug, row.locale, row.path),
    );
    for (const tenant of hostsFor(row.tenant, tenants)) {
      this.addPurge({
        host: tenant.host,
        pathPrefix: publicPath(row.locale, row.path),
        exact: true,
      });
    }
  }

  addList(collection: string, scopes: Tenant[]): void {
    if (!isListCollection(collection)) return;
    this.tags.add(listTag("all", collection));
    for (const tenant of scopes) {
      this.tags.add(listTag(tenant.slug, collection));
    }
  }

  build(
    collection: string | undefined,
    reason: RevalidationReason,
  ): RevalidationChange {
    return {
      collection,
      reason,
      tags: [...this.tags].sort(),
      purge: [...this.purges.values()].sort((a, b) =>
        `${a.host}${a.pathPrefix}`.localeCompare(`${b.host}${b.pathPrefix}`),
      ),
    };
  }

  get empty(): boolean {
    return this.tags.size === 0 && this.purges.size === 0;
  }
}

function referrerRows(referrers: Referrer[]): RouteSnapshot[] {
  return referrers.flatMap((referrer) =>
    Object.entries(referrer.paths).map(([locale, path]) => ({
      tenant: referrer.tenant,
      locale,
      path,
    })),
  );
}

export type DocumentChange = {
  collection: string;
  id: string;
  before: RouteSnapshot[];
  after: RouteSnapshot[];
  reason: RevalidationReason;
};

export function changeReason(
  before: RouteSnapshot[],
  after: RouteSnapshot[],
  fallback: RevalidationReason = "update",
): RevalidationReason {
  if (before.length === 0 && after.length > 0) return "publish";
  if (before.length > 0 && after.length === 0) return "unpublish";
  const key = (row: RouteSnapshot) => `${row.tenant}|${row.locale}|${row.path}`;
  const was = new Set(before.map(key));
  return after.some((row) => !was.has(key(row))) ? "move" : fallback;
}

export function documentChange(
  changes: DocumentChange[],
  referrers: Referrer[],
  tenants: Tenant[],
  collection?: string,
  reason?: RevalidationReason,
): RevalidationChange {
  const collector = new Collector();
  for (const change of changes) {
    for (const row of [...change.before, ...change.after]) {
      collector.addRoute(row, tenants);
    }
    if (!isListCollection(change.collection)) continue;
    const rows = [...change.before, ...change.after];
    const owners = new Set(rows.map((row) => row.tenant));
    const scopes = owners.has(null)
      ? tenants
      : tenants.filter((tenant) => owners.has(tenant.id));
    collector.addList(change.collection, scopes);
  }
  for (const row of referrerRows(referrers)) collector.addRoute(row, tenants);
  return collector.build(
    collection ?? changes[0]?.collection,
    reason ?? changes[0]?.reason ?? "update",
  );
}

export function mergeChanges(
  changes: RevalidationChange[],
  collection?: string,
  reason?: RevalidationReason,
): RevalidationChange {
  const collector = new Collector();
  for (const change of changes) {
    for (const tag of change.tags) collector.tags.add(tag);
    for (const purge of change.purge) collector.addPurge(purge);
  }
  return collector.build(
    collection ?? changes[0]?.collection,
    reason ?? changes[0]?.reason ?? "update",
  );
}

export function templateBasePaths(
  recordType: TemplateRecordType,
  bases: Record<string, string | null | undefined> | undefined,
): Record<string, string> {
  const source =
    recordType === "post" || recordType === "category"
      ? CATEGORY_PREFIX_PATHS
      : bases;
  const out: Record<string, string> = {};
  for (const locale of localeCodes()) {
    const base = source?.[locale];
    if (base && base !== "/") out[locale] = base;
  }
  return out;
}

export function templateChange(
  {
    kind,
    recordType,
    tenant,
    governed,
    bases,
  }: {
    kind: TemplateKind;
    recordType: TemplateRecordType;
    tenant?: string | null;
    governed: RouteSnapshot[];
    bases?: Record<string, string | null | undefined>;
  },
  tenants: Tenant[],
): RevalidationChange {
  const collector = new Collector();
  const audience =
    kind === "shared"
      ? tenants
      : tenants.filter((candidate) => candidate.id === tenant);
  for (const row of governed) {
    if (kind === "tenant" && row.tenant !== null && row.tenant !== tenant) {
      continue;
    }
    const slug = slugOf(row.tenant, tenants);
    if (slug === undefined) continue;
    collector.tags.add(
      routeTag(row.tenant === null ? null : slug, row.locale, row.path),
    );
  }
  const prefixes = templateBasePaths(recordType, bases);
  for (const host of audience) {
    for (const [locale, base] of Object.entries(prefixes)) {
      collector.addPurge({
        host: host.host,
        pathPrefix: `${publicPath(locale, base)}/`,
      });
    }
  }
  return collector.build(TEMPLATE_COLLECTION[recordType], "template");
}

export function referrersChange(
  referrers: Referrer[],
  tenants: Tenant[],
  collection: string,
  reason: RevalidationReason,
): RevalidationChange {
  const collector = new Collector();
  for (const row of referrerRows(referrers)) collector.addRoute(row, tenants);
  return collector.build(collection, reason);
}
