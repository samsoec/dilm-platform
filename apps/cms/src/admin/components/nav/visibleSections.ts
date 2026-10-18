import { EntityType, groupNavItems } from "@payloadcms/ui/shared";
import type {
  SanitizedConfig,
  SanitizedPermissions,
  ServerProps,
  VisibleEntities,
} from "payload";

import { labelText } from "../../labelText";
import type { CollectionNav } from "../../navGroups";
import {
  buildNavSections,
  type NavEntityGroup,
  type NavSection,
} from "./sections";

export function visibleNavSections({
  config,
  i18n,
  permissions,
  visibleEntities,
  superAdmin,
}: {
  config: SanitizedConfig;
  i18n: ServerProps["i18n"];
  permissions: SanitizedPermissions;
  visibleEntities: VisibleEntities | undefined;
  superAdmin: boolean;
}): NavSection[] {
  const { collections, globals, routes } = config;

  const grouped = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities?.collections.includes(slug))
        .map((entity) => ({ type: EntityType.collection as const, entity })),
      ...globals
        .filter(({ slug }) => visibleEntities?.globals.includes(slug))
        .map((entity) => ({ type: EntityType.global as const, entity })),
    ],
    permissions,
    i18n,
  );
  const groups: NavEntityGroup[] = grouped.map(({ label, entities }) => ({
    label: labelText(label, i18n.language),
    entities: entities.map(({ slug, type, label: entityLabel }) => ({
      slug,
      type,
      label: labelText(entityLabel, i18n.language),
    })),
  }));

  const navConfigs = new Map<string, CollectionNav | undefined>(
    [...collections, ...globals].map(({ slug, custom }) => [
      slug,
      custom?.nav as CollectionNav | undefined,
    ]),
  );
  return buildNavSections({
    groups,
    navConfig: (slug) => navConfigs.get(slug),
    permissions,
    adminRoute: routes.admin,
    superAdmin,
  });
}
