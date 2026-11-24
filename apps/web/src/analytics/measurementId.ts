import "server-only";

import type { TenantSlug } from "@dilm/shared-types";

import { readTenant } from "@/content/client";
import { ContentError } from "@/content/errors";
import { isProductionStage } from "@/seo/site";
import type { Locale } from "@/tenant/locales";

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,20}$/;

export function usableMeasurementId(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return MEASUREMENT_ID.test(trimmed) ? trimmed : null;
}

export async function readMeasurementId(
  tenant: TenantSlug,
  locale: Locale,
  env: Record<string, string | undefined> = process.env,
): Promise<string | null> {
  if (!isProductionStage(env)) return null;
  try {
    return usableMeasurementId(
      (await readTenant({ tenant, locale })).analyticsId,
    );
  } catch (error) {
    if (error instanceof ContentError) return null;
    throw error;
  }
}
