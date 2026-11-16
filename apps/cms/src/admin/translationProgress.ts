import type { Field } from "payload";

import {
  countTranslations,
  percent,
  type TranslationCount,
} from "./components/dashboard/model";

export const TRANSLATION_SOURCES = [
  { key: "pages", label: "Pages", collection: "pages", tenant: true },
  {
    key: "shared-pages",
    label: "Shared pages",
    collection: "shared-pages",
    tenant: false,
  },
  {
    key: "templates",
    label: "Templates",
    collection: "detail-templates",
    tenant: true,
  },
  { key: "products", label: "Products", collection: "products", tenant: true },
  {
    key: "solutions",
    label: "Solutions",
    collection: "solutions",
    tenant: true,
  },
  { key: "jobs", label: "Jobs", collection: "jobs", tenant: true },
  { key: "posts", label: "Posts", collection: "posts", tenant: true },
  {
    key: "categories",
    label: "Categories",
    collection: "categories",
    tenant: true,
  },
] as const;

export type TranslationSource = (typeof TRANSLATION_SOURCES)[number];
export type TranslationSourceKey = TranslationSource["key"];

export const TRANSLATION_ROWS_NOTE =
  "Rows link to the untranslated items. A slug counts when the ID slug is set and differs from EN.";

export type SlugState = "own" | "same" | "uses-en";

export type UntranslatedItem = {
  id: string | number;
  title: string;
  left: number;
  slug: SlugState | null;
};

export type SlugCount = { set: number; total: number };

export type TranslationRow = {
  key: TranslationSourceKey;
  label: string;
  collection: string;
  texts: TranslationCount;
  slugs: SlugCount | null;
  items: UntranslatedItem[];
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pick(value: unknown, code: string): string {
  if (value && typeof value === "object") {
    return text((value as Record<string, unknown>)[code]);
  }
  return "";
}

export function slugState(slug: unknown): SlugState | null {
  const en = pick(slug, "en");
  if (!en) return null;
  const id = pick(slug, "id");
  if (!id) return "uses-en";
  return id === en ? "same" : "own";
}

export const SLUG_STATE_LABELS: Record<Exclude<SlugState, "own">, string> = {
  same: "Same as EN",
  "uses-en": "Uses EN slug",
};

function titleOf(doc: Record<string, unknown>, titleField: string): string {
  const value = doc[titleField];
  const shown = pick(value, "en") || text(value);
  return shown || `#${String(doc.id)}`;
}

export function buildRow(
  source: TranslationSource,
  fields: readonly Field[],
  docs: readonly Record<string, unknown>[],
  titleField: string,
): TranslationRow {
  const texts = { translated: 0, total: 0 };
  const slugs = { set: 0, total: 0 };
  const items: UntranslatedItem[] = [];
  for (const doc of docs) {
    const count = countTranslations(fields, doc);
    texts.translated += count.translated;
    texts.total += count.total;
    const state = slugState(doc.slug);
    if (state) {
      slugs.total += 1;
      if (state === "own") slugs.set += 1;
    }
    const left = count.total - count.translated;
    if (left > 0 || (state !== null && state !== "own")) {
      items.push({
        id: doc.id as string | number,
        title: titleOf(doc, titleField),
        left,
        slug: state,
      });
    }
  }
  items.sort((a, b) => b.left - a.left || a.title.localeCompare(b.title));
  return {
    key: source.key,
    label: source.label,
    collection: source.collection,
    texts,
    slugs: slugs.total > 0 ? slugs : null,
    items,
  };
}

export function sumTexts(rows: readonly { texts: TranslationCount }[]) {
  return rows.reduce(
    (sum, row) => ({
      translated: sum.translated + row.texts.translated,
      total: sum.total + row.texts.total,
    }),
    { translated: 0, total: 0 },
  );
}

export function slugsText(slugs: SlugCount | null): string {
  if (!slugs) return "";
  return `${slugs.set} of ${slugs.total} ${slugs.total === 1 ? "slug" : "slugs"}`;
}

export function rowPercent(row: TranslationRow): number {
  return percent(row.texts);
}

export function sourceByKey(key: string): TranslationSource | undefined {
  return TRANSLATION_SOURCES.find((source) => source.key === key);
}

export function itemsHeading(label: string, count: number): string {
  return count === 0
    ? `${label}: nothing left to translate`
    : `${label}: ${count} ${count === 1 ? "item" : "items"} to translate`;
}

export function textsLeftText(left: number): string {
  return left === 0
    ? "Texts done"
    : `${left} ${left === 1 ? "text" : "texts"} left`;
}
