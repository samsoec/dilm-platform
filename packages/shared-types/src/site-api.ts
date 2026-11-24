import { LOCALES, type Locale } from "./locales";
import type { TenantSlug } from "./tenant";

export const SITE_LOCALES = LOCALES;

export type SiteLocale = Locale;

export const SITE_API_BASE = "/api/site";

export const SITE_ERROR_CODES = [
  "bad-request",
  "not-found",
  "unavailable",
] as const;

export type SiteErrorCode = (typeof SITE_ERROR_CODES)[number];

export type SiteScope = { tenant: TenantSlug; locale: SiteLocale };

export type SiteEnvelope<T> = { data: T };

export type SiteErrorEnvelope = {
  error: { code: SiteErrorCode; message: string };
};

export type SiteTenant = SiteScope & {
  seo: {
    title: string | null;
    description: string | null;
    ogImageUrl: string | null;
  };
  analyticsId: string | null;
};

export function siteEndpointPath(endpoint: string, scope: SiteScope): string {
  const params = new URLSearchParams({
    tenant: scope.tenant,
    locale: scope.locale,
  });
  return `${SITE_API_BASE}/${endpoint}?${params.toString()}`;
}

export function isSiteLocale(value: unknown): value is SiteLocale {
  return (SITE_LOCALES as readonly unknown[]).includes(value);
}
