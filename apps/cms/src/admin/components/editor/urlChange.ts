import { computePath, slugForLocale } from "../../../pathCompute";
import { bareDomain } from "./urls";

export const URL_CHANGE_MODAL = "dil-url-change";

export const URL_CHANGE_FOOTNOTE =
  "The change goes live, with its redirects, when the page is next published.";

export const URL_CHANGE_CHECKING = "Checking what this change affects…";

export const URL_CHANGE_FAILED =
  "Couldn't check what this URL change affects. The change is kept in the form, and the server still guards the limit when you publish.";

export function liveOnNote(domain: string | null | undefined): string {
  const host = bareDomain(domain);
  return `It's live on ${host || "the website"}. Nothing breaks: old URLs forward to the new ones.`;
}

export type ImpactUrl = { locale: string; from: string; to: string };

export type ImpactLink = {
  collection: string;
  id: string;
  paths: Record<string, string>;
};

export type PathImpactReply = {
  ok: boolean;
  published: boolean;
  urls: ImpactUrl[];
  childPages: number;
  records: number;
  redirects: number;
  overLimit: boolean;
  message?: string;
  linkCount: number;
  links: ImpactLink[];
};

export type UrlValues = { slug: string; parent: string | null };

export type UrlChangeKind = "none" | "review" | "refusal";

export function pathImpactPath(api: string, id: number | string): string {
  return `${api}/pages/${encodeURIComponent(String(id))}/path-impact`;
}

export function impactBody(locale: string, now: UrlValues) {
  return { slugs: { [locale]: now.slug }, parent: now.parent };
}

export function sameValues(a: UrlValues, b: UrlValues): boolean {
  return a.slug === b.slug && a.parent === b.parent;
}

export function valuesKey(values: UrlValues): string {
  return JSON.stringify([values.slug, values.parent]);
}

export function unchangedPaths(urls: ImpactUrl[]): boolean {
  return urls.every((url) => url.from === url.to);
}

export function urlChangeKind(impact: PathImpactReply): UrlChangeKind {
  if (!impact.published) return "none";
  if (unchangedPaths(impact.urls)) return "none";
  return impact.overLimit ? "refusal" : "review";
}

export function isImpactReply(value: unknown): value is PathImpactReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<PathImpactReply>;
  return (
    typeof reply.published === "boolean" &&
    Array.isArray(reply.urls) &&
    typeof reply.childPages === "number" &&
    typeof reply.records === "number" &&
    typeof reply.redirects === "number" &&
    typeof reply.overLimit === "boolean" &&
    Array.isArray(reply.links)
  );
}

export function displayUrl(
  domain: string | null | undefined,
  locale: string,
  path: string,
): string {
  const host = bareDomain(domain);
  const tail = path === "/" ? "" : path;
  return `${host}/${locale}${tail}`;
}

export function linksSummary(impact: PathImpactReply): string {
  if (impact.linkCount === 0) return "No other page links here.";
  return impact.linkCount === 1
    ? "1 page or record that links here will follow the new address."
    : `${impact.linkCount} pages or records that link here will follow the new address.`;
}

export type CategoryChange = {
  domain?: string | null;
  locales: readonly string[];
  fallbackLocale: string;
  live: boolean;
  slugs: Record<string, string | null | undefined>;
  current: Record<string, string | null | undefined>;
  category: Record<string, string | null | undefined>;
};

export type CategoryMove = { locale: string; from: string; to: string };

export function categoryMoves(change: CategoryChange): CategoryMove[] {
  if (!change.live) return [];
  return change.locales.flatMap((locale) => {
    const from =
      change.current[locale] || change.current[change.fallbackLocale];
    const above =
      change.category[locale] || change.category[change.fallbackLocale];
    if (!from || !above) return [];
    const to = computePath(above, slugForLocale(change.slugs, locale).slug);
    return from === to
      ? []
      : [
          {
            locale,
            from: displayUrl(change.domain, locale, from),
            to: displayUrl(change.domain, locale, to),
          },
        ];
  });
}

const LANGUAGES: Record<string, string> = { en: "English", id: "Indonesian" };

export function languageName(locale: string): string {
  return LANGUAGES[locale] ?? locale.toUpperCase();
}

export function categoryChangeSummary(moves: CategoryMove[]): string {
  if (moves.length === 0) return "";
  const names = moves.map((move) => languageName(move.locale));
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `Changing the category moves the post. A redirect from the old address is created in ${list} when the post is next published.`;
}
