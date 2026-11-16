import { PREVIEW_PATH, signPreviewToken } from "@dilm/runtime-config";
import { DETAIL_TYPE_LABELS, type DetailRecordType } from "@dilm/shared-types";

export const PREVIEW_COLLECTIONS = [
  "pages",
  "shared-pages",
  "detail-templates",
  "shared-detail-templates",
  "posts",
  "jobs",
  "categories",
  "products",
  "solutions",
] as const;

export type PreviewCollection = (typeof PREVIEW_COLLECTIONS)[number];

export const TEMPLATE_COLLECTIONS = [
  "detail-templates",
  "shared-detail-templates",
] as const;

export const TEMPLATE_RECORD_COLLECTION: Record<string, string> = {
  product: "products",
  solution: "solutions",
  job: "jobs",
  post: "posts",
  category: "categories",
};

export const LISTING_STATES = ["initial", "search", "none"] as const;
export type ListingState = (typeof LISTING_STATES)[number];

export const LISTING_LABELS: Record<ListingState, string> = {
  initial: "Initial",
  search: "Search",
  none: "No results",
};

export const LISTING_SAMPLE_WORD = "sample";
export const LISTING_NO_MATCH = "no-match";

export const PREVIEW_UNAVAILABLE_MESSAGE =
  "The site couldn't build the preview.";
export const BUILDING_PREVIEW = "Building your preview…";
export const RECORD_TIP =
  "Tip: pick one with many variants to check the spec table.";
export const LISTING_NOTE =
  'The switcher fills ?q= for you; "No results" uses a query that matches nothing.';

export function listingQuery(state: ListingState): string | undefined {
  if (state === "search") return LISTING_SAMPLE_WORD;
  if (state === "none") return LISTING_NO_MATCH;
  return undefined;
}

export function recordTypeLabel(type: string): string {
  return DETAIL_TYPE_LABELS[type as DetailRecordType] ?? type;
}

type PathValue = string | Record<string, string | null | undefined> | null;

export type PreviewDoc = { path?: PathValue };

export type PreviewTenant = { domain?: string | null } | null | undefined;

export type PreviewUrlInput = {
  doc: PreviewDoc;
  collection: PreviewCollection;
  tenant: PreviewTenant;
  locale: string;
  record?: PreviewDoc | null;
  q?: string | null;
  secret?: string;
  now?: number;
};

function bare(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function pathOf(doc: PreviewDoc | null | undefined, locale: string) {
  const path = doc?.path;
  const value = typeof path === "string" ? path : path?.[locale];
  return typeof value === "string" && value ? value : undefined;
}

export function previewPath(
  input: Pick<PreviewUrlInput, "doc" | "collection" | "locale" | "record">,
): string | undefined {
  const isTemplate = (TEMPLATE_COLLECTIONS as readonly string[]).includes(
    input.collection,
  );
  const tail = pathOf(isTemplate ? input.record : input.doc, input.locale);
  if (!tail) return undefined;
  return `/${input.locale}${tail === "/" ? "" : tail}`;
}

export function buildPreviewUrl(input: PreviewUrlInput): string | null {
  const domain = input.tenant?.domain ? bare(input.tenant.domain) : "";
  const path = previewPath(input);
  const secret = input.secret ?? process.env.PREVIEW_SECRET;
  if (!domain || !path || !secret) return null;
  const token = signPreviewToken(path, secret, input.now);
  const query = new URLSearchParams({ token, path });
  if (input.q) query.set("q", input.q);
  return `https://${domain}${PREVIEW_PATH}?${query.toString()}`;
}

export function previewUrlsFor(
  input: Omit<PreviewUrlInput, "tenant"> & {
    tenants: readonly PreviewTenant[];
  },
): (string | null)[] {
  const { tenants, ...rest } = input;
  return tenants.map((tenant) => buildPreviewUrl({ ...rest, tenant }));
}
