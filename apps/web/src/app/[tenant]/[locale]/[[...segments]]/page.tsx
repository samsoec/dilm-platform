import { TENANT_SLUGS } from "@dilm/shared-types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchTenantName } from "@/cms/tenantName";
import { SiteShell } from "@/components/SiteShell";
import { buildMetadata } from "@/seo/metadata";
import { readSeoDefaults } from "@/seo/defaults";
import { isLocale } from "@/tenant/locales";

type Params = { tenant: string; locale: string; segments?: string[] };

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tenant, locale, segments } = await params;
  const slug = TENANT_SLUGS.find((candidate) => candidate === tenant);
  if (slug === undefined || !isLocale(locale)) notFound();
  return buildMetadata({
    tenant: slug,
    locale,
    segments,
    defaults: await readSeoDefaults(slug, locale),
  });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { tenant, locale, segments } = await params;
  const slug = TENANT_SLUGS.find((candidate) => candidate === tenant);
  if (slug === undefined || !isLocale(locale)) notFound();
  if (segments !== undefined && segments.length > 0) notFound();
  const name = await fetchTenantName(slug, fetch, locale);
  return <SiteShell>{name}</SiteShell>;
}
