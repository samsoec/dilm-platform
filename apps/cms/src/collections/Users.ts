import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

import {
  hasAnyRole,
  ROLE_LABELS,
  ROLES,
  superAdmins,
  superAdminsOrSelf,
  systemCriticalFieldAccess,
  type Role,
} from "../access";

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

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "roles"],
  },
  auth: true,
  access: {
    admin: ({ req }) => hasAnyRole(req.user),
    read: superAdminsOrSelf,
    create: superAdmins,
    update: superAdminsOrSelf,
    delete: superAdmins,
    unlock: superAdmins,
  },
  hooks: {
    beforeChange: [promoteFirstUserToSuperAdmin],
  },
  fields: [
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
