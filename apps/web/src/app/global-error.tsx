"use client";

import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE } from "@/tenant/locales";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const dictionary = getDictionary(DEFAULT_LOCALE);
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <h1>{dictionary.errors.genericTitle}</h1>
        <button type="button" onClick={reset}>
          {dictionary.errors.retry}
        </button>
      </body>
    </html>
  );
}
