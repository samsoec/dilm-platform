export const LEGAL_PAGE_TAG = "Legal page";

export const TEXT_CHANGED_FLAG = "Text changed since this date";

export const LEGAL_DATE_QUESTION =
  "The text changed but the date didn't. Update it?";

export const PUBLISH_AS_IS = "Publish as is";

export const SET_TODAY_AND_PUBLISH = "Set to today and publish";

export const LEGAL_DATE_REQUIRED =
  "Set the Last updated date before publishing. Saving a draft works without it.";

export const LEGAL_DATE_INVALID =
  "Choose a valid Last updated date, no more than a day ahead.";

export const TOC_EMPTY_NOTICE =
  '"On this page" is on, but the body has no H2 headings yet, so the list will be empty. Add numbered H2s, or turn the list off.';

export const TOC_BUILT_FROM = "Built from the H2 headings below";

export const TOC_TOGGLE_LABEL = 'Show "On this page" list';

export const TOC_PREVIEW_TITLE = "On this page · as visitors see it";

export const LEGAL_PAGES_TITLE = "Legal pages of this site";

export const LEGAL_PAGES_EMPTY = "No other legal pages yet.";

export const LINKED_BY_CONSENT = "· linked by form consent";

export const LINKED_BY_COOKIE_BANNER = "· linked by cookie banner";

export const LEGAL_OWN_TEXT =
  "Each company writes its own. They name PT Dunia Kimia Utama and its contacts.";

export function tocSummary(count: number): string {
  return `On this page · ${count} ${count === 1 ? "heading" : "headings"}`;
}

type Node = {
  type?: unknown;
  tag?: unknown;
  text?: unknown;
  children?: unknown;
};

function rootOf(value: unknown): Node | null {
  const root = (value as { root?: unknown } | null | undefined)?.root;
  return root && typeof root === "object" ? (root as Node) : null;
}

function childrenOf(node: Node): Node[] {
  return Array.isArray(node.children) ? (node.children as Node[]) : [];
}

function textOf(node: Node): string {
  if (typeof node.text === "string") return node.text;
  return childrenOf(node).map(textOf).join("");
}

export function bodyText(value: unknown): string {
  const root = rootOf(value);
  return root ? childrenOf(root).map(textOf).join("\n") : "";
}

export function h2Headings(value: unknown): string[] {
  const root = rootOf(value);
  if (!root) return [];
  const found: string[] = [];
  const walk = (node: Node) => {
    if (node.type === "heading" && node.tag === "h2") {
      const text = textOf(node).trim();
      if (text !== "") found.push(text);
      return;
    }
    childrenOf(node).forEach(walk);
  };
  walk(root);
  return found;
}

export function anchorSlug(text: string): string {
  const slug = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug === "" ? "section" : slug;
}

export type TocEntry = { text: string; anchor: string };

export function tocEntries(value: unknown): TocEntry[] {
  const used = new Map<string, number>();
  return h2Headings(value).map((text) => {
    const base = anchorSlug(text);
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    return { text, anchor: seen === 0 ? base : `${base}-${seen + 1}` };
  });
}

export function fingerprint(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

type Row = { blockType?: unknown; body?: unknown };

export function layoutFingerprint(layout: unknown): string {
  const rows = Array.isArray(layout) ? (layout as Row[]) : [];
  return fingerprint(
    rows
      .filter((row) => row?.blockType === "richText")
      .map((row) => bodyText(row.body))
      .join("\n\n"),
  );
}

export function dayOf(value: unknown): string | null {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10);
}

export function checkLastUpdated(
  value: unknown,
  now: Date = new Date(),
): true | string {
  if (value === null || value === undefined || value === "") {
    return LEGAL_DATE_REQUIRED;
  }
  const day = dayOf(value);
  if (day === null) return LEGAL_DATE_INVALID;
  const limit = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return day > limit ? LEGAL_DATE_INVALID : true;
}

export function nextStamp({
  previousStamp,
  previousDate,
  date,
  current,
}: {
  previousStamp: unknown;
  previousDate: unknown;
  date: unknown;
  current: string;
}): string {
  const dateChanged = dayOf(previousDate) !== dayOf(date);
  return typeof previousStamp === "string" &&
    previousStamp !== "" &&
    !dateChanged
    ? previousStamp
    : current;
}

export function textChangedSince(
  stamp: unknown,
  current: string,
  date: unknown,
  savedDate: unknown,
): boolean {
  return (
    dayOf(date) !== null &&
    dayOf(date) === dayOf(savedDate) &&
    typeof stamp === "string" &&
    stamp !== "" &&
    stamp !== current
  );
}
