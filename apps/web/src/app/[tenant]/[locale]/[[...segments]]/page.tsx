import { TENANT_NAMES, TENANT_SLUGS } from "@dilm/shared-types";
import { notFound } from "next/navigation";

import { isLocale } from "@/tenant/locales";

type Params = { tenant: string; locale: string; segments?: string[] };

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { tenant, locale } = await params;
  const slug = TENANT_SLUGS.find((candidate) => candidate === tenant);
  if (slug === undefined || !isLocale(locale)) notFound();
  const name = TENANT_NAMES[slug];
  return <main data-tenant={slug}>{name}</main>;
}
