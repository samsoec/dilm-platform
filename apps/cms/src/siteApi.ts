import type { Payload } from "payload";

import { SITE_READ_CONTEXT } from "./access";
import {
  TENANT_SLUGS,
  isSiteLocale,
  type SiteEnvelope,
  type SiteErrorCode,
  type SiteErrorEnvelope,
  type SiteLocale,
  type SiteScope,
  type SiteTenant,
  type TenantSlug,
} from "@dilm/shared-types";

const STATUS: Record<SiteErrorCode, number> = {
  "bad-request": 400,
  "not-found": 404,
  unavailable: 503,
};

export function siteError(code: SiteErrorCode, message: string): Response {
  const body: SiteErrorEnvelope = { error: { code, message } };
  return Response.json(body, {
    status: STATUS[code],
    headers: { "cache-control": "no-store" },
  });
}

export function siteOk<T>(data: T): Response {
  const body: SiteEnvelope<T> = { data };
  return Response.json(body);
}

export function parseSiteScope(url: URL): SiteScope | Response {
  const tenant = url.searchParams.get("tenant");
  const locale = url.searchParams.get("locale");
  if (!(TENANT_SLUGS as readonly (string | null)[]).includes(tenant)) {
    return siteError("bad-request", "tenant is required and must be known.");
  }
  if (!isSiteLocale(locale)) {
    return siteError("bad-request", "locale is required and must be known.");
  }
  return { tenant: tenant as TenantSlug, locale };
}

export const PUBLISHED_ONLY = { _status: { equals: "published" } } as const;

async function tenantIdOf(
  payload: Payload,
  slug: TenantSlug,
): Promise<number | null> {
  const found = await payload.find({
    collection: "tenants",
    where: { slug: { equals: slug } },
    select: { slug: true },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });
  return found.docs[0]?.id ?? null;
}

export async function findPublished(
  payload: Payload,
  collection: "ir-documents",
  scope: SiteScope,
  where: Record<string, unknown> = {},
) {
  const tenantId = await tenantIdOf(payload, scope.tenant);
  if (tenantId === null) return { docs: [] };
  return payload.find({
    collection,
    where: {
      and: [
        where,
        PUBLISHED_ONLY,
        { tenant: { equals: tenantId } },
        { locale: { equals: scope.locale } },
      ],
    } as never,
    draft: false,
    trash: false,
    depth: 0,
    pagination: false,
    overrideAccess: false,
    context: SITE_READ_CONTEXT,
  });
}

export async function readSiteTenant(
  payload: Payload,
  scope: SiteScope,
): Promise<SiteTenant | null> {
  const tenantId = await tenantIdOf(payload, scope.tenant);
  if (tenantId === null) return null;
  const found = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenantId } },
    select: { defaultSeo: true, analyticsId: true, tenant: true },
    locale: scope.locale as SiteLocale,
    fallbackLocale: false,
    depth: 1,
    limit: 1,
    overrideAccess: false,
    context: SITE_READ_CONTEXT,
  });
  const settings = found.docs[0];
  if (settings === undefined) return null;
  const image = settings.defaultSeo?.ogImage;
  return {
    tenant: scope.tenant,
    locale: scope.locale,
    seo: {
      title: settings.defaultSeo?.title ?? null,
      description: settings.defaultSeo?.description ?? null,
      ogImageUrl:
        typeof image === "object" && image !== null
          ? (image.url ?? null)
          : null,
    },
    analyticsId: settings.analyticsId ?? null,
  };
}
