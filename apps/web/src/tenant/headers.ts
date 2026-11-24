import { TENANT_SLUGS, type TenantSlug } from "@dilm/shared-types";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export const TENANT_HEADER = "x-dilm-tenant";
export const LOCALE_HEADER = "x-dilm-locale";

export const DEFAULT_TENANT: TenantSlug = "duniakimia";

export function tenantFromHeaders(headers: Pick<Headers, "get">): TenantSlug {
  const raw = headers.get(TENANT_HEADER);
  return TENANT_SLUGS.find((slug) => slug === raw) ?? DEFAULT_TENANT;
}

export function localeFromHeaders(headers: Pick<Headers, "get">): Locale {
  const raw = headers.get(LOCALE_HEADER) ?? "";
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}
