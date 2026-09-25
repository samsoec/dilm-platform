import type { LocalizationConfig } from "payload";

export const localization = {
  locales: ["en", "id"],
  defaultLocale: "en",
} as const satisfies LocalizationConfig;
