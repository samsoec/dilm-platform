import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import type { MultiTenantPluginConfig } from "@payloadcms/plugin-multi-tenant/types";
import type {
  AccessResult,
  CollectionConfig,
  CollectionSlug,
  Field,
  Plugin,
  RelationshipField,
} from "payload";

import { hasAnyRole, isSuperAdmin, tenantContentAccess } from "./access";
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

export const readAcrossCompanies: NonNullable<
  TenantScope["accessResultOverride"]
> = ({ accessKey, accessResult, req }) =>
  (accessKey === "read" || accessKey === "readVersions") &&
  accessResult !== false &&
  hasAnyRole(req.user)
    ? true
    : accessResult;

export const CATALOG_SCOPE: TenantScope = {
  useBaseFilter: false,
  accessResultOverride: readAcrossCompanies,
};

const UNSCOPED_FILTER_KEY = "unscopedFilterOptions";

export function unscopedRelationship<T extends RelationshipField>(field: T): T {
  return {
    ...field,
    custom: {
      ...field.custom,
      [UNSCOPED_FILTER_KEY]: field.filterOptions ?? true,
    },
  };
}

export function restoreUnscopedFilters(fields: Field[]): Field[] {
  return fields.map((field) => {
    if (field.type === "relationship" && field.custom?.[UNSCOPED_FILTER_KEY]) {
      return {
        ...field,
        filterOptions: field.custom[UNSCOPED_FILTER_KEY],
      } as Field;
    }
    if (field.type === "tabs") {
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: restoreUnscopedFilters(tab.fields),
        })),
      };
    }
    if (field.type === "blocks") {
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: restoreUnscopedFilters(block.fields),
        })),
      };
    }
    if ("fields" in field) {
      return {
        ...field,
        fields: restoreUnscopedFilters(field.fields),
      } as Field;
    }
    return field;
  });
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
  const plugin = multiTenantPlugin({
    tenantsSlug: Tenants.slug,
    collections: tenantScopedCollections(collections),
    userHasAccessToAllTenants: isSuperAdmin,
    usersAccessResultOverride: withSuperAdminAuthors,
    useTenantsListFilter: false,
    useUsersTenantFilter: false,
  });
  return async (config) => {
    const configured = await plugin(config);
    return {
      ...configured,
      collections: configured.collections?.map((collection) => ({
        ...collection,
        fields: restoreUnscopedFilters(collection.fields),
      })),
    };
  };
}
