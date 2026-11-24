import type { Metadata } from "next";

import { SiteShell } from "@/components/SiteShell";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE } from "@/tenant/locales";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function NotFound() {
  const dictionary = getDictionary(DEFAULT_LOCALE);
  return (
    <SiteShell showContactBand={false}>
      <h1>{dictionary.errors.notFoundTitle}</h1>
      <p>{dictionary.errors.notFoundBody}</p>
    </SiteShell>
  );
}
