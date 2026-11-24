import {
  TENANT_NAMES,
  type SiteTenant,
  type TenantSlug,
} from "@dilm/shared-types";
import type { Metadata } from "next";

import type { Locale } from "@/tenant/locales";

import {
  canonicalOrigin,
  canonicalUrl,
  isProductionStage,
  languageAlternates,
} from "./site";

export type PageMeta = {
  title?: string | null;
  description?: string | null;
  ogImageUrl?: string | null;
};

type Env = Record<string, string | undefined>;

function pick(
  override: string | null | undefined,
  fallback: string | null,
): string | undefined {
  const value = override?.trim() ? override : fallback;
  return value?.trim() ? value : undefined;
}

export function buildMetadata(input: {
  tenant: TenantSlug;
  locale: Locale;
  segments?: string[];
  defaults: SiteTenant["seo"];
  meta?: PageMeta;
  env?: Env;
}): Metadata {
  const { tenant, locale, segments = [], defaults, meta = {} } = input;
  const title = pick(meta.title, defaults.title) ?? TENANT_NAMES[tenant];
  const description = pick(meta.description, defaults.description);
  const image = pick(meta.ogImageUrl, defaults.ogImageUrl);
  const url = canonicalUrl(tenant, locale, segments);
  return {
    metadataBase: new URL(canonicalOrigin(tenant)),
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(tenant, segments),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: TENANT_NAMES[tenant],
      locale,
      type: "website",
      images: image === undefined ? undefined : [{ url: image }],
    },
    robots: isProductionStage(input.env ?? process.env)
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
