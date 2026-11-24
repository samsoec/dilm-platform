import { TENANT_SLUGS } from "@dilm/shared-types";
import { notFound } from "next/navigation";

import { fetchTenantName } from "@/cms/tenantName";
import { SiteShell } from "@/components/SiteShell";
import { isLocale } from "@/tenant/locales";

type Params = { tenant: string; locale: string; segments?: string[] };

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { tenant, locale } = await params;
  const slug = TENANT_SLUGS.find((candidate) => candidate === tenant);
  if (slug === undefined || !isLocale(locale)) notFound();
  const name = await fetchTenantName(slug);
  return <SiteShell>{name}</SiteShell>;
}
