import { slugForLocale } from "../../../pathCompute";
import type { PathProblem } from "../../../paths";
import { ROOT_MESSAGE, slugShapeProblem } from "../../../slugRules";

export type ParentOption = {
  id: string;
  collection: "pages" | "shared-pages";
  title: string;
  paths: Record<string, string>;
  shared: boolean;
};

export type SlugField = "slug-en" | "slug-id";

export type DialogProblem = {
  field: SlugField;
  locale: string;
  kind: "reserved" | "shared" | "same-site" | "root" | "empty" | "invalid";
  message: string;
  open?: { collection: "pages"; id: string };
};

export type CheckBody = {
  tenant: string;
  parent?: string;
  slugs: Record<string, string>;
};

export type CreateBody = CheckBody & { title: string };

export const NEW_PAGE_MODAL = "new-page";

export const DRAFT_NOTE =
  "Created as a draft. Nothing is public until you publish.";

export const SLUG_HINT = "Suggested from the title. a–z, 0–9 and hyphens.";

export const SHARED_PARENT_NOTE = "Shared, can't be a parent";

export const NO_PARENT_LABEL = "No parent (top level)";

export const CHECK_FOOTNOTE =
  "Checked as you type and again on save. The same slug on another company's site is fine: each site shows its own page.";

export const CHECK_FAILED =
  "The slug couldn't be checked. It is checked again when you create the page.";

export function slugFieldOf(locale: string): SlugField {
  return locale === "en" ? "slug-en" : "slug-id";
}

export function languageName(locale: string): string {
  return (
    new Intl.DisplayNames(["en"], { type: "language" }).of(locale) ?? locale
  );
}

export function dialogProblem(problem: PathProblem): DialogProblem {
  const base = { field: slugFieldOf(problem.locale), locale: problem.locale };
  if (problem.kind === "same-site" && problem.existing) {
    return {
      ...base,
      kind: "same-site",
      message: `"${problem.existing.title}" already uses ${problem.path} in ${languageName(problem.locale)}.`,
      open: { collection: "pages", id: String(problem.existing.id) },
    };
  }
  if (problem.kind === "shared" && problem.path === "/") {
    return { ...base, kind: "root", message: ROOT_MESSAGE };
  }
  return {
    ...base,
    kind: problem.kind === "reserved" ? "reserved" : "shared",
    message: problem.message,
  };
}

export function shapeProblems(
  slugs: Record<string, string>,
  hasParent: boolean,
): DialogProblem[] {
  const found: DialogProblem[] = [];
  for (const locale of ["en", "id"]) {
    const message = slugShapeProblem(slugs[locale], {
      required: locale === "en",
      hasParent,
    });
    if (!message) continue;
    found.push({
      field: slugFieldOf(locale),
      locale,
      message,
      kind: slugs[locale] ? "invalid" : hasParent ? "empty" : "root",
    });
  }
  return found;
}

export function parentOptionsPath(apiBase: string, tenant: string): string {
  return `${apiBase}/pages/parent-options?tenant=${encodeURIComponent(tenant)}`;
}

export function checkSlugPath(apiBase: string): string {
  return `${apiBase}/pages/check-slug`;
}

export function createDraftPath(apiBase: string): string {
  return `${apiBase}/pages/create-draft`;
}

export function matchesQuery(option: ParentOption, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    option.title.toLowerCase().includes(needle) ||
    Object.values(option.paths).some((path) =>
      path.toLowerCase().includes(needle),
    )
  );
}

export function orderedParents(
  options: readonly ParentOption[],
): ParentOption[] {
  const byPath = (a: ParentOption, b: ParentOption) =>
    (a.paths.en ?? a.title).localeCompare(b.paths.en ?? b.title);
  return [
    ...options.filter(({ shared }) => !shared).sort(byPath),
    ...options.filter(({ shared }) => shared).sort(byPath),
  ];
}

export function pickableParent(
  options: readonly ParentOption[],
  wanted: string | null | undefined,
): ParentOption | undefined {
  if (!wanted || !/^\d+$/.test(wanted)) return undefined;
  return options.find(
    (option) =>
      !option.shared && option.collection === "pages" && option.id === wanted,
  );
}

export function slugsPayload(
  slugEn: string,
  slugId: string,
): Record<string, string> {
  return { en: slugEn.trim(), id: slugId.trim() };
}

export function idSlugNote(slugEn: string, slugId: string): string {
  const { slug, fellBack } = slugForLocale(slugsPayload(slugEn, slugId), "id");
  return fellBack
    ? `Empty: the Indonesian address uses the English slug (${slug}).`
    : "Optional. Empty uses the English slug.";
}

export function splitDisplay(display: string): { head: string; tail: string } {
  const trimmed = display.endsWith("/") ? display.slice(0, -1) : display;
  const at = trimmed.lastIndexOf("/");
  if (display.endsWith("/")) return { head: `${trimmed}/`, tail: "" };
  return { head: trimmed.slice(0, at + 1), tail: trimmed.slice(at + 1) };
}
