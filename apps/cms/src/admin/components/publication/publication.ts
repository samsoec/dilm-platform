import {
  EMPTY_TITLE_TOKENS,
  MAX_HIGHLIGHTS,
  RESULTS_LABEL_TOKENS,
  scopedTokenProblem,
  unknownEmptyTitleTokenMessage,
  unknownResultsTokenMessage,
} from "@dilm/shared-types";

export const PUBLICATION_TAG = "Publication page";

export const PUBLICATION_PANEL_TITLE = "This is the Publication page";

export const PUBLICATION_DEPENDENTS = [
  "The Navbar search icon opens it.",
  'The "All Updates" tab on every category page links here.',
  "It is the first crumb on every post page.",
] as const;

export const PUBLICATION_SET_NOTE =
  "Set in Company settings › Publication page. It can't be unpublished or trashed while it's set.";

export const PUBLICATION_SETTINGS_LABEL = "Company settings › Publication page";

export const CATEGORY_TABS_NOTE =
  "Category tabs come from the Hero section, in the order set there. Category names are owned by the Super Admin.";

export const PREVIEW_LISTING_TITLE = "Preview the listing";

export const ALL_TAB_DEFAULT = "All Updates";

export const ALL_TAB_NOTE = "Always first. It can't be moved or removed.";

export const CATEGORY_NAMES_NOTE =
  "Category names are owned by the Super Admin. To rename one, ask them to change it under Categories.";

export const FEATURED_FALLBACK_NOTE = "Empty uses the newest post.";

export const LIMIT_REACHED_NOTE =
  "Limit reached. The side list fits 5 posts; remove one to add another.";

export const SOURCE_HINT =
  '"This category" is for the Category template. Anywhere else it shows nothing.';

export function categoryTabsCount(picked: number, total: number): string {
  return `All + ${picked} of ${total} ${total === 1 ? "category" : "categories"}`;
}

export function highlightsCount(count: number): string {
  return `${count} of ${MAX_HIGHLIGHTS}`;
}

export function newestPostText(title: string | null | undefined): string {
  return title ? `Newest post: ${title}` : FEATURED_FALLBACK_NOTE;
}

export type TokenKind = "results" | "empty";

const TOKEN_SETS: Record<TokenKind, readonly string[]> = {
  results: RESULTS_LABEL_TOKENS,
  empty: EMPTY_TITLE_TOKENS,
};

export function tokenKindOf(path: string): TokenKind {
  return path.endsWith("emptyState.title") ? "empty" : "results";
}

export function tokenChoices(kind: TokenKind): readonly string[] {
  return TOKEN_SETS[kind];
}

export const TOKEN_MEANINGS: Record<string, string> = {
  count: "How many posts match",
  query: "What the visitor typed",
};

export function tokenProblem(
  text: string | null | undefined,
  kind: TokenKind,
): string | undefined {
  return scopedTokenProblem(text ?? "", {
    allowed: TOKEN_SETS[kind],
    message:
      kind === "results"
        ? unknownResultsTokenMessage
        : unknownEmptyTitleTokenMessage,
  });
}

export type Piece = { text: string; chip: boolean; bad: boolean };

export function tokenPieces(
  text: string | null | undefined,
  kind: TokenKind,
): Piece[] {
  const value = text ?? "";
  const known = TOKEN_SETS[kind];
  const pieces: Piece[] = [];
  let last = 0;
  for (const match of value.matchAll(/\{([A-Za-z][A-Za-z0-9_-]*)\}/g)) {
    const at = match.index ?? 0;
    if (at > last) {
      pieces.push({ text: value.slice(last, at), chip: false, bad: false });
    }
    pieces.push({
      text: match[1]!,
      chip: true,
      bad: !known.includes(match[1]!),
    });
    last = at + match[0].length;
  }
  if (last < value.length) {
    pieces.push({ text: value.slice(last), chip: false, bad: false });
  }
  return pieces;
}

export function insertAt(
  text: string,
  caret: number,
  name: string,
  typedBrace: boolean,
): { text: string; caret: number } {
  const start = typedBrace && text[caret - 1] === "{" ? caret - 1 : caret;
  const token = `{${name}}`;
  return {
    text: text.slice(0, start) + token + text.slice(caret),
    caret: start + token.length,
  };
}

export function selectableCategories<T extends { id: number | string }>(
  all: readonly T[],
  picked: readonly string[],
): T[] {
  return all.filter((category) => !picked.includes(String(category.id)));
}
