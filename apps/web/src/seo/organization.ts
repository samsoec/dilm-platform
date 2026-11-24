import {
  TENANT_NAMES,
  type SiteTenant,
  type TenantSlug,
} from "@dilm/shared-types";

import { canonicalOrigin } from "./site";

export function organizationJsonLd(
  tenant: TenantSlug,
  seo: SiteTenant["seo"],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: TENANT_NAMES[tenant],
    url: canonicalOrigin(tenant),
    ...(seo.description ? { description: seo.description } : {}),
    ...(seo.ogImageUrl ? { logo: seo.ogImageUrl } : {}),
  };
}
