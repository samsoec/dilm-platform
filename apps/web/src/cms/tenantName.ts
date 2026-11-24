import type { TenantSlug } from "@dilm/shared-types";

import { readTenant } from "@/content/client";
import type { Locale } from "@/tenant/locales";

import { cmsFetch } from "./signedFetch";

async function fixtureTenantName(
  slug: TenantSlug,
  locale: Locale,
): Promise<string> {
  const tenant = await readTenant({ tenant: slug, locale });
  return tenant.seo.title ?? slug;
}

export async function fetchTenantName(
  slug: TenantSlug,
  fetcher: typeof fetch = fetch,
  locale: Locale = "en",
): Promise<string> {
  if (process.env.CONTENT_TRANSPORT === "fixture") {
    return fixtureTenantName(slug, locale);
  }
  const response = await cmsFetch(
    `/api/web-tenant/${encodeURIComponent(slug)}`,
    process.env,
    fetcher,
  );
  if (!response.ok) {
    throw new Error(
      `CMS tenant lookup for ${slug} returned ${response.status}.`,
    );
  }
  const body = (await response.json()) as { name?: unknown };
  if (typeof body.name !== "string" || body.name === "") {
    throw new Error(`CMS tenant lookup for ${slug} returned no name.`);
  }
  return body.name;
}
