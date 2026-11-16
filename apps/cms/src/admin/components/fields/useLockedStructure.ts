"use client";

import { useConfig, useLocale } from "@payloadcms/ui";

export function useLockedStructure(): boolean {
  const { config } = useConfig();
  const { code } = useLocale();
  const defaultLocale = config.localization
    ? config.localization.defaultLocale
    : undefined;
  return Boolean(defaultLocale) && code !== defaultLocale;
}
