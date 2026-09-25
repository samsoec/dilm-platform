import type { CollectionConfig } from "payload";
import { describe, expect, it } from "vitest";

import { Tenants } from "./collections/Tenants";
import { tenantScopedCollections, withTenantAccess } from "./tenancy";
import { applyMultiTenant } from "./testing";

const users: CollectionConfig = { slug: "users", auth: true, fields: [] };
const posts: CollectionConfig = {
  slug: "posts",
  fields: [{ name: "title", type: "text" }],
};

describe("withTenantAccess", () => {
  it("leaves the collection's own config untouched", () => {
    const wrapped = withTenantAccess(posts);

    expect(wrapped).toMatchObject(posts);
    expect(posts.custom).toBeUndefined();
  });
});

describe("tenantScopedCollections", () => {
  it("lists only wrapped collections, with their options", () => {
    expect(
      tenantScopedCollections([
        users,
        Tenants,
        withTenantAccess(posts, { isGlobal: true }),
      ]),
    ).toEqual({ posts: { isGlobal: true } });
  });
});

describe("multiTenant", () => {
  it("adds a tenant field and tenant access to wrapped collections", async () => {
    const collection = await applyMultiTenant([
      users,
      Tenants,
      withTenantAccess(posts),
    ]);

    expect(
      collection("posts").fields.map((field) => "name" in field && field.name),
    ).toEqual(["tenant", "title"]);
    expect(collection("posts").access?.read).toBeTypeOf("function");
  });

  it("leaves unwrapped collections alone", async () => {
    const collection = await applyMultiTenant([users, Tenants, posts]);

    expect(collection("posts").fields).toEqual(posts.fields);
  });

  it("gives users a tenants field", async () => {
    const collection = await applyMultiTenant([users, Tenants]);

    expect(
      collection("users").fields.map((field) => "name" in field && field.name),
    ).toContain("tenants");
  });
});
