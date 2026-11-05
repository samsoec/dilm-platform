import { localization } from "./localization";

export type LocalizedSlugs = Record<string, string | null | undefined>;

export function localeCodes(): string[] {
  return (localization.locales as readonly (string | { code: string })[]).map(
    (locale) => (typeof locale === "string" ? locale : locale.code),
  );
}

export function slugForLocale(slugs: LocalizedSlugs, locale: string) {
  const own = slugs[locale];
  if (own) return { slug: own, fellBack: false };
  const fallback = slugs[localization.defaultLocale];
  return {
    slug: fallback || "",
    fellBack: Boolean(fallback) && locale !== localization.defaultLocale,
  };
}

export function usesSlugFallback(slugs: LocalizedSlugs): boolean {
  return localeCodes().some((locale) => slugForLocale(slugs, locale).fellBack);
}

export function computePath(
  parentPath: string | null | undefined,
  slug: string | null | undefined,
): string {
  const base = !parentPath || parentPath === "/" ? "" : parentPath;
  if (!slug) return base || "/";
  return `${base}/${slug}`;
}
