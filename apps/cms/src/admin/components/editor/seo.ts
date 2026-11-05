import { SEO_LIMITS } from "../../data/socialPlatforms";
import { bareDomain } from "./urls";

type ByLocale = Record<string, string | null | undefined>;

export type SeoImage = { id: number | string; filename?: string | null };

export type SeoDefaults = {
  title: ByLocale;
  description: ByLocale;
  image: SeoImage | null;
};

export const NO_SEO_DEFAULTS: SeoDefaults = {
  title: {},
  description: {},
  image: null,
};

export type SeoValues = {
  title?: string | null;
  description?: string | null;
  image?: unknown;
};

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function defaultFor(map: ByLocale, locale: string, defaultLocale: string) {
  return text(map[locale]) || text(map[defaultLocale]);
}

export type SeoText = {
  value: string;
  length: number;
  limit: number;
  over: boolean;
  usingDefault: boolean;
  fallback: string;
  shown: string;
};

function seoText(
  value: string | null | undefined,
  fallback: string,
  limit: number,
): SeoText {
  const own = text(value);
  const length = (value ?? "").length;
  return {
    value: own,
    length,
    limit,
    over: length > limit,
    usingDefault: own === "",
    fallback,
    shown: own || fallback,
  };
}

export type SeoView = {
  title: SeoText;
  description: SeoText;
  image: { chosen: boolean; usingDefault: boolean; defaultName: string };
  issues: string[];
};

export function imageId(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "object") {
    const id = (value as { id?: number | string }).id;
    return id === undefined ? undefined : String(id);
  }
  return String(value);
}

export function seoView(
  values: SeoValues,
  defaults: SeoDefaults,
  context: { locale: string; defaultLocale: string; pageTitle?: string | null },
): SeoView {
  const { locale, defaultLocale } = context;
  const titleFallback =
    defaultFor(defaults.title, locale, defaultLocale) ||
    text(context.pageTitle);
  const descriptionFallback = defaultFor(
    defaults.description,
    locale,
    defaultLocale,
  );
  const title = seoText(values.title, titleFallback, SEO_LIMITS.title);
  const description = seoText(
    values.description,
    descriptionFallback,
    SEO_LIMITS.description,
  );
  const chosen = imageId(values.image) !== undefined;
  const image = {
    chosen,
    usingDefault: !chosen && defaults.image !== null,
    defaultName: defaults.image?.filename ?? "",
  };

  const issues: string[] = [];
  if (title.over) {
    issues.push(
      `The search title is over ${SEO_LIMITS.title} characters and may be cut off.`,
    );
  }
  if (description.over) {
    issues.push(
      `The description is over ${SEO_LIMITS.description} characters and may be cut off.`,
    );
  }
  if (description.shown === "") {
    issues.push(
      "No description. Add one here or set a default in Company settings.",
    );
  }
  if (!chosen && defaults.image === null) {
    issues.push(
      "No share image. Choose one here or set a default in Company settings.",
    );
  }
  return { title, description, image, issues };
}

export type Snippet = {
  trail: string[];
  title: string;
  description: string;
};

export function searchSnippet(input: {
  domain?: string | null;
  path: string;
  locale: string;
  title: string;
  description: string;
}): Snippet {
  const host = bareDomain(input.domain);
  const segments = input.path.split("/").filter(Boolean);
  return {
    trail: [...(host ? [host] : []), input.locale, ...segments],
    title: input.title,
    description: input.description,
  };
}

export const FALLBACK_NOTE =
  "Empty: falls back to Company settings › SEO defaults (shown in grey).";

export const USING_DEFAULT = "Using default";
