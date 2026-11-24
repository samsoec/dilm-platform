"use client";

import { SiteShell } from "@/components/SiteShell";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/tenant/locales";
import { useParams } from "next/navigation";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { locale } = useParams<{ locale: string }>();
  const dictionary = getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return (
    <SiteShell showContactBand={false}>
      <h1>{dictionary.errors.genericTitle}</h1>
      <button type="button" onClick={reset}>
        {dictionary.errors.retry}
      </button>
    </SiteShell>
  );
}
