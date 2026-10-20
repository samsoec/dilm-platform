import {
  APIError,
  type Access,
  type CollectionBeforeChangeHook,
} from "payload";

import { isSuperAdmin, type RoleHolder } from "../access";

export const OWN_SUPER_ADMIN_ROLE =
  "You can't remove your own Super Admin role. Ask another Super Admin.";

export const OWN_ACCOUNT_REMOVAL =
  "Remove user isn't available for your own account.";

export const superAdminsExceptSelf: Access = ({ req }) => {
  const user = req.user as (RoleHolder & { id: number | string }) | null;
  if (!user || !isSuperAdmin(user)) return false;
  return { id: { not_equals: user.id } };
};

export const keepOwnSuperAdminRole: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || !Array.isArray(data?.roles)) return data;
  const self = req.user && String(req.user.id) === String(originalDoc?.id);
  if (
    self &&
    isSuperAdmin(originalDoc as RoleHolder) &&
    !data.roles.includes("super-admin")
  ) {
    throw new APIError(OWN_SUPER_ADMIN_ROLE, 403, undefined, true);
  }
  return data;
};
