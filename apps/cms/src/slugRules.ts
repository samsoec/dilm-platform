export const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const SLUG_MESSAGE =
  "Use lowercase letters, numbers and hyphens only (a-z, 0-9, -).";

export const SLUG_REQUIRED_MESSAGE = "Add the page's slug.";

export const ROOT_MESSAGE =
  "The root URL / is the shared Home. Give this page a slug.";

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugShapeProblem(
  slug: string | null | undefined,
  options: { required: boolean; hasParent: boolean },
): string | undefined {
  if (!slug) {
    if (!options.required) return undefined;
    return options.hasParent ? SLUG_REQUIRED_MESSAGE : ROOT_MESSAGE;
  }
  return SLUG_PATTERN.test(slug) ? undefined : SLUG_MESSAGE;
}
