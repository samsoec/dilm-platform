import { cookies } from "next/headers";
import type { BeforeListTableServerProps } from "payload";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import {
  firstName,
  isTrashView,
  TRASH_COPY,
  trashedText,
  type TrashSlug,
} from "./trash";
import { TrashActions } from "./TrashActions";

type Row = Record<string, unknown> & { id: number };

function personId(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value) {
    return (value as { id: number }).id;
  }
  return undefined;
}

export async function TrashTable({
  collectionSlug,
  data,
  params,
  payload,
  user,
}: BeforeListTableServerProps) {
  if (!user || !isTrashView(params)) return null;
  const slug = collectionSlug as TrashSlug;
  const copy = TRASH_COPY[slug];
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const { docs: companies } =
    tenant === undefined
      ? { docs: [] }
      : await payload.find({
          collection: "tenants",
          where: { id: { equals: tenant } },
          select: { name: true },
          limit: 1,
          depth: 0,
          overrideAccess: false,
          user,
        });
  const company = companies[0]?.name ?? "this company";
  const rows = ((data as { docs?: Row[] })?.docs ?? []) as Row[];
  const trasherIds = [
    ...new Set(
      rows
        .map(({ trashedBy }) => personId(trashedBy))
        .filter((id) => id !== undefined),
    ),
  ];
  const { docs: trashers } =
    trasherIds.length === 0
      ? { docs: [] }
      : await payload.find({
          collection: "users",
          where: { id: { in: trasherIds } },
          select: { name: true },
          pagination: false,
          depth: 0,
          overrideAccess: false,
          user,
        });
  const trasher = (value: unknown) =>
    trashers.find(({ id }) => id === personId(value));
  const superAdmin = isSuperAdmin(user as RoleHolder);
  return (
    <div className="dil-trash">
      {rows.length > 0 && (
        <table className="dil-trash__table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Trashed</th>
              <th scope="col">By</th>
              <th scope="col">
                <span className="dil-sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const title = String(
                (slug === "media" ? row.alt || row.filename : row.title) ??
                  "Untitled",
              );
              const thumb =
                slug === "media"
                  ? ((row.sizes as { thumbnail?: { url?: string } } | undefined)
                      ?.thumbnail?.url ?? (row.url as string | undefined))
                  : undefined;
              return (
                <tr key={row.id}>
                  <td>
                    <span className="dil-trash__title">
                      {thumb ? (
                        <img alt="" className="dil-trash__thumb" src={thumb} />
                      ) : (
                        <MaterialIcon
                          className="dil-trash__icon"
                          name={copy.icon}
                        />
                      )}
                      <span>{title}</span>
                      {typeof row.locale === "string" && (
                        <span className="dil-trash__locale">
                          {row.locale.toUpperCase()}
                        </span>
                      )}
                    </span>
                  </td>
                  <td>{trashedText(row.deletedAt)}</td>
                  <td>{firstName(trasher(row.trashedBy))}</td>
                  <td>
                    <TrashActions
                      canDelete={superAdmin}
                      collectionSlug={slug}
                      company={company}
                      id={row.id}
                      title={title}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {copy.note && rows.length > 0 && (
        <p className="dil-trash__note">{copy.note}</p>
      )}
    </div>
  );
}
