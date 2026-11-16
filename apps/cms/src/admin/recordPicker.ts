import { getReach, type Reach } from "./components/kit/reach";
import { isOtherCompany, type PickerDoc } from "./linkPicker";

export type PickCollection =
  "products" | "solutions" | "jobs" | "posts" | "categories";

export const PICK_PAGE_SIZE = 10;

export const NOT_PUBLISHED_HINT = "Publish this first";

export const OTHER_SITE_NOTE = "Links to their site";

export const SHARED_PAGE_NOTE = "On Home: posts from every company";

export const COMPANY_PAGE_NOTE = "Only this company's records can be picked.";

export const WHO_CAN_BE_PICKED = {
  title: "Who can be picked",
  shared: "Posts from every company. Each card links to its company's site.",
  company: "Posts from this company only. Categories are always all three.",
} as const;

export const OVERRIDE_FIELDS = [
  "eyebrow",
  "title",
  "description",
  "image",
] as const;

export type OverrideField = (typeof OVERRIDE_FIELDS)[number];

export const OVERRIDE_LABELS: Record<OverrideField, string> = {
  eyebrow: "Eyebrow",
  title: "Title",
  description: "Description",
  image: "Override image",
};

const TITLE_FIELD: Record<PickCollection, "title" | "name"> = {
  products: "name",
  solutions: "name",
  jobs: "title",
  posts: "title",
  categories: "name",
};

const TENANT_COLLECTIONS: readonly PickCollection[] = ["jobs", "posts"];

export const PICK_NOUN: Record<PickCollection, string> = {
  products: "product",
  solutions: "solution",
  jobs: "job",
  posts: "post",
  categories: "category",
};

export function isPickCollection(
  value: string | undefined,
): value is PickCollection {
  return Boolean(value) && value! in TITLE_FIELD;
}

export function showCompanyChips(
  collection: PickCollection,
  pageTenant: string | undefined,
): boolean {
  return TENANT_COLLECTIONS.includes(collection) && !pageTenant;
}

export function pickerQuery({
  collection,
  term,
  pageTenant,
  company,
  page,
  locale,
}: {
  collection: PickCollection;
  term: string;
  pageTenant: string | undefined;
  company?: string;
  page: number;
  locale: string;
}): string {
  const params = new URLSearchParams({
    depth: "1",
    limit: String(PICK_PAGE_SIZE),
    page: String(page),
    draft: "true",
    locale,
    sort:
      collection === "posts"
        ? "-publishedAt"
        : collection === "jobs"
          ? "-postedDate"
          : TITLE_FIELD[collection],
  });
  const trimmed = term.trim();
  if (trimmed) {
    params.set(`where[${TITLE_FIELD[collection]}][like]`, trimmed);
  }
  if (TENANT_COLLECTIONS.includes(collection)) {
    const tenant = pageTenant || company;
    if (tenant) params.set("where[tenant][equals]", tenant);
  }
  return params.toString();
}

export type PickRow = {
  collection: PickCollection;
  id: number | string;
  title: string;
  meta: string;
  company: string;
  reach: Reach;
  status: "published" | "draft";
  selectable: boolean;
  otherSite: boolean;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nameOf(value: unknown): string {
  if (value && typeof value === "object") {
    return text((value as { name?: unknown }).name);
  }
  return "";
}

export function shortDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function rowMeta(collection: PickCollection, doc: PickerDoc): string {
  const parts =
    collection === "posts"
      ? [nameOf(doc.primaryCategory), shortDate(doc.publishedAt)]
      : collection === "jobs"
        ? [text(doc.department), shortDate(doc.postedDate)]
        : [];
  return parts.filter(Boolean).join(" · ");
}

export function pickTitle(collection: PickCollection, doc: PickerDoc): string {
  return text(doc[TITLE_FIELD[collection]]) || `Untitled (${doc.id})`;
}

export function toPickRow(
  collection: PickCollection,
  doc: PickerDoc,
  siteDomain = "",
): PickRow {
  const live =
    !doc.deletedAt &&
    (collection === "categories" || doc._status === "published");
  const tenant =
    doc.tenant && typeof doc.tenant === "object" ? doc.tenant : null;
  return {
    collection,
    id: doc.id,
    title: pickTitle(collection, doc),
    meta: rowMeta(collection, doc),
    company: tenant?.name ?? "",
    reach: getReach(doc, { collection }),
    status: live ? "published" : "draft",
    selectable: live,
    otherSite:
      TENANT_COLLECTIONS.includes(collection) &&
      isOtherCompany(doc, siteDomain),
  };
}

export function footerText(
  selected: number,
  used: number,
  max: number | undefined,
): string {
  const total = used + selected;
  return max
    ? `${selected} selected · ${total} of ${max} used`
    : `${selected} selected · ${total} used`;
}

export function atLimit(
  selected: number,
  used: number,
  max: number | undefined,
): boolean {
  return Boolean(max) && used + selected >= max!;
}

export function moveItem<T>(
  items: readonly T[],
  from: number,
  to: number,
): T[] {
  if (from === to || from < 0 || to < 0) return [...items];
  if (from >= items.length || to >= items.length) return [...items];
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  return next;
}

export function keyMove(key: string): number {
  if (key === "ArrowUp" || key === "ArrowLeft") return -1;
  if (key === "ArrowDown" || key === "ArrowRight") return 1;
  return 0;
}

export type OverrideNote = { text: string; inherited: boolean };

export function overrideFallback(
  field: OverrideField,
  post: PickerDoc | null | undefined,
): string {
  if (!post) return "";
  if (field === "eyebrow") return nameOf(post.primaryCategory);
  if (field === "title") return text(post.title) || text(post.name);
  if (field === "description") {
    return text(post.excerpt) || text(post.summary);
  }
  return post.coverImage ? "Using the post cover" : "";
}

export function overrideNote(
  field: OverrideField,
  own: unknown,
  post: PickerDoc | null | undefined,
): OverrideNote {
  const value = text(own);
  if (value) return { text: value, inherited: false };
  const fallback = overrideFallback(field, post);
  if (fallback) return { text: fallback, inherited: true };
  if (field === "description") {
    return { text: "Empty · uses the post's excerpt", inherited: true };
  }
  return { text: "Empty", inherited: true };
}

export function cardLinkLine(
  post: PickerDoc | null | undefined,
  siteDomain: string,
  locale: string,
): string {
  if (!post) return "";
  const path = post.path;
  const own =
    typeof path === "string" ? path : (path?.[locale] ?? path?.en ?? "");
  if (!own) return "";
  const tenant =
    post.tenant && typeof post.tenant === "object" ? post.tenant : null;
  if (tenant?.domain && isOtherCompany(post, siteDomain)) {
    return `${tenant.domain.replace(/^https?:\/\//, "")}${own}`;
  }
  return own;
}

export type LayoutBlock = {
  blockType?: string;
  source?: string | null;
  items?: unknown;
  heading?: { title?: unknown } | null;
};

export type PostSection = { number: number; title: string; count: number };

function pickCount(items: unknown): number {
  return Array.isArray(items) ? items.length : 0;
}

export function postsOnPage(
  layout: readonly LayoutBlock[] | null | undefined,
): PostSection[] {
  const sections: PostSection[] = [];
  (layout ?? []).forEach((block, index) => {
    if (block.blockType !== "postShowcase") return;
    if ((block.source ?? "manual") !== "manual") return;
    const count = pickCount(block.items);
    if (count === 0) return;
    const title = text(block.heading?.title).replace(/<[^>]*>/g, "");
    sections.push({ number: index + 1, title: title || "Post cards", count });
  });
  return sections;
}

export function postsOnPageTotal(sections: readonly PostSection[]): number {
  return sections.reduce((sum, section) => sum + section.count, 0);
}
