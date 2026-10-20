import type { AdminViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import {
  isSuperAdmin,
  type RoleHolder,
  ROLE_LABELS,
  ROLES,
} from "../../../access";
import { AccountScreen } from "./AccountScreen";

type TenantRow = { tenant: number | string | { id: number | string } };

export async function AccountView({
  initPageResult,
  payload,
}: AdminViewServerProps) {
  const user = initPageResult.req.user as
    | (RoleHolder & {
        id: number | string;
        name?: string | null;
        email?: string;
        tenants?: TenantRow[] | null;
      })
    | null;
  if (!user) return null;
  const adminRoute = payload.config.routes.admin;
  const superAdmin = isSuperAdmin(user);
  const ids = (user.tenants ?? []).map(({ tenant }) =>
    typeof tenant === "object" ? tenant.id : tenant,
  );
  const { docs } =
    superAdmin || ids.length === 0
      ? { docs: [] }
      : await payload.find({
          collection: "tenants",
          where: { id: { in: ids } },
          select: { name: true },
          sort: "name",
          depth: 0,
          pagination: false,
          overrideAccess: false,
          user,
        });
  const roles = ROLES.filter((role) => user.roles?.includes(role)).map(
    (role) => ROLE_LABELS[role],
  );

  return (
    <AccountScreen
      companies={superAdmin ? ["All companies"] : docs.map((doc) => doc.name)}
      email={user.email ?? ""}
      id={user.id}
      logoutHref={formatAdminURL({
        adminRoute,
        path: payload.config.admin.routes.logout as `/${string}`,
      })}
      name={user.name ?? ""}
      recordHref={
        superAdmin
          ? formatAdminURL({
              adminRoute,
              path: `/collections/users/${encodeURIComponent(String(user.id))}`,
            })
          : undefined
      }
      roles={roles}
    />
  );
}
