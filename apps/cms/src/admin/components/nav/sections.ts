import type { SanitizedPermissions } from "payload";
import { formatAdminURL } from "payload/shared";

import type { NavBadgeKey } from "../../data/badges";
import type { IconName } from "../../icons";
import {
  CONTENT_GROUP_HINT,
  type CollectionNav,
  NAV_GROUPS,
} from "../../navGroups";

export type NavEntity = {
  slug: string;
  type: "collections" | "globals";
  label: string;
};

export type NavEntityGroup = { label: string; entities: NavEntity[] };

export type NavItem = {
  slug: string;
  href: string;
  label: string;
  icon: IconName;
  badge?: NavBadgeKey;
  locked: boolean;
};

export type NavSection = {
  key: string;
  label: string;
  icon: IconName;
  superAdminOnly: boolean;
  hint?: string;
  items: NavItem[];
};

type SectionArgs = {
  groups: NavEntityGroup[];
  navConfig: (slug: string) => CollectionNav | undefined;
  permissions: SanitizedPermissions | undefined;
  adminRoute: string;
  superAdmin: boolean;
};

const DEFAULT_ITEM_ICON: IconName = "article";
const UNKNOWN_GROUP_ICON: IconName = "more_horiz";

function isLocked(
  permissions: SanitizedPermissions | undefined,
  { slug, type }: NavEntity,
): boolean {
  const entity = permissions?.[type]?.[slug] as
    { create?: boolean; update?: boolean } | undefined;
  return !entity?.create && !entity?.update;
}

function toItems(
  entities: NavEntity[],
  { navConfig, permissions, adminRoute }: SectionArgs,
): NavItem[] {
  return entities
    .map((entity, index) => {
      const nav = navConfig(entity.slug);
      return {
        index,
        order: nav?.order ?? Number.POSITIVE_INFINITY,
        item: {
          slug: entity.slug,
          href: formatAdminURL({
            adminRoute,
            path: `/${entity.type}/${entity.slug}`,
          }),
          label: entity.label,
          icon: nav?.icon ?? DEFAULT_ITEM_ICON,
          badge: nav?.badge,
          locked: isLocked(permissions, entity),
        } satisfies NavItem,
      };
    })
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ item }) => item);
}

export function buildNavSections(args: SectionArgs): NavSection[] {
  const byLabel = new Map(args.groups.map((group) => [group.label, group]));

  const known: NavSection[] = NAV_GROUPS.flatMap((group) => {
    const superAdminOnly = "superAdminOnly" in group && group.superAdminOnly;
    if (superAdminOnly && !args.superAdmin) return [];
    const items = toItems(byLabel.get(group.label)?.entities ?? [], args);
    if (items.length === 0 && group.key !== "content") return [];
    return [
      {
        key: group.key,
        label: group.label,
        icon: group.icon,
        superAdminOnly,
        hint: items.length === 0 ? CONTENT_GROUP_HINT : undefined,
        items,
      },
    ];
  });

  const labels = new Set<string>(NAV_GROUPS.map(({ label }) => label));
  const unknown: NavSection[] = args.groups
    .filter((group) => !labels.has(group.label))
    .map((group) => ({
      key: group.label,
      label: group.label,
      icon: UNKNOWN_GROUP_ICON,
      superAdminOnly: false,
      items: toItems(group.entities, args),
    }));

  return [...known, ...unknown];
}

export function isActiveHref(pathname: string, href: string): boolean {
  return (
    pathname.startsWith(href) &&
    (pathname.length === href.length || pathname[href.length] === "/")
  );
}

export function isDashboard(pathname: string, adminRoute: string): boolean {
  return pathname.replace(/\/$/, "") === adminRoute.replace(/\/$/, "");
}
