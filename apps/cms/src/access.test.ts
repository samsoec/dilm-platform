import type { AccessArgs, CollectionConfig, FieldAccess } from "payload";
import { describe, expect, it } from "vitest";

import {
  hasTenantAccess,
  isSuperAdmin,
  isTenantEditorOrAbove,
  type Role,
} from "./access";
import { Tenants } from "./collections/Tenants";
import { promoteFirstUserToSuperAdmin, Users } from "./collections/Users";
import { withTenantAccess } from "./tenancy";
import { applyMultiTenant } from "./testing";

function user(roles: Role[], tenantIds: number[] = []) {
  return {
    id: 99,
    collection: "users",
    roles,
    tenants: tenantIds.map((tenant) => ({ tenant })),
  };
}

const superAdmin = user(["super-admin"]);
const editor = user(["tenant-editor"], [1]);
const viewer = user(["tenant-viewer"], [1, 2]);
const roleless = user([], [1]);

describe("role checks", () => {
  it("recognises Super Admins only by the super-admin role", () => {
    expect(isSuperAdmin(superAdmin)).toBe(true);
    expect(isSuperAdmin(editor)).toBe(false);
    expect(isSuperAdmin(null)).toBe(false);
  });

  it("treats Super Admins and Tenant Editors as editors, not viewers", () => {
    expect(isTenantEditorOrAbove(superAdmin)).toBe(true);
    expect(isTenantEditorOrAbove(editor)).toBe(true);
    expect(isTenantEditorOrAbove(viewer)).toBe(false);
    expect(isTenantEditorOrAbove(undefined)).toBe(false);
  });

  it("grants tenant access from the user's tenants, or everywhere for Super Admins", () => {
    expect(hasTenantAccess(superAdmin, 3)).toBe(true);
    expect(hasTenantAccess(editor, 1)).toBe(true);
    expect(hasTenantAccess(editor, { id: 1 })).toBe(true);
    expect(hasTenantAccess(editor, 2)).toBe(false);
    expect(hasTenantAccess(viewer, "2")).toBe(true);
    expect(hasTenantAccess(roleless, 1)).toBe(false);
  });
});

describe("access through the multi-tenant plugin", () => {
  const posts: CollectionConfig = {
    slug: "posts",
    fields: [{ name: "title", type: "text" }],
  };

  function configured() {
    return applyMultiTenant([Users, Tenants, withTenantAccess(posts)]);
  }

  function call(
    collection: CollectionConfig,
    key: "read" | "create" | "update" | "delete",
    as: object | null,
  ) {
    return collection.access![key]!({ req: { user: as } } as AccessArgs);
  }

  function fieldAllows(
    collection: CollectionConfig,
    name: string,
    key: "create" | "update",
    as: object,
  ) {
    const field = collection.fields.find(
      (candidate) => "name" in candidate && candidate.name === name,
    ) as { access: Record<typeof key, FieldAccess> };
    return field.access[key]({
      req: { user: as },
    } as Parameters<FieldAccess>[0]);
  }

  it("lets Super Admins read and write content in every tenant", async () => {
    const collection = await configured();

    for (const key of ["read", "create", "update", "delete"] as const) {
      expect(await call(collection("posts"), key, superAdmin)).toBe(true);
    }
  });

  it("scopes Tenant Editors' reads and writes to their tenants", async () => {
    const collection = await configured();
    const ownTenant = { tenant: { in: [1] } };

    for (const key of ["read", "create", "update", "delete"] as const) {
      expect(await call(collection("posts"), key, editor)).toEqual(ownTenant);
    }
  });

  it("gives Tenant Viewers tenant-scoped reads and no writes", async () => {
    const collection = await configured();

    expect(await call(collection("posts"), "read", viewer)).toEqual({
      tenant: { in: [1, 2] },
    });
    for (const key of ["create", "update", "delete"] as const) {
      expect(await call(collection("posts"), key, viewer)).toBe(false);
    }
  });

  it("denies content to anonymous and role-less users", async () => {
    const collection = await configured();

    expect(await call(collection("posts"), "read", null)).toBe(false);
    expect(await call(collection("posts"), "read", roleless)).toBe(false);
  });

  it("keeps a collection's own access rules over the defaults", async () => {
    const wrapped = withTenantAccess({
      ...posts,
      access: { read: () => true },
    });

    expect(wrapped.access!.read!({} as AccessArgs)).toBe(true);
    expect(wrapped.access!.create).toBeTypeOf("function");
  });

  it("reserves user management for Super Admins", async () => {
    const collection = await configured();

    for (const key of ["create", "delete"] as const) {
      expect(await call(collection("users"), key, superAdmin)).toBe(true);
      expect(await call(collection("users"), key, editor)).toBe(false);
      expect(await call(collection("users"), key, viewer)).toBe(false);
    }
    expect(await call(collection("users"), "update", editor)).toEqual({
      and: [
        { id: { equals: 99 } },
        { or: [{ id: { equals: 99 } }, { "tenants.tenant": { in: [1] } }] },
      ],
    });
  });

  it("lets only Super Admins change roles and tenant assignments", async () => {
    const collection = await configured();

    for (const name of ["roles", "tenants"]) {
      expect(fieldAllows(collection("users"), name, "update", superAdmin)).toBe(
        true,
      );
      expect(fieldAllows(collection("users"), name, "update", editor)).toBe(
        false,
      );
    }
  });

  it("reserves tenant management for Super Admins", async () => {
    const collection = await configured();

    for (const key of ["create", "update", "delete"] as const) {
      expect(await call(collection("tenants"), key, superAdmin)).toBe(true);
      expect(await call(collection("tenants"), key, editor)).toBe(false);
    }
    expect(await call(collection("tenants"), "read", viewer)).toEqual({
      id: { in: [1, 2] },
    });
  });

  it("locks the tenant domain and slug to Super Admins", async () => {
    const collection = await configured();

    for (const name of ["domain", "slug"]) {
      for (const key of ["create", "update"] as const) {
        expect(fieldAllows(collection("tenants"), name, key, superAdmin)).toBe(
          true,
        );
        expect(fieldAllows(collection("tenants"), name, key, editor)).toBe(
          false,
        );
      }
    }
  });
});

describe("promoteFirstUserToSuperAdmin", () => {
  function run(operation: "create" | "update", existingUsers: number) {
    return promoteFirstUserToSuperAdmin({
      data: { email: "a@example.com", roles: ["tenant-viewer"] },
      operation,
      req: {
        payload: { count: async () => ({ totalDocs: existingUsers }) },
      },
    } as unknown as Parameters<typeof promoteFirstUserToSuperAdmin>[0]);
  }

  it("makes the very first user a Super Admin", async () => {
    expect(await run("create", 0)).toMatchObject({ roles: ["super-admin"] });
  });

  it("leaves later users with the roles they were given", async () => {
    expect(await run("create", 1)).toMatchObject({ roles: ["tenant-viewer"] });
    expect(await run("update", 0)).toMatchObject({ roles: ["tenant-viewer"] });
  });
});
