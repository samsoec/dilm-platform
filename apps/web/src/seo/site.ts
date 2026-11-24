import { TENANT_DOMAINS, type TenantSlug } from "@dilm/shared-types";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/tenant/locales";

export const SITE_STAGE_ENV = "SITE_STAGE";

export function isProductionStage(
  env: Record<string, string | undefined>,
): boolean {
  return env[SITE_STAGE_ENV] === "production";
}

export function canonicalOrigin(tenant: TenantSlug): string {
  return `https://${TENANT_DOMAINS[tenant]}`;
}

export function localizedPath(locale: Locale, segments: string[] = []): string {
  return `/${[locale, ...segments].join("/")}`;
}

export function canonicalUrl(
  tenant: TenantSlug,
  locale: Locale,
  segments: string[] = [],
): string {
  return `${canonicalOrigin(tenant)}${localizedPath(locale, segments)}`;
}

export function languageAlternates(
  tenant: TenantSlug,
  segments: string[] = [],
): Record<string, string> {
  const entries = LOCALES.map(
    (locale) => [locale, canonicalUrl(tenant, locale, segments)] as const,
  );
  return {
    ...Object.fromEntries(entries),
    "x-default": canonicalUrl(tenant, DEFAULT_LOCALE, segments),
  };
}

export function robotsTxt(env: Record<string, string | undefined>): string {
  if (!isProductionStage(env)) return "User-agent: *\nDisallow: /\n";
  return "User-agent: *\nAllow: /\n";
}
