import type { Locale } from "@/tenant/locales";

import { en, type Dictionary } from "./dictionaries/en";
import { id } from "./dictionaries/id";

export type { Dictionary };

const dictionaries = { en, id } satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localizedHref(locale: Locale, path = "/"): string {
  const trimmed = path.replace(/^\/+/, "");
  return trimmed === "" ? `/${locale}` : `/${locale}/${trimmed}`;
}

export function formatNumber(
  locale: Locale,
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(
  locale: Locale,
  value: Date | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
): string {
  return new Intl.DateTimeFormat(locale, options).format(value);
}
