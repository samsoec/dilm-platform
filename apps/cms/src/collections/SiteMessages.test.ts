import type { ArrayField, RichTextField } from "payload";
import { describe, expect, it } from "vitest";

import { link } from "../fields/link";
import { requireCookiePolicyLink } from "../siteMessages";
import {
  accessAs,
  applyMultiTenant,
  fieldNames,
  findField,
  subfields,
  testUser,
} from "../testing";
import { MAX_NOT_FOUND_BUTTONS, SiteMessages } from "./SiteMessages";
import { Tenants } from "./Tenants";
import { Users } from "./Users";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);

async function configured() {
  return (await applyMultiTenant([Users, Tenants, SiteMessages]))(
    "site-messages",
  );
}

const notFound = subfields(findField(SiteMessages.fields, "notFound"));
const banner = subfields(findField(SiteMessages.fields, "cookieBanner"));

describe("site-messages", () => {
  it("is a multi-tenant global: one document per tenant", async () => {
    const messages = await configured();

    expect(findField(messages.fields, "tenant")).toMatchObject({
      type: "relationship",
      relationTo: "tenants",
      unique: true,
    });
  });

  it("keeps versions for rollback without drafts", () => {
    expect(SiteMessages.versions).toEqual({ drafts: false });
  });

  describe("404 page", () => {
    it("has an unlocalized code, a localized title and description", () => {
      expect(findField(notFound, "code")).toMatchObject({ type: "text" });
      expect(findField(notFound, "code")).not.toHaveProperty("localized");
      expect(findField(notFound, "title")).toMatchObject({
        type: "text",
        localized: true,
      });
      expect(findField(notFound, "description")).toMatchObject({
        localized: true,
      });
    });

    it("takes at most two buttons built like every other link", () => {
      const buttons = findField(notFound, "buttons") as ArrayField;

      expect(buttons).toMatchObject({
        type: "array",
        maxRows: MAX_NOT_FOUND_BUTTONS,
      });
      expect(MAX_NOT_FOUND_BUTTONS).toBe(2);
      expect(buttons.minRows).toBeUndefined();
      expect(fieldNames(buttons.fields)).toEqual(fieldNames([link()]));
    });
  });

  describe("cookie banner", () => {
    it("localizes the texts but not the policy version", () => {
      for (const name of ["title", "acceptLabel", "rejectLabel"]) {
        expect(findField(banner, name)).toMatchObject({
          type: "text",
          localized: true,
        });
      }
      expect(findField(banner, "policyVersion")).toMatchObject({
        type: "text",
      });
      expect(findField(banner, "policyVersion")).not.toHaveProperty(
        "localized",
      );
    });

    it("has a localized rich body that must link to the Cookie Policy", () => {
      const field = findField(banner, "body") as RichTextField;

      expect(field).toMatchObject({ type: "richText", localized: true });
      expect(field.validate).toBe(requireCookiePolicyLink);
      expect(field.editor).toBeTypeOf("function");
    });
  });

  describe("access", () => {
    it("scopes Tenant Editors and Viewers to their own tenant's messages", async () => {
      const messages = await configured();

      for (const as of [editor, viewer]) {
        expect(await accessAs(messages, "read", as)).toEqual({
          tenant: { in: [1] },
        });
      }
      expect(await accessAs(messages, "update", editor)).toEqual({
        tenant: { in: [1] },
      });
    });

    it("keeps Tenant Viewers read-only", async () => {
      const messages = await configured();

      for (const key of ["create", "update", "delete"] as const) {
        expect(await accessAs(messages, key, viewer)).toBe(false);
      }
    });

    it("lets Super Admins manage every tenant and alone delete", async () => {
      const messages = await configured();

      for (const key of ["read", "create", "update", "delete"] as const) {
        expect(await accessAs(messages, key, superAdmin)).toBe(true);
      }
      expect(await accessAs(messages, "delete", editor)).toBe(false);
    });
  });
});
