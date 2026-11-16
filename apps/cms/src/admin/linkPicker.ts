import {
  REFERENCE_COLLECTIONS,
  TENANT_OWNED,
  type ReferenceCollection,
} from "../fields/link";

export type PickerDoc = {
  id: number | string;
  _status?: string | null;
  deletedAt?: string | null;
  path?: string | Record<string, string | null | undefined> | null;
  tenant?:
    | number
    | string
    | { id: number | string; name?: string | null; domain?: string | null }
    | null;
  [key: string]: unknown;
};

type CollectionInfo = {
  noun: string;
  group: string;
  titleField: "title" | "name";
};

export const REFERENCE_INFO: Record<ReferenceCollection, CollectionInfo> = {
  pages: { noun: "Page", group: "Pages · this site", titleField: "title" },
  "shared-pages": {
    noun: "Shared page",
    group: "Shared pages · all companies",
    titleField: "title",
  },
  products: {
    noun: "Product",
    group: "Products · all companies",
    titleField: "name",
  },
  solutions: {
    noun: "Solution",
    group: "Solutions · all companies",
    titleField: "name",
  },
  jobs: { noun: "Job", group: "Jobs · this site", titleField: "title" },
  posts: { noun: "Post", group: "Posts · this site", titleField: "title" },
  categories: {
    noun: "Category",
    group: "Categories · all companies",
    titleField: "name",
  },
};

export const NOT_SELECTABLE = "Publish this first to link to it";

export const OTHER_COMPANY_NOTE =
  "This belongs to another company, so the link uses its full address.";

export const LINK_STATE_LOST =
  "This page or record is no longer published, so the link shows its text only.";

export const RENAME_HINT =
  "Typed paths don't follow renames. Pick the page instead if you can.";

export const ROW_LINK_HINT =
  "Rows linked to a page show its name with a link icon instead of a path.";

export function isReferenceCollection(
  value: string | undefined,
): value is ReferenceCollection {
  return (REFERENCE_COLLECTIONS as readonly string[]).includes(value ?? "");
}

export function referenceTitle(relationTo: string, doc: PickerDoc): string {
  if (!isReferenceCollection(relationTo)) return String(doc.id);
  const title = doc[REFERENCE_INFO[relationTo].titleField];
  return typeof title === "string" && title ? title : `Untitled (${doc.id})`;
}

export function docPath(doc: PickerDoc, locale: string): string {
  const path = doc.path;
  if (!path) return "";
  if (typeof path === "string") return path;
  return path[locale] || path.en || "";
}

export function isLive(relationTo: string, doc: PickerDoc): boolean {
  if (doc.deletedAt) return false;
  return relationTo === "categories" || doc._status === "published";
}

export function companyOf(doc: PickerDoc): { name: string; domain: string } {
  const tenant = doc.tenant;
  if (!tenant || typeof tenant !== "object") return { name: "", domain: "" };
  return { name: tenant.name ?? "", domain: tenant.domain ?? "" };
}

function bareDomain(value: string): string {
  return value
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

export function isOtherCompany(doc: PickerDoc, siteDomain: string): boolean {
  const { domain } = companyOf(doc);
  if (!domain || !siteDomain) return false;
  return bareDomain(domain) !== bareDomain(siteDomain);
}

export function shownUrl(
  doc: PickerDoc,
  { siteDomain, locale }: { siteDomain: string; locale: string },
): string {
  const path = docPath(doc, locale);
  if (!path) return "";
  if (!isOtherCompany(doc, siteDomain)) return path;
  return `https://${bareDomain(companyOf(doc).domain)}${path}`;
}

export type TargetState = "empty" | "ready" | "lost";

export function targetState(
  relationTo: string | undefined,
  doc: PickerDoc | null | undefined,
  hasValue: boolean,
): TargetState {
  if (!hasValue) return "empty";
  if (!relationTo || !doc) return "lost";
  return isLive(relationTo, doc) ? "ready" : "lost";
}

export function searchQuery(
  relationTo: ReferenceCollection,
  term: string,
  tenant: string | undefined,
): string {
  const params = new URLSearchParams({
    depth: "1",
    limit: "20",
    draft: "true",
  });
  const trimmed = term.trim();
  if (trimmed) {
    params.set(
      `where[${REFERENCE_INFO[relationTo].titleField}][like]`,
      trimmed,
    );
  }
  if (tenant && TENANT_OWNED.includes(relationTo)) {
    params.set("where[tenant][equals]", tenant);
  }
  return params.toString();
}

export type PickerRow = {
  relationTo: ReferenceCollection;
  id: number | string;
  title: string;
  path: string;
  company: string;
  status: "published" | "draft";
  selectable: boolean;
};

export function toRow(
  relationTo: ReferenceCollection,
  doc: PickerDoc,
  locale: string,
): PickerRow {
  const live = isLive(relationTo, doc);
  return {
    relationTo,
    id: doc.id,
    title: referenceTitle(relationTo, doc),
    path: docPath(doc, locale),
    company: companyOf(doc).name,
    status: live ? "published" : "draft",
    selectable: live,
  };
}

export type PickerGroup = {
  relationTo: ReferenceCollection;
  label: string;
  rows: PickerRow[];
};

export function groupRows(
  rows: PickerRow[],
  filter: ReferenceCollection | "all",
): PickerGroup[] {
  return REFERENCE_COLLECTIONS.filter(
    (relationTo) => filter === "all" || filter === relationTo,
  )
    .map((relationTo) => ({
      relationTo,
      label: REFERENCE_INFO[relationTo].group,
      rows: rows.filter((row) => row.relationTo === relationTo),
    }))
    .filter((group) => group.rows.length > 0);
}
