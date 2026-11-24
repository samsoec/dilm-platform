"use client";

import { useParams } from "next/navigation";

import { SiteShell } from "@/components/SiteShell";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/tenant/locales";

export function NotFoundBody() {
  const { locale: raw } = useParams<{ locale?: string }>();
  const locale = raw !== undefined && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  return (
    <SiteShell showContactBand={false}>
      <h1>{dictionary.errors.notFoundTitle}</h1>
      <p>{dictionary.errors.notFoundBody}</p>
    </SiteShell>
  );
}
