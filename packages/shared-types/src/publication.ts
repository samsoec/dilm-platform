import type { RecordContext } from "./detail-templates";

export const POST_LISTING_SOURCES = [
  "all",
  "currentCategory",
  "categories",
] as const;

export type PostListingSource = (typeof POST_LISTING_SOURCES)[number];

export const POST_LISTING_SOURCE_LABELS: Record<PostListingSource, string> = {
  all: "All posts",
  currentCategory: "This category",
  categories: "Chosen categories",
};

export const DEFAULT_POST_PAGE_SIZE = 10;

export const MAX_POST_PAGE_SIZE = 50;

export const CURRENT_CATEGORY_WARNING =
  '"This category" is for the Category template.';

type Count = number | null | undefined;

const countOf = (value: unknown): number =>
  Array.isArray(value) ? value.length : 0;

function counted(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function publicationHeroSummary(block: {
  categories?: unknown;
}): string {
  return `Search · ${counted(countOf(block.categories), "tab", "tabs")}`;
}

export function postListingSummary(block: {
  source?: string | null;
  categories?: unknown;
  pageSize?: Count;
}): string {
  const source: PostListingSource = POST_LISTING_SOURCES.includes(
    block.source as PostListingSource,
  )
    ? (block.source as PostListingSource)
    : "all";
  const label =
    source === "categories"
      ? counted(countOf(block.categories), "category", "categories")
      : POST_LISTING_SOURCE_LABELS[source];
  return `${label} · ${block.pageSize ?? DEFAULT_POST_PAGE_SIZE} per page`;
}

export type PostListingWarning = {
  index: number;
  message: string;
};

export function postListingWarnings(
  layout: unknown,
  context?: RecordContext | null,
): PostListingWarning[] {
  if (!Array.isArray(layout) || context?.recordType === "category") return [];
  return layout.flatMap((block, index) =>
    block?.blockType === "postListing" && block.source === "currentCategory"
      ? [{ index, message: CURRENT_CATEGORY_WARNING }]
      : [],
  );
}
