import type { SanitizedConfig, ServerProps } from "payload";

import type { EntityRef } from "./topbar";

export type TopBarProps = ServerProps & {
  collectionSlug?: string;
  globalSlug?: string;
};

export function openEntity({
  collectionSlug,
  globalSlug,
}: TopBarProps): EntityRef | undefined {
  if (collectionSlug) return { type: "collections", slug: collectionSlug };
  if (globalSlug) return { type: "globals", slug: globalSlug };
  return undefined;
}

export function entityConfig(
  config: SanitizedConfig,
  entity: EntityRef | undefined,
) {
  if (!entity) return undefined;
  const entities: {
    slug: string;
    fields: SanitizedConfig["collections"][number]["fields"];
  }[] = config[entity.type];
  return entities.find(({ slug }) => slug === entity.slug);
}
