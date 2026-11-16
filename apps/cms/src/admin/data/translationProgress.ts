import { unstable_cache } from "next/cache";
import type { CollectionSlug, Payload, TypedUser } from "payload";

import {
  buildRow,
  TRANSLATION_SOURCES,
  type TranslationRow,
} from "../translationProgress";

export const TRANSLATION_CACHE_SECONDS = 60;

export async function computeTranslationRows(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
): Promise<TranslationRow[]> {
  return Promise.all(
    TRANSLATION_SOURCES.map(async (source) => {
      const config = payload.collections[source.collection].config;
      const { docs } = await payload.find({
        collection: source.collection as CollectionSlug,
        ...(source.tenant ? { where: { tenant: { equals: tenant } } } : {}),
        locale: "all",
        pagination: false,
        depth: 0,
        overrideAccess: false,
        user,
      });
      return buildRow(
        source,
        config.fields,
        docs as unknown as Record<string, unknown>[],
        config.admin.useAsTitle ?? "id",
      );
    }),
  );
}

export function translationRows(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
): Promise<TranslationRow[]> {
  return unstable_cache(
    () => computeTranslationRows(payload, user, tenant),
    ["translation-progress", String(user.id), String(tenant)],
    { revalidate: TRANSLATION_CACHE_SECONDS },
  )();
}
