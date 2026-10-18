import { NavHamburger, NavWrapper } from "@payloadcms/next/client";
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
  loadSidebar,
  selectedTenantID,
  TENANT_COOKIE,
} from "../../data/sidebar";
import { Mark } from "../../graphics/Mark";
import { NavLinks } from "./NavLinks";
import { TenantCard } from "./TenantCard";
import { visibleNavSections } from "./visibleSections";
import { UserFooter } from "./UserFooter";

const ATTENTION_SLUG = "tenant-settings";

export async function AdminNav({
  i18n,
  payload,
  permissions,
  user,
  viewType,
  visibleEntities,
}: ServerProps) {
  if (!user) return null;

  const { routes } = payload.config;
  const adminRoute = routes.admin;
  const superAdmin = isSuperAdmin(user as RoleHolder);

  const sections = visibleNavSections({
    config: payload.config,
    i18n,
    permissions: permissions!,
    visibleEntities,
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
  const sidebar = await loadSidebar(
    { payload, user },
    tenant,
    badgeKeys,
    items.some(({ slug }) => slug === ATTENTION_SLUG),
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
          sections={sections}
          sidebar={sidebar}
        />
        <UserFooter
          accountHref={formatAdminURL({ adminRoute, path: "/account" })}
          logoutHref={formatAdminURL({
            adminRoute,
            path: payload.config.admin.routes.logout as `/${string}`,
          })}
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
