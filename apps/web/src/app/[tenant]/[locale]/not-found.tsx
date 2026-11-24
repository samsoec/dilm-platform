import type { Metadata } from "next";
import { headers } from "next/headers";

import { SiteShell } from "@/components/SiteShell";
import { getDictionary } from "@/i18n";
import { localeFromHeaders } from "@/tenant/headers";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function NotFound() {
  const locale = localeFromHeaders(await headers());
  const dictionary = getDictionary(locale);
  return (
    <SiteShell showContactBand={false}>
      <h1>{dictionary.errors.notFoundTitle}</h1>
      <p>{dictionary.errors.notFoundBody}</p>
    </SiteShell>
  );
}
