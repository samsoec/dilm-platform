import { cookies } from "next/headers";
import Link from "next/link";
import type { BeforeListTableServerProps, Where } from "payload";
import { formatAdminURL } from "payload/shared";

import type { RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { isTrashView, TRASH_COPY, type TrashSlug } from "./trash";

export async function TrashToggle({
  collectionSlug,
  params,
  payload,
  user,
}: BeforeListTableServerProps) {
  if (!user) return null;
  const slug = collectionSlug as TrashSlug;
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const scope: Where[] =
    tenant === undefined ? [] : [{ tenant: { equals: tenant } }];
  const [all, trashed] = await Promise.all([
    payload.count({
      collection: slug,
      where: scope.length ? { and: scope } : {},
      overrideAccess: false,
      user,
    }),
    payload.count({
      collection: slug,
      where: { and: [...scope, { deletedAt: { exists: true } }] },
      trash: true,
      overrideAccess: false,
      user,
    }),
  ]);
  const base = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: `/collections/${slug}`,
  });
  const inTrash = isTrashView(params);
  return (
    <nav
      aria-label="List or trash"
      className="dil-status-tabs dil-trash-toggle"
    >
      <Link
        aria-current={inTrash ? undefined : "page"}
        className={`dil-status-tab${inTrash ? "" : " dil-status-tab--active"}`}
        href={base}
        prefetch={false}
      >
        {TRASH_COPY[slug].allLabel} · {all.totalDocs}
      </Link>
      <Link
        aria-current={inTrash ? "page" : undefined}
        className={`dil-status-tab${inTrash ? " dil-status-tab--active" : ""}`}
        href={`${base}/trash`}
        prefetch={false}
      >
        <MaterialIcon name="delete" />
        Trash · {trashed.totalDocs}
      </Link>
    </nav>
  );
}
