import "server-only";

import type { SiteTenant, TenantSlug } from "@dilm/shared-types";

import { readTenant } from "@/content/client";
import { ContentError } from "@/content/errors";
import type { Locale } from "@/tenant/locales";

const EMPTY: SiteTenant["seo"] = {
  title: null,
  description: null,
  ogImageUrl: null,
};

export async function readSeoDefaults(
  tenant: TenantSlug,
  locale: Locale,
): Promise<SiteTenant["seo"]> {
  try {
    return (await readTenant({ tenant, locale })).seo;
  } catch (error) {
    if (error instanceof ContentError) return EMPTY;
    throw error;
  }
}
