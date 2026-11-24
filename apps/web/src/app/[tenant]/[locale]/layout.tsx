import { TENANT_SLUGS } from "@dilm/shared-types";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/JsonLd";
import { MAIN_ID } from "@/components/SiteShell";
import { getDictionary } from "@/i18n";
import { organizationJsonLd } from "@/seo/organization";
import { readSeoDefaults } from "@/seo/defaults";
import { isLocale } from "@/tenant/locales";

import "@/styles/base.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenant: string; locale: string }>;
}) {
  const { tenant, locale } = await params;
  const slug = TENANT_SLUGS.find((candidate) => candidate === tenant);
  if (slug === undefined || !isLocale(locale)) notFound();
  const seo = await readSeoDefaults(slug, locale);
  const dictionary = getDictionary(locale);
  return (
    <html lang={locale} data-tenant={slug}>
      <body>
        <a href={`#${MAIN_ID}`}>{dictionary.nav.skipToContent}</a>
        <JsonLd data={organizationJsonLd(slug, seo)} />
        {children}
      </body>
    </html>
  );
}
