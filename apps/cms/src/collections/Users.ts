import type {
  CollectionAfterReadHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  FieldHook,
} from "payload";

import {
  hasAnyRole,
  isSuperAdmin,
  type RoleHolder,
  ROLE_LABELS,
  ROLES,
  superAdmins,
  superAdminsOrSelf,
  systemCriticalFieldAccess,
  tenantMembers,
  type Role,
} from "../access";
import {
  changePasswordEndpoint,
  requireVerifiedPasswordChange,
} from "../account/password";
import { navGroup } from "../admin/navGroups";
import { collectionLabels } from "../admin/labels";

export const promoteFirstUserToSuperAdmin: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create") return data;
  const { totalDocs } = await req.payload.count({ collection: "users", req });
  if (totalDocs > 0) return data;
  return { ...data, roles: ["super-admin"] satisfies Role[] };
};

export function nameFromEmail(email: unknown): string | undefined {
  return typeof email === "string"
    ? email.split("@")[0] || undefined
    : undefined;
}

export const defaultNameFromEmail: FieldHook = ({ value, data, originalDoc }) =>
  (typeof value === "string" ? value.trim() : "") ||
  nameFromEmail(data?.email ?? originalDoc?.email);

export const nameOnlyForOthers: CollectionAfterReadHook = ({ doc, req }) => {
  const viewer = req.user;
  if (!viewer || isSuperAdmin(viewer as RoleHolder)) return doc;
  if (String(doc.id) === String(viewer.id)) return doc;
  return { id: doc.id, name: doc.name };
};

export const LOGIN_LOCKOUT = {
  maxLoginAttempts: 5,
  lockTime: 10 * 60 * 1000,
} as const;

export const Users: CollectionConfig = {
  slug: "users",
  labels: collectionLabels("users"),
  admin: {
    group: navGroup("admin"),
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles"],
    hidden: ({ user }) => !isSuperAdmin(user as RoleHolder),
  },
  custom: {
    nav: { icon: "group", order: 1 },
  },
  auth: { ...LOGIN_LOCKOUT },
  access: {
    admin: ({ req }) => hasAnyRole(req.user),
    read: tenantMembers,
    create: superAdmins,
    update: superAdminsOrSelf,
    delete: superAdmins,
    unlock: superAdmins,
  },
  endpoints: [changePasswordEndpoint],
  hooks: {
    beforeChange: [promoteFirstUserToSuperAdmin, requireVerifiedPasswordChange],
    afterRead: [nameOnlyForOthers],
  },
  fields: [
    {
      name: "name",
      type: "text",
      hooks: { beforeChange: [defaultNameFromEmail] },
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      saveToJWT: true,
      defaultValue: ["tenant-viewer"] satisfies Role[],
      options: ROLES.map((role) => ({ label: ROLE_LABELS[role], value: role })),
      access: systemCriticalFieldAccess,
    },
  ],
};
