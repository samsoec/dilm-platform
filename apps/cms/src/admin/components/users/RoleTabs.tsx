import { cookies } from "next/headers";
import Link from "next/link";
import type { BeforeListTableServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { type SearchParams, toURLSearchParams } from "../lists/statusQuery";
import { TitleTag } from "../lists/TitleTag";
import { InviteUser } from "./InviteUser";
import { ROLE_PARAM, ROLE_TABS } from "./users";

function tabHref(pathname: string, params: SearchParams, role?: string) {
  const query = toURLSearchParams(params);
  for (const key of [...query.keys()]) {
    if (key.startsWith("where[roles]") || key === "page") query.delete(key);
  }
  if (role) query.set(ROLE_PARAM, role);
  const text = query.toString();
  return text ? `${pathname}?${text}` : pathname;
}

export async function RoleTabs({
  collectionSlug,
  payload,
  searchParams,
  user,
}: BeforeListTableServerProps) {
  if (!user || !isSuperAdmin(user as RoleHolder)) return null;
  const params = (searchParams ?? {}) as SearchParams;
  const active = toURLSearchParams(params).get(ROLE_PARAM) ?? undefined;
  const counts = await Promise.all(
    ROLE_TABS.map(({ role }) =>
      payload
        .count({
          collection: "users",
          where: role ? { roles: { equals: role } } : {},
          overrideAccess: false,
          user,
        })
        .then(({ totalDocs }) => totalDocs),
    ),
  );
  const { docs: tenants } = await payload.find({
    collection: "tenants",
    select: { name: true, slug: true, domain: true },
    sort: "name",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const selected = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const pathname = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: `/collections/${collectionSlug}`,
  });

  return (
    <>
      <TitleTag>
        <InviteUser
          selectedTenant={selected}
          tenants={tenants.map(({ id, name, domain }) => ({
            id,
            name,
            domain,
          }))}
        />
      </TitleTag>
      <nav aria-label="Filter by role" className="dil-status-tabs">
        {ROLE_TABS.map(({ role, label }, index) => {
          const current = role === active;
          return (
            <Link
              aria-current={current ? "page" : undefined}
              className={`dil-status-tab${current ? " dil-status-tab--active" : ""}`}
              href={tabHref(pathname, params, role)}
              key={label}
              prefetch={false}
            >
              {label}
              <span className="dil-status-tab__count">
                {counts[index]}
                <span className="dil-sr-only">
                  {counts[index] === 1 ? " user" : " users"}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
