import type { TenantSlug } from "@dilm/shared-types";

import { cmsFetch } from "./signedFetch";

export async function fetchTenantName(
  slug: TenantSlug,
  fetcher: typeof fetch = fetch,
): Promise<string> {
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
