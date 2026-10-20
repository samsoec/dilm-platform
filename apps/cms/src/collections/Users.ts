import type {
  Access,
  CollectionAfterLoginHook,
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
import { inviteEndpoints } from "../account/invite";
import { inviteInfoEndpoint, resetEmailHTML } from "../account/resetToken";
import {
  keepOwnSuperAdminRole,
  superAdminsExceptSelf,
} from "../account/selfGuard";
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

export const onlyWhileNoUsers: Access = async ({ req }) => {
  const { totalDocs } = await req.payload.count({ collection: "users" });
  return totalDocs === 0;
};

export const LAST_LOGIN_CONTEXT = "stampLastLogin";

export const stampLastLogin: CollectionAfterLoginHook = async ({
  req,
  user,
}) => {
  await req.payload.update({
    collection: "users",
    id: user.id,
    data: { lastLoginAt: new Date().toISOString() },
    context: { [LAST_LOGIN_CONTEXT]: true },
    overrideAccess: true,
    req,
  });
  return user;
};

const USER_CELLS = "/admin/components/users/UserCells";

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
    description:
      "People who can sign in, across all three sites. Only Super Admins see this page.",
    defaultColumns: [
      "name",
      "roles",
      "sites",
      "status",
      "lastLoginAt",
      "actions",
    ],
    hidden: ({ user }) => !isSuperAdmin(user as RoleHolder),
    components: {
      Description: "/admin/components/lists/ListIntro#ListIntro",
      beforeListTable: ["/admin/components/users/RoleTabs#RoleTabs"],
      afterListTable: ["/admin/components/users/RoleExplainer#RoleExplainer"],
    },
  },
  custom: {
    nav: { icon: "group", order: 1 },
  },
  auth: {
    ...LOGIN_LOCKOUT,
    forgotPassword: {
      generateEmailSubject: () => "Reset your DIL Group CMS password",
      generateEmailHTML: (args) => resetEmailHTML(args ?? {}),
    },
  },
  access: {
    admin: ({ req }) => hasAnyRole(req.user),
    read: tenantMembers,
    create: onlyWhileNoUsers,
    update: superAdminsOrSelf,
    delete: superAdminsExceptSelf,
    unlock: superAdmins,
  },
  endpoints: [changePasswordEndpoint, ...inviteEndpoints, inviteInfoEndpoint],
  hooks: {
    afterLogin: [stampLastLogin],
    beforeChange: [
      promoteFirstUserToSuperAdmin,
      requireVerifiedPasswordChange,
      keepOwnSuperAdminRole,
    ],
    afterRead: [nameOnlyForOthers],
  },
  fields: [
    {
      name: "name",
      label: "User",
      type: "text",
      hooks: { beforeChange: [defaultNameFromEmail] },
      admin: { components: { Cell: `${USER_CELLS}#UserCell` } },
    },
    {
      name: "roles",
      label: "Role",
      type: "select",
      hasMany: true,
      required: true,
      saveToJWT: true,
      defaultValue: ["tenant-viewer"] satisfies Role[],
      options: ROLES.map((role) => ({ label: ROLE_LABELS[role], value: role })),
      access: systemCriticalFieldAccess,
      admin: { components: { Cell: `${USER_CELLS}#RoleCell` } },
    },
    {
      name: "sites",
      type: "ui",
      admin: {
        components: { Cell: "/admin/components/users/SitesCell#SitesCell" },
      },
    },
    {
      name: "status",
      type: "ui",
      admin: {
        components: { Cell: "/admin/components/users/StatusCell#StatusCell" },
      },
    },
    {
      name: "lastLoginAt",
      label: "Last sign-in",
      type: "date",
      access: { create: () => false, update: () => false },
      admin: {
        readOnly: true,
        date: { pickerAppearance: "dayAndTime" },
        components: { Cell: `${USER_CELLS}#LastSignInCell` },
      },
    },
    {
      name: "actions",
      label: " ",
      type: "ui",
      admin: {
        components: { Cell: "/admin/components/users/ActionsCell#ActionsCell" },
      },
    },
    {
      name: "invitedBy",
      type: "relationship",
      relationTo: "users",
      access: { create: () => false, update: () => false },
      admin: { readOnly: true, disableListColumn: true },
    },
  ],
};
