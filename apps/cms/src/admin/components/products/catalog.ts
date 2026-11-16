import type { Where } from "payload";

import {
  hasTenantAccess,
  isTenantEditorOrAbove,
  type RoleHolder,
} from "../../../access";
import { joinNames } from "../../../paths";
import type { PublishStatus } from "../kit/publication";
import type { SearchParams } from "../lists/statusQuery";

export const CATALOG_STATUSES = ["draft", "published", "changed"] as const;

export type CatalogStatus = (typeof CATALOG_STATUSES)[number];

export type CatalogQuery = {
  owner: "all" | string;
  status: CatalogStatus | undefined;
  search: string;
};

export const OWNER_PARAM = "owner";
export const STATUS_PARAM = "status";
export const SEARCH_PARAM = "q";
export const ALL_COMPANIES = "all";
export const SEARCH_MAX_LENGTH = 100;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function parseCatalogQuery(
  searchParams: SearchParams | undefined,
  selected: string | undefined,
  companyIds: readonly string[],
): CatalogQuery {
  const params = searchParams ?? {};
  const owner = first(params[OWNER_PARAM]);
  const status = first(params[STATUS_PARAM]);
  const fallback = selected ?? ALL_COMPANIES;
  return {
    owner:
      owner === ALL_COMPANIES || companyIds.includes(owner) ? owner : fallback,
    status: (CATALOG_STATUSES as readonly string[]).includes(status)
      ? (status as CatalogStatus)
      : undefined,
    search: first(params[SEARCH_PARAM]).trim().slice(0, SEARCH_MAX_LENGTH),
  };
}

export function catalogWhere(query: CatalogQuery): Where {
  const clauses: Where[] = [];
  if (query.owner !== ALL_COMPANIES) {
    clauses.push({ tenant: { equals: query.owner } });
  }
  if (query.search) {
    clauses.push({
      or: [
        { name: { like: query.search } },
        { casNumber: { like: query.search } },
      ],
    });
  }
  if (query.status === "published") {
    clauses.push({ _status: { equals: "published" } });
  } else if (query.status) {
    clauses.push({ _status: { not_equals: "published" } });
  }
  return clauses.length > 0 ? { and: clauses } : {};
}

export function matchesStatus(
  status: PublishStatus,
  wanted: CatalogStatus | undefined,
): boolean {
  return wanted === undefined || status === wanted;
}

export function catalogHref(
  pathname: string,
  query: Partial<CatalogQuery>,
  selected: string | undefined,
): string {
  const params = new URLSearchParams();
  if (query.owner && query.owner !== (selected ?? ALL_COMPANIES)) {
    params.set(OWNER_PARAM, query.owner);
  }
  if (query.status) params.set(STATUS_PARAM, query.status);
  if (query.search) params.set(SEARCH_PARAM, query.search);
  const text = params.toString();
  return text ? `${pathname}?${text}` : pathname;
}

export function ownerLabel(
  owner: string,
  selected: string | undefined,
  name: string,
): string {
  return owner === selected ? "Yours" : name;
}

export function variantCount(variants: unknown): number {
  return Array.isArray(variants) ? variants.length : 0;
}

export function productsText(count: number): string {
  return `${count} ${count === 1 ? "product" : "products"}`;
}

export function ownerBannerText(owner: string): string {
  return `Owned by ${owner}. Only ${owner} editors or a Super Admin can change it. You can view it and pick it into your pages.`;
}

export function emptyCatalogText(
  company: string,
  count: number,
  others: readonly string[],
  domain: string | undefined,
): string {
  const site = domain ?? "this site";
  if (count === 0) return `${company} has no products yet.`;
  const are = count === 1 ? "is" : "are";
  return `${company} has no products yet. ${productsText(count)} from ${joinNames([...others])} ${are} already shown on ${site}.`;
}

export const SAVED_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function savedText(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : SAVED_FORMAT.format(date);
}

export function canEditProduct(
  user: RoleHolder,
  owner: number | string,
): boolean {
  return isTenantEditorOrAbove(user) && hasTenantAccess(user, owner);
}
