import { NavHamburger, NavWrapper } from "@payloadcms/next/client";
import { EntityType, groupNavItems } from "@payloadcms/ui/shared";
import { cookies } from "next/headers";
import type { ServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import {
  isSuperAdmin,
  ROLE_LABELS,
  ROLES,
  type RoleHolder,
} from "../../../access";
import { PRODUCT_NAME } from "../../brand";
import type { NavBadgeKey } from "../../data/badges";
import {
  loadNavPreferences,
  loadSidebar,
  selectedTenantID,
  TENANT_COOKIE,
} from "../../data/sidebar";
import { Mark } from "../../graphics/Mark";
import type { CollectionNav } from "../../navGroups";
import { NavLinks } from "./NavLinks";
import { buildNavSections, type NavEntityGroup } from "./sections";
import { TenantCard } from "./TenantCard";
import { UserFooter } from "./UserFooter";

const ATTENTION_SLUG = "tenant-settings";

function labelText(label: unknown, language: string): string {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const byLanguage = label as Record<string, string>;
    return byLanguage[language] ?? Object.values(byLanguage)[0] ?? "";
  }
  return "";
}

export async function AdminNav({
  i18n,
  payload,
  permissions,
  user,
  viewType,
  visibleEntities,
}: ServerProps) {
  if (!user) return null;

  const { collections, globals, routes } = payload.config;
  const adminRoute = routes.admin;
  const superAdmin = isSuperAdmin(user as RoleHolder);

  const grouped = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities?.collections.includes(slug))
        .map((entity) => ({ type: EntityType.collection as const, entity })),
      ...globals
        .filter(({ slug }) => visibleEntities?.globals.includes(slug))
        .map((entity) => ({ type: EntityType.global as const, entity })),
    ],
    permissions!,
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
  const sections = buildNavSections({
    groups,
    navConfig: (slug) => navConfigs.get(slug),
    permissions,
    adminRoute,
    superAdmin,
  });

  const items = sections.flatMap((section) => section.items);
  const badgeKeys = items.flatMap(({ badge }) =>
    badge ? [badge] : [],
  ) satisfies NavBadgeKey[];
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const context = { payload, user };
  const [sidebar, preferences] = await Promise.all([
    loadSidebar(
      context,
      tenant,
      badgeKeys,
      items.some(({ slug }) => slug === ATTENTION_SLUG),
    ),
    loadNavPreferences(context),
  ]);

  const openGroups = Object.fromEntries(
    Object.entries(preferences?.groups ?? {}).map(([label, { open }]) => [
      label,
      open,
    ]),
  );
  const roles = (user as RoleHolder)?.roles ?? [];
  const role = ROLES.find((candidate) => roles.includes(candidate));
  const person = user as { name?: string | null; email?: string | null };

  return (
    <NavWrapper baseClass="nav">
      <nav aria-label="Main" className="dil-nav">
        <div className="dil-nav__brand">
          <Mark size={10} />
          {PRODUCT_NAME}
        </div>
        <TenantCard tenant={sidebar.tenant} viewType={viewType} />
        <NavLinks
          adminRoute={adminRoute}
          attentionSlug={ATTENTION_SLUG}
          openGroups={openGroups}
          sections={sections}
          sidebar={sidebar}
        />
        <UserFooter
          accountHref={formatAdminURL({ adminRoute, path: "/account" })}
          user={{
            name: person.name ?? undefined,
            email: person.email ?? undefined,
            role: role && ROLE_LABELS[role],
            allTenants: superAdmin,
          }}
        />
      </nav>
      <div className="nav__header">
        <div className="nav__header-content">
          <NavHamburger baseClass="nav" />
        </div>
      </div>
    </NavWrapper>
  );
}
