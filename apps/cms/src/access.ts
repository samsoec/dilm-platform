import type { Access, CollectionConfig, FieldAccess } from "payload";

export const ROLES = ["super-admin", "tenant-editor", "tenant-viewer"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  "super-admin": "Super Admin",
  "tenant-editor": "Tenant Editor",
  "tenant-viewer": "Tenant Viewer",
};

type TenantRef = number | string | { id: number | string };

export type RoleHolder =
  | {
      roles?: readonly string[] | null;
      tenants?: readonly { tenant: TenantRef }[] | null;
    }
  | null
  | undefined;

function tenantId(tenant: TenantRef): number | string {
  return typeof tenant === "object" ? tenant.id : tenant;
}

export function hasRole(user: RoleHolder, role: Role): boolean {
  return user?.roles?.includes(role) ?? false;
}

export function hasAnyRole(user: RoleHolder): boolean {
  return ROLES.some((role) => hasRole(user, role));
}

export function isSuperAdmin(user: RoleHolder): boolean {
  return hasRole(user, "super-admin");
}

export function isTenantEditorOrAbove(user: RoleHolder): boolean {
  return isSuperAdmin(user) || hasRole(user, "tenant-editor");
}

export function hasTenantAccess(user: RoleHolder, tenant: TenantRef): boolean {
  if (isSuperAdmin(user)) return true;
  if (!hasAnyRole(user)) return false;
  const wanted = String(tenantId(tenant));
  return (user?.tenants ?? []).some(
    (row) => String(tenantId(row.tenant)) === wanted,
  );
}

export const anyone: Access = () => true;

export const nobody: Access = () => false;

export const superAdmins: Access = ({ req }) => isSuperAdmin(req.user);

export const tenantEditors: Access = ({ req }) =>
  isTenantEditorOrAbove(req.user);

export const tenantMembers: Access = ({ req }) => hasAnyRole(req.user);

export const superAdminsOrSelf: Access = ({ req }) => {
  if (isSuperAdmin(req.user)) return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

export const superAdminField: FieldAccess = ({ req }) => isSuperAdmin(req.user);

type FieldAccessMap = { create: FieldAccess; update: FieldAccess };

export const systemCriticalFieldAccess = {
  create: superAdminField,
  update: superAdminField,
} satisfies FieldAccessMap;

export const systemManagedField = {
  create: () => false,
  update: () => false,
} satisfies FieldAccessMap;

export const tenantContentAccess = {
  read: tenantMembers,
  readVersions: tenantMembers,
  create: tenantEditors,
  update: tenantEditors,
  delete: tenantEditors,
  unlock: tenantEditors,
} satisfies NonNullable<CollectionConfig["access"]>;
