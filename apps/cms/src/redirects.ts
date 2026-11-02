import type {
  Access,
  CollectionConfig,
  Field,
  FieldAccess,
  Where,
} from "payload";

import {
  isSuperAdmin,
  type RoleHolder,
  superAdminField,
  hasRole,
} from "./access";
import { collectionLabels } from "./admin/labels";
import { navGroup } from "./admin/navGroups";
import { link } from "./fields/link";
import { localization } from "./localization";

export const REDIRECT_ORIGINS = ["auto", "manual"] as const;

export type RedirectOrigin = (typeof REDIRECT_ORIGINS)[number];

export const REDIRECT_ORIGIN_LABELS: Record<RedirectOrigin, string> = {
  auto: "Automatic",
  manual: "Manual",
};

export const REDIRECTS_SLUG = "redirects";

type TenantRef = number | string | { id: number | string };

function tenantIdOf(tenant: TenantRef): number | string {
  return typeof tenant === "object" ? tenant.id : tenant;
}

export function ownTenantIds(user: RoleHolder): (number | string)[] {
  return (user?.tenants ?? []).map((row) => tenantIdOf(row.tenant));
}

function isTenantEditor(user: RoleHolder): boolean {
  return hasRole(user, "tenant-editor");
}

export const readOwnAndGlobalRedirects: Access = ({ req }) => {
  const user = req.user as RoleHolder;
  if (!user || isSuperAdmin(user)) return true;
  const ids = ownTenantIds(user);
  const global = { tenant: { exists: false } };
  if (ids.length === 0) return global;
  return { or: [global, { tenant: { in: ids } }] };
};

export const createManualRedirectInOwnTenant: Access = ({ req, data }) => {
  const user = req.user as RoleHolder;
  if (isSuperAdmin(user)) return true;
  if (!isTenantEditor(user)) return false;
  const row = data as
    { tenant?: TenantRef | null; origin?: string | null } | undefined;
  if (!row?.tenant) return false;
  if (row.origin && row.origin !== "manual") return false;
  const wanted = String(tenantIdOf(row.tenant));
  return ownTenantIds(user).some((id) => String(id) === wanted);
};

export const changeOwnManualRedirects: Access = ({ req }) => {
  const user = req.user as RoleHolder;
  if (isSuperAdmin(user)) return true;
  if (!isTenantEditor(user)) return false;
  const ids = ownTenantIds(user);
  if (ids.length === 0) return false;
  const where: Where = {
    and: [{ origin: { equals: "manual" } }, { tenant: { in: ids } }],
  };
  return where;
};

const neverChangesAfterCreate: FieldAccess = () => false;

export function redirectFields(): Field[] {
  return [
    {
      name: "from",
      label: "Old address",
      type: "text",
      required: true,
      index: true,
      admin: {
        className: "dil-mono-input",
        description: "The path visitors used to reach, starting with /.",
      },
    },
    link({
      name: "to",
      label: "New address",
      required: true,
      withLabel: false,
    }),
    {
      type: "row",
      fields: [
        {
          name: "tenant",
          label: "Company",
          type: "relationship",
          relationTo: "tenants",
          access: { update: superAdminField },
          admin: {
            description: "Leave empty to apply to all three sites.",
            width: "34%",
          },
        },
        {
          name: "locale",
          label: "Language",
          type: "select",
          required: true,
          defaultValue: localization.defaultLocale,
          options: localization.locales.map((value) => ({
            value,
            label: value === "en" ? "English" : "Bahasa Indonesia",
          })),
          admin: { width: "33%" },
        },
        {
          name: "origin",
          label: "Created",
          type: "select",
          required: true,
          defaultValue: "manual",
          options: REDIRECT_ORIGINS.map((value) => ({
            value,
            label: REDIRECT_ORIGIN_LABELS[value],
          })),
          access: {
            create: superAdminField,
            update: neverChangesAfterCreate,
          },
          admin: { readOnly: true, width: "33%" },
        },
      ],
    },
  ];
}

export const redirectsOverrides = {
  slug: REDIRECTS_SLUG,
  labels: collectionLabels("redirects"),
  access: {
    read: readOwnAndGlobalRedirects,
    create: createManualRedirectInOwnTenant,
    update: changeOwnManualRedirects,
    delete: changeOwnManualRedirects,
  },
  admin: {
    group: navGroup("content"),
    useAsTitle: "from",
    defaultColumns: ["from", "to", "tenant", "locale", "origin"],
  },
  indexes: [{ fields: ["tenant", "locale", "from"], unique: true }],
  custom: { nav: { icon: "link" } },
  fields: redirectFields,
} satisfies Omit<Partial<CollectionConfig>, "fields"> & {
  fields: () => Field[];
};
