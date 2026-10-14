import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  JsonObject,
  PayloadRequest,
} from "payload";
import { beforeValidateTraverseFields } from "payload";
import { describe, expect, it } from "vitest";

import { Footer } from "../collections/Footer";
import { Header } from "../collections/Header";
import { TenantSettings } from "../collections/TenantSettings";
import { Tenants } from "../collections/Tenants";
import { Users } from "../collections/Users";
import { applyMultiTenant, findField, testUser } from "../testing";
import { stampUpdatedBy, updatedByField, withUpdatedBy } from "./updatedBy";

const editor = testUser(["tenant-editor"], [1]);
const superAdmin = { ...testUser(["super-admin"]), id: 7 };

type HookArgs = Parameters<CollectionBeforeChangeHook>[0];

function stamp(data: JsonObject, user: object | null) {
  return stampUpdatedBy({ data, req: { user } } as HookArgs);
}

function requestAs(user: object | null) {
  return { user, context: {}, payload: {} } as unknown as PayloadRequest;
}

async function validated(
  operation: "create" | "update",
  data: JsonObject,
  user: object | null,
  doc: JsonObject = {},
) {
  const siblingData = { ...data };
  await beforeValidateTraverseFields({
    collection: null,
    context: {},
    data: siblingData,
    doc,
    fields: [updatedByField],
    global: null,
    operation,
    overrideAccess: false,
    parentIndexPath: "",
    parentPath: "",
    parentSchemaPath: "",
    req: requestAs(user),
    siblingData,
    siblingDoc: doc,
  });
  return siblingData;
}

async function save(
  operation: "create" | "update",
  data: JsonObject,
  user: object | null,
  doc: JsonObject = {},
) {
  const checked = await validated(operation, data, user, doc);
  return stampUpdatedBy({ data: checked, req: requestAs(user) } as HookArgs);
}

describe("updatedBy", () => {
  it("is a read-only users relationship in the sidebar", () => {
    expect(updatedByField).toMatchObject({
      name: "updatedBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar", readOnly: true },
    });
  });

  it("stamps the signed-in user on every save", () => {
    expect(stamp({ siteName: "DKU" }, editor)).toEqual({
      siteName: "DKU",
      updatedBy: editor.id,
    });
  });

  it("overwrites a value smuggled into the request", () => {
    expect(stamp({ updatedBy: 1 }, editor)).toEqual({ updatedBy: editor.id });
  });

  it("leaves system saves without a user untouched", () => {
    expect(stamp({ updatedBy: 3 }, null)).toEqual({ updatedBy: 3 });
  });

  it("strips an editor's own updatedBy before the stamp", async () => {
    const field = updatedByField.access!;
    const args = { req: { user: editor } } as Parameters<
      NonNullable<typeof field.update>
    >[0];

    expect(await field.create!(args)).toBe(false);
    expect(await field.update!(args)).toBe(false);
    expect(await validated("create", { updatedBy: 1 }, editor)).toEqual({});
    expect(
      await validated("update", { updatedBy: 1 }, editor, { updatedBy: 3 }),
    ).toEqual({ updatedBy: 3 });
    expect(await save("create", { updatedBy: 1 }, editor)).toEqual({
      updatedBy: editor.id,
    });
    expect(
      await save("update", { updatedBy: 1 }, editor, { updatedBy: 3 }),
    ).toEqual({ updatedBy: editor.id });
  });

  it("does not let Super Admins set it either", async () => {
    expect(
      await save("update", { updatedBy: 1 }, superAdmin, { updatedBy: 3 }),
    ).toEqual({ updatedBy: superAdmin.id });
  });

  it("keeps a collection's own hooks ahead of the stamp", () => {
    const own: CollectionBeforeChangeHook = ({ data }) => data;
    const wrapped = withUpdatedBy({
      slug: "x",
      hooks: { beforeChange: [own] },
      fields: [],
    });

    expect(wrapped.hooks!.beforeChange).toEqual([own, stampUpdatedBy]);
    expect(wrapped.fields).toEqual([updatedByField]);
  });

  describe.each([
    ["header", Header],
    ["footer", Footer],
    ["tenant-settings", TenantSettings],
  ] as const)("%s", (slug, collection: CollectionConfig) => {
    it("carries the field and the stamp through the multi-tenant plugin", async () => {
      const configured = (await applyMultiTenant([Users, Tenants, collection]))(
        slug,
      );

      expect(findField(configured.fields, "updatedBy")).toEqual(updatedByField);
      expect(configured.hooks?.beforeChange).toContain(stampUpdatedBy);
    });
  });

  it("is kept in header and footer versions", () => {
    for (const collection of [Header, Footer]) {
      expect(collection.versions).toBeTruthy();
      expect(collection.fields).toContain(updatedByField);
    }
  });
});
