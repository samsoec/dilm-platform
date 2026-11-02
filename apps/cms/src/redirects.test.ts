import type { AccessArgs, CollectionConfig } from "payload";
import { describe, expect, it } from "vitest";

import { redirectFields, redirectsOverrides } from "./redirects";
import { fieldNames, findField, testUser } from "./testing";

type Key = "read" | "create" | "update" | "delete";

const access = redirectsOverrides.access;

function run(key: Key, user: object | null, data?: object) {
  return (access[key] as NonNullable<CollectionConfig["access"]>[Key])!({
    req: { user },
    data,
  } as AccessArgs);
}

const superAdmin = testUser(["super-admin"]);
const editorA = testUser(["tenant-editor"], [1]);
const viewerA = testUser(["tenant-viewer"], [1]);
const editorNone = testUser(["tenant-editor"], []);

const OWN_MANUAL = {
  and: [{ origin: { equals: "manual" } }, { tenant: { in: [1] } }],
};

describe("redirect read access", () => {
  it("lets anonymous callers read every row for the public site", () => {
    expect(run("read", null)).toBe(true);
  });

  it("lets super admins read every row", () => {
    expect(run("read", superAdmin)).toBe(true);
  });

  it.each([
    ["tenant editors", editorA],
    ["tenant viewers", viewerA],
  ])("limits %s to their tenant plus global rows", (_, user) => {
    expect(run("read", user)).toEqual({
      or: [{ tenant: { exists: false } }, { tenant: { in: [1] } }],
    });
  });

  it("limits a member with no tenants to global rows", () => {
    expect(run("read", editorNone)).toEqual({ tenant: { exists: false } });
  });
});

describe("redirect create access", () => {
  it("lets super admins create anything", () => {
    expect(run("create", superAdmin, { origin: "auto" })).toBe(true);
    expect(run("create", superAdmin, { tenant: null })).toBe(true);
  });

  it("lets a tenant editor create a manual row for their own tenant", () => {
    expect(run("create", editorA, { tenant: 1 })).toBe(true);
    expect(
      run("create", editorA, { tenant: { id: 1 }, origin: "manual" }),
    ).toBe(true);
  });

  it("refuses a tenant editor a global row", () => {
    expect(run("create", editorA, { tenant: null })).toBe(false);
    expect(run("create", editorA, {})).toBe(false);
  });

  it("refuses a tenant editor an automatic row", () => {
    expect(run("create", editorA, { tenant: 1, origin: "auto" })).toBe(false);
  });

  it("refuses a tenant editor another tenant's row", () => {
    expect(run("create", editorA, { tenant: 2 })).toBe(false);
  });

  it("refuses viewers and signed-out callers", () => {
    expect(run("create", viewerA, { tenant: 1 })).toBe(false);
    expect(run("create", null, { tenant: 1 })).toBe(false);
  });
});

describe.each(["update", "delete"] as const)("redirect %s access", (key) => {
  it("lets super admins change any row", () => {
    expect(run(key, superAdmin)).toBe(true);
  });

  it("scopes a tenant editor to manual rows of their own tenant", () => {
    expect(run(key, editorA)).toEqual(OWN_MANUAL);
  });

  it("refuses a tenant editor with no tenants", () => {
    expect(run(key, editorNone)).toBe(false);
  });

  it("refuses viewers and signed-out callers", () => {
    expect(run(key, viewerA)).toBe(false);
    expect(run(key, null)).toBe(false);
  });
});

describe("redirect fields", () => {
  const fields = redirectFields();

  it("holds from, to, tenant, locale and origin", () => {
    expect(fieldNames(fields)).toEqual(
      expect.arrayContaining(["from", "to", "tenant", "locale", "origin"]),
    );
  });

  it("builds to on the link factory without link text", () => {
    const to = findField(fields, "to") as { fields: unknown[] };
    expect(fieldNames(to.fields as never)).toEqual(
      expect.arrayContaining(["type", "newTab", "internalPath", "externalUrl"]),
    );
    expect(fieldNames(to.fields as never)).not.toContain("label");
  });

  it("leaves tenant empty-able and points it at tenants", () => {
    expect(findField(fields, "tenant")).toMatchObject({
      type: "relationship",
      relationTo: "tenants",
    });
    expect(findField(fields, "tenant")).not.toHaveProperty("required", true);
  });

  it("offers en and id for locale", () => {
    expect(findField(fields, "locale")).toMatchObject({
      options: [
        { value: "en", label: "English" },
        { value: "id", label: "Bahasa Indonesia" },
      ],
    });
  });

  it("makes origin read-only in the admin and Super Admin-only to set", () => {
    const origin = findField(fields, "origin") as unknown as {
      admin: { readOnly: boolean };
      access: { create: (args: AccessArgs) => boolean; update: () => boolean };
      options: { value: string }[];
    };
    expect(origin.admin.readOnly).toBe(true);
    expect(origin.options.map((o) => o.value)).toEqual(["auto", "manual"]);
    expect(origin.access.create({ req: { user: superAdmin } } as never)).toBe(
      true,
    );
    expect(origin.access.create({ req: { user: editorA } } as never)).toBe(
      false,
    );
    expect(origin.access.update()).toBe(false);
  });

  it("lets only Super Admins move a row between tenants", () => {
    const tenant = findField(fields, "tenant") as unknown as {
      access: { update: (args: AccessArgs) => boolean };
    };
    expect(tenant.access.update({ req: { user: superAdmin } } as never)).toBe(
      true,
    );
    expect(tenant.access.update({ req: { user: editorA } } as never)).toBe(
      false,
    );
  });
});
