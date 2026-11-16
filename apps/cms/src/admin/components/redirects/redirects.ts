import type { Where } from "payload";

import type { SearchParams } from "../lists/statusQuery";

export const REDIRECT_KINDS = ["auto", "manual"] as const;
export const REDIRECT_LANGUAGES = ["en", "id"] as const;

export type RedirectKind = (typeof REDIRECT_KINDS)[number];
export type RedirectLanguage = (typeof REDIRECT_LANGUAGES)[number];

export type RedirectsQuery = {
  kind: RedirectKind | undefined;
  lang: RedirectLanguage | undefined;
  search: string;
};

export const KIND_PARAM = "kind";
export const LANG_PARAM = "lang";
export const SEARCH_PARAM = "q";
export const SEARCH_MAX_LENGTH = 100;

export const KIND_LABELS: Record<RedirectKind, string> = {
  auto: "Automatic",
  manual: "By hand",
};

export const LANGUAGE_LABELS: Record<RedirectLanguage, string> = {
  en: "EN",
  id: "ID",
};

export const LOCK_REASON =
  "Automatic and all-site rows are locked for editors.";

export function liveMessage(name: string): string {
  return `"${name}" is live at this URL, so visitors see the page, not the redirect.`;
}

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function parseRedirectsQuery(
  searchParams: SearchParams | undefined,
): RedirectsQuery {
  const params = searchParams ?? {};
  const kind = first(params[KIND_PARAM]);
  const lang = first(params[LANG_PARAM]);
  return {
    kind: (REDIRECT_KINDS as readonly string[]).includes(kind)
      ? (kind as RedirectKind)
      : undefined,
    lang: (REDIRECT_LANGUAGES as readonly string[]).includes(lang)
      ? (lang as RedirectLanguage)
      : undefined,
    search: first(params[SEARCH_PARAM]).trim().slice(0, SEARCH_MAX_LENGTH),
  };
}

export function redirectsHref(
  pathname: string,
  query: Partial<RedirectsQuery>,
): string {
  const params = new URLSearchParams();
  if (query.kind) params.set(KIND_PARAM, query.kind);
  if (query.lang) params.set(LANG_PARAM, query.lang);
  if (query.search) params.set(SEARCH_PARAM, query.search);
  const text = params.toString();
  return text ? `${pathname}?${text}` : pathname;
}

export function redirectsWhere(
  query: RedirectsQuery,
  tenant: number | string,
): Where {
  const clauses: Where[] = [
    { or: [{ tenant: { equals: tenant } }, { tenant: { exists: false } }] },
  ];
  if (query.kind) clauses.push({ origin: { equals: query.kind } });
  if (query.lang) clauses.push({ locale: { equals: query.lang } });
  if (query.search) {
    clauses.push({
      or: [
        { from: { contains: query.search } },
        { "to.internalPath": { contains: query.search } },
        { "to.externalUrl": { contains: query.search } },
      ],
    });
  }
  return { and: clauses };
}

export function isLocked(
  row: { origin: string; allSites: boolean },
  viewer: { superAdmin: boolean; canChange: boolean },
): boolean {
  if (!viewer.canChange) return true;
  if (viewer.superAdmin) return false;
  return row.origin !== "manual" || row.allSites;
}

export function redirectsText(count: number): string {
  return `${count} ${count === 1 ? "redirect" : "redirects"}`;
}

export function dayText(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
