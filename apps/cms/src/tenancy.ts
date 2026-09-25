import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import type { MultiTenantPluginConfig } from "@payloadcms/plugin-multi-tenant/types";
import type { CollectionConfig, CollectionSlug, Plugin } from "payload";

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

export function multiTenant(collections: CollectionConfig[]): Plugin {
  return multiTenantPlugin({
    tenantsSlug: Tenants.slug,
    collections: tenantScopedCollections(collections),
    // TODO(DILM-15): only Super Admins see every tenant; editors and viewers
    // see the tenants on their users.tenants array.
    userHasAccessToAllTenants: () => true,
  });
}
