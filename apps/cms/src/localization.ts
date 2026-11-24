import { DEFAULT_LOCALE, LOCALES } from "@dilm/shared-types";
import type { LocalizationConfig } from "payload";

export const localization = {
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
} as const satisfies LocalizationConfig;
