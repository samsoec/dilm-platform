import {
  computePath,
  slugForLocale,
  type LocalizedSlugs,
} from "../../../pathCompute";

export type ParentPaths = Record<string, string | null | undefined>;

export type UrlRow = {
  locale: string;
  path: string;
  display: string;
  href: string;
  slug: string;
  fellBack: boolean;
  incomplete: boolean;
};

export type UrlInput = {
  domain?: string | null;
  locales: readonly string[];
  defaultLocale: string;
  slugs: LocalizedSlugs;
  parentPaths?: ParentPaths | null;
  parent?: boolean;
};

export function bareDomain(domain: string | null | undefined): string {
  return (domain ?? "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

export function computeUrls({
  domain,
  locales,
  defaultLocale,
  slugs,
  parentPaths,
  parent = true,
}: UrlInput): UrlRow[] {
  const host = bareDomain(domain);
  return locales.map((locale) => {
    const { slug, fellBack } = slugForLocale(slugs, locale);
    const above = parent
      ? parentPaths?.[locale] || parentPaths?.[defaultLocale]
      : undefined;
    const path = computePath(above, slug);
    const tail = path === "/" ? "" : path;
    const display = `${host}/${locale}${tail}${slug || tail === "" ? "" : "/"}`;
    return {
      locale,
      path,
      slug,
      fellBack,
      incomplete: !slug,
      display,
      href: host ? `https://${display}` : display,
    };
  });
}

export function mergeSlugs(
  stored: LocalizedSlugs | null | undefined,
  editing: { locale: string; slug: string | null | undefined },
): LocalizedSlugs {
  return { ...stored, [editing.locale]: editing.slug ?? "" };
}

export type SlugWarning = { locale: string; slug: string; message: string };

export function slugFallbackWarning(
  slugs: LocalizedSlugs,
  locales: readonly string[],
  defaultLocale: string,
  names: Record<string, string> = {},
): SlugWarning | undefined {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    const { slug, fellBack } = slugForLocale(slugs, locale);
    if (!fellBack) continue;
    const language = names[locale] ?? locale.toUpperCase();
    const source = names[defaultLocale] ?? defaultLocale.toUpperCase();
    return {
      locale,
      slug,
      message: `No ${language} slug yet. The ${locale.toUpperCase()} address uses the ${source} slug (${slug}).`,
    };
  }
  return undefined;
}

export type RelationValue =
  | number
  | string
  | { id: number | string }
  | { relationTo?: string; value?: RelationValue }
  | null
  | undefined;

export function relationId(value: RelationValue): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value !== "object") return String(value);
  if ("id" in value) return String(value.id);
  return "value" in value ? relationId(value.value) : undefined;
}

export function parentLookupPath(
  collection: string,
  parent: string,
  apiRoute = "/api",
): string {
  return `${apiRoute}/${collection}/${encodeURIComponent(parent)}?locale=all&fallbackLocale=false&depth=0&trash=true&select[path]=true`;
}

export function pathsOf(doc: unknown): ParentPaths {
  const path = (doc as { path?: unknown } | undefined)?.path;
  if (path && typeof path === "object") {
    return path as ParentPaths;
  }
  return typeof path === "string" ? { en: path } : {};
}

export function slugsOf(doc: unknown): LocalizedSlugs {
  const slug = (doc as { slug?: unknown } | undefined)?.slug;
  if (slug && typeof slug === "object") return slug as LocalizedSlugs;
  return typeof slug === "string" ? { en: slug } : {};
}
