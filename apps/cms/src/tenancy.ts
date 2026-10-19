import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import type { MultiTenantPluginConfig } from "@payloadcms/plugin-multi-tenant/types";
import type {
  AccessResult,
  CollectionConfig,
  CollectionSlug,
  Plugin,
} from "payload";

import { isSuperAdmin, tenantContentAccess } from "./access";
import { Tenants } from "./collections/Tenants";

export type TenantScope = NonNullable<
  MultiTenantPluginConfig["collections"][CollectionSlug]
>;

const TENANT_SCOPE_KEY = "tenantScope";

export function withTenantAccess(
  collection: CollectionConfig,
  scope: TenantScope = {},
): CollectionConfig {
  return {
    ...collection,
    access: { ...tenantContentAccess, ...collection.access },
    custom: { ...collection.custom, [TENANT_SCOPE_KEY]: scope },
  };
}

export function tenantScopedCollections(
  collections: CollectionConfig[],
): MultiTenantPluginConfig["collections"] {
  return Object.fromEntries(
    collections.flatMap((collection) => {
      const scope = collection.custom?.[TENANT_SCOPE_KEY] as
        TenantScope | undefined;
      return scope ? [[collection.slug, scope]] : [];
    }),
  );
}

export function withSuperAdminAuthors({
  accessKey,
  accessResult,
}: {
  accessKey: string;
  accessResult: AccessResult;
}): AccessResult {
  if (accessKey !== "read" || typeof accessResult !== "object") {
    return accessResult;
  }
  return { or: [accessResult, { roles: { in: ["super-admin"] } }] };
}

export function multiTenant(collections: CollectionConfig[]): Plugin {
  return multiTenantPlugin({
    tenantsSlug: Tenants.slug,
    collections: tenantScopedCollections(collections),
    userHasAccessToAllTenants: isSuperAdmin,
    usersAccessResultOverride: withSuperAdminAuthors,
  });
}
