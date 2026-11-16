import {
  DETAIL_TYPE_LABELS,
  MAX_HIGHLIGHTS,
  SHARED_TEMPLATE_RECORD_TYPES,
  TEMPLATE_TOKENS,
  tokensIn,
  unknownTokenMessage,
  type DetailRecordType,
} from "@dilm/shared-types";

import { joinNames } from "../../../paths";
import { allSitesLabel } from "../kit/reach";

export const STRIP_ORDER: readonly DetailRecordType[] = [
  "product",
  "solution",
  "job",
  "post",
  "category",
];

export const TEMPLATE_COLLECTION_SLUGS = [
  "detail-templates",
  "shared-detail-templates",
] as const;

export function isTemplateCollection(slug: string | null | undefined): boolean {
  return (TEMPLATE_COLLECTION_SLUGS as readonly string[]).includes(slug ?? "");
}

export function isSharedType(type: DetailRecordType): boolean {
  return (SHARED_TEMPLATE_RECORD_TYPES as readonly string[]).includes(type);
}

export function stripReach(type: DetailRecordType): string {
  return isSharedType(type) ? allSitesLabel() : "This site";
}

export function templateTitle(type: DetailRecordType | undefined): string {
  return type ? `${DETAIL_TYPE_LABELS[type]} template` : "Detail template";
}

export function recordCountText(count: number | null): string {
  if (count === null) return "Pick a company";
  return `${count} ${count === 1 ? "record" : "records"}`;
}

export function publishingChangesText(
  count: number,
  sites: readonly string[],
): string {
  const pages = `${count} ${count === 1 ? "page" : "pages"}`;
  return sites.length > 0
    ? `Publishing changes ${pages} on ${joinNames([...sites])}`
    : `Publishing changes ${pages}`;
}

export const HIGHLIGHTS_SAME_NOTE = "same on every post page";

export const POST_LEFT_OUT_NOTE =
  "The post being read is left out of its own list.";

export const NEIGHBOURS_NOTE =
  "Previous and Next link to the posts published just before and after the one being read.";

export function highlightsCountText(items: unknown): string {
  const count = Array.isArray(items) ? items.length : 0;
  return `${count} of ${MAX_HIGHLIGHTS} · ${HIGHLIGHTS_SAME_NOTE}`;
}

export const CATEGORY_HERO_NOTE =
  "The active tab is this category: the page being drawn.";

export const CATEGORY_LISTING_NOTE =
  "Lists this category's posts, with its own side list of highlighted posts.";

export const CATEGORY_LISTING_SOURCE_WARNING =
  "On the category template the list should be drawn from This category, or every category page shows the same posts.";

export function categoryDrawsNote(paths: readonly string[]): string {
  const list = paths.length > 0 ? joinNames([...paths]) : "no category pages";
  return `Draws ${list}. Their SEO uses the category's name, description and cover.`;
}

export function tokenHint(type: DetailRecordType | undefined): string {
  const noun = type ? DETAIL_TYPE_LABELS[type].toLowerCase() : "record";
  return `The ${noun}'s name, in the page's language`;
}

export const TOKEN_OPEN_NOTE = "Typing { also opens this list.";

export const TOKEN_FIELD_EXEMPT = ["resultsLabel", "emptyState.title"];

export function isTokenField(id: string): boolean {
  return (
    id.startsWith("field-layout") &&
    !TOKEN_FIELD_EXEMPT.some((name) => id.endsWith(name.replace(".", "__")))
  );
}

export function badToken(text: string): string | undefined {
  const unknown = tokensIn(text).find(
    (name) => !(TEMPLATE_TOKENS as readonly string[]).includes(name),
  );
  return unknown === undefined ? undefined : unknownTokenMessage(unknown);
}

export type Chunk = { text: string; chip: boolean };

export function chunksOf(text: string): Chunk[] {
  const chunks: Chunk[] = [];
  let last = 0;
  for (const match of text.matchAll(/\{title\}/g)) {
    const at = match.index ?? 0;
    if (at > last) chunks.push({ text: text.slice(last, at), chip: false });
    chunks.push({ text: "title", chip: true });
    last = at + match[0].length;
  }
  if (last < text.length) chunks.push({ text: text.slice(last), chip: false });
  return chunks;
}

export function insertToken(
  text: string,
  caret: number,
  typedBrace: boolean,
): { text: string; caret: number } {
  const start = typedBrace && text[caret - 1] === "{" ? caret - 1 : caret;
  const token = "{title}";
  return {
    text: text.slice(0, start) + token + text.slice(caret),
    caret: start + token.length,
  };
}
