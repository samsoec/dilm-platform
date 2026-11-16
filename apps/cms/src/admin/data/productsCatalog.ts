import type { Payload } from "payload";

import { localization } from "../../localization";
import type { AdminQueryContext } from "./badges";
import {
  catalogWhere,
  matchesStatus,
  variantCount,
  type CatalogQuery,
} from "../components/products/catalog";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";

export const CATALOG_LIMIT = 200;

export type CatalogCompany = {
  id: string;
  name: string;
  domain?: string;
};

export type CatalogRow = {
  id: string;
  name: string;
  productGroup: string;
  owner: string;
  image?: { url: string; alt: string };
  variants: number;
  status: PublishStatus;
  updatedAt: string;
};

export type CatalogData = {
  companies: CatalogCompany[];
  rows: CatalogRow[];
  truncated: boolean;
  otherCount: number;
};

type RawProduct = {
  id: number | string;
  name?: string | null;
  productGroup?: string | null;
  tenant?: number | string | { id: number | string } | null;
  image?: { url?: string | null; alt?: string | null } | number | null;
  variants?: unknown;
  _status?: string | null;
  updatedAt: string;
};

function ownerID(tenant: RawProduct["tenant"]): string {
  if (tenant === null || tenant === undefined) return "";
  return String(typeof tenant === "object" ? tenant.id : tenant);
}

export async function loadCompanies({
  payload,
  user,
}: AdminQueryContext): Promise<CatalogCompany[]> {
  const { docs } = await payload.find({
    collection: "tenants",
    select: { name: true, domain: true },
    sort: "name",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  return docs.map(({ id, name, domain }) => ({
    id: String(id),
    name,
    domain: domain || undefined,
  }));
}

async function publishedIDs(
  { payload, user }: AdminQueryContext,
  ids: (number | string)[],
): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const { docs } = await payload.find({
    collection: "products",
    where: { id: { in: ids } },
    draft: false,
    pagination: false,
    depth: 0,
    select: { _status: true },
    overrideAccess: false,
    user,
  });
  return new Set(
    docs
      .filter(({ _status }) => _status === "published")
      .map(({ id }) => String(id)),
  );
}

export async function countProducts(
  { payload, user }: AdminQueryContext,
  excluding: string,
): Promise<number> {
  const { totalDocs } = await payload.count({
    collection: "products",
    where: { tenant: { not_equals: excluding } },
    overrideAccess: false,
    user,
  });
  return totalDocs;
}

export async function loadCatalog(
  context: AdminQueryContext,
  companies: CatalogCompany[],
  query: CatalogQuery,
  selected: string | undefined,
  locale: "en" | "id" = localization.defaultLocale,
): Promise<CatalogData> {
  const { payload, user } = context;
  const { docs } = await (payload as Payload).find({
    collection: "products",
    where: catalogWhere(query),
    draft: true,
    sort: "name",
    limit: CATALOG_LIMIT,
    depth: 1,
    locale,
    select: {
      name: true,
      productGroup: true,
      tenant: true,
      image: true,
      variants: { name: true },
      _status: true,
      updatedAt: true,
    },
    populate: { media: { url: true, alt: true } },
    overrideAccess: false,
    user,
  });
  const raw = docs as unknown as RawProduct[];
  const published = await publishedIDs(
    context,
    raw.map(({ id }) => id),
  );
  const rows = raw
    .map((product): CatalogRow => {
      const image = typeof product.image === "object" ? product.image : null;
      return {
        id: String(product.id),
        name: product.name ?? "",
        productGroup: product.productGroup ?? "",
        owner: ownerID(product.tenant),
        image: image?.url
          ? { url: image.url, alt: image.alt ?? "" }
          : undefined,
        variants: variantCount(product.variants),
        status: getPublishStatus(
          { _status: product._status },
          { hasPublishedVersion: published.has(String(product.id)) },
        ),
        updatedAt: product.updatedAt,
      };
    })
    .filter(({ status }) => matchesStatus(status, query.status));
  const otherCount =
    selected === undefined ? 0 : await countProducts(context, selected);
  return {
    companies,
    rows,
    truncated: raw.length >= CATALOG_LIMIT,
    otherCount,
  };
}
