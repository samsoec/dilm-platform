import type {
  ArrayField,
  CheckboxField,
  Condition,
  Field,
  TextField,
  TextFieldSingleValidation,
} from "payload";
import { describe, expect, it } from "vitest";

import { link } from "../fields/link";
import {
  accessAs,
  applyMultiTenant,
  fieldNames,
  findField,
  subfields,
  testUser,
} from "../testing";
import {
  Header,
  MAX_DROPDOWN_LINKS,
  MAX_NAV_ITEMS,
  NAV_ITEM_TYPES,
} from "./Header";
import { Tenants } from "./Tenants";
import { Users } from "./Users";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);
const outsider = testUser(["tenant-editor"], [2]);

async function configured() {
  return (await applyMultiTenant([Users, Tenants, Header]))("header");
}

function shown(field: Field, siblingData: object) {
  const condition = field.admin!.condition as Condition;
  return condition({}, siblingData, {} as Parameters<Condition>[2]);
}

const navItems = findField(Header.fields, "navItems") as ArrayField;
const navItem = (name: string) => findField(navItems.fields, name);
const cta = findField(Header.fields, "cta");

describe("header", () => {
  it("is a multi-tenant global: one document per tenant", async () => {
    const header = await configured();

    expect(findField(header.fields, "tenant")).toMatchObject({
      type: "relationship",
      relationTo: "tenants",
      unique: true,
    });
  });

  it("keeps versions for rollback without drafts", () => {
    expect(Header.versions).toEqual({ drafts: false });
  });

  it("holds menu items, utility toggles and the CTA, but no logos", () => {
    expect(fieldNames(Header.fields)).toEqual(
      expect.arrayContaining([
        "navItems",
        "showSearch",
        "showLanguageSwitcher",
        "cta",
      ]),
    );
    expect(
      fieldNames(Header.fields).filter((name) => /logo/i.test(name)),
    ).toEqual([]);
  });

  it("caps the menu at eight link or dropdown items", () => {
    expect(navItems).toMatchObject({ type: "array", maxRows: MAX_NAV_ITEMS });
    expect(MAX_NAV_ITEMS).toBe(8);
    expect(navItem("type")).toMatchObject({
      type: "radio",
      required: true,
      defaultValue: "link",
      options: [...NAV_ITEM_TYPES],
    });
    expect(NAV_ITEM_TYPES).toEqual(["link", "dropdown"]);
  });

  it("shows a link for link items and a label with children for dropdowns", () => {
    for (const [name, type] of [
      ["link", "link"],
      ["label", "dropdown"],
      ["children", "dropdown"],
    ] as const) {
      expect(shown(navItem(name), { type })).toBe(true);
      expect(
        shown(navItem(name), { type: type === "link" ? "dropdown" : "link" }),
      ).toBe(false);
    }
  });

  it("uses the shared link field for menu links and dropdown children", () => {
    const children = navItem("children") as ArrayField;

    expect(fieldNames(subfields(navItem("link")))).toEqual(
      fieldNames(link().fields),
    );
    expect(children).toMatchObject({
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_DROPDOWN_LINKS,
    });
    expect(MAX_DROPDOWN_LINKS).toBe(6);
    expect(fieldNames(children.fields)).toEqual(fieldNames([link()]));
  });

  it("shares the menu structure across locales and localizes only labels", () => {
    const localized = (fields: Field[]): string[] =>
      fields.flatMap((field) => [
        ...("localized" in field && field.localized && "name" in field
          ? [field.name]
          : []),
        ...("fields" in field ? localized(field.fields) : []),
      ]);

    expect(navItems.localized).toBeUndefined();
    expect(localized(Header.fields)).toEqual([
      "label",
      "label",
      "label",
      "label",
    ]);
  });

  it("requires a dropdown label", () => {
    const validate = (navItem("label") as TextField)
      .validate as TextFieldSingleValidation;
    const args = {} as Parameters<TextFieldSingleValidation>[1];

    expect(validate("", args)).toBeTypeOf("string");
    expect(validate("About Us", args)).toBe(true);
  });

  it("hides search by default and shows the language switcher", () => {
    expect(findField(Header.fields, "showSearch")).toMatchObject({
      type: "checkbox",
      defaultValue: false,
    });
    expect(findField(Header.fields, "showLanguageSwitcher")).toMatchObject({
      type: "checkbox",
      defaultValue: true,
    });
  });

  it("shows the CTA link only once the button is enabled", () => {
    const enabled = findField(subfields(cta), "enabled") as CheckboxField;
    const ctaLink = findField(subfields(cta), "link");

    expect(enabled).toMatchObject({ type: "checkbox" });
    expect(shown(ctaLink, { enabled: true })).toBe(true);
    expect(shown(ctaLink, { enabled: false })).toBe(false);
  });

  describe("access", () => {
    it("scopes Tenant Editors and Viewers to their own tenant's header", async () => {
      const header = await configured();

      for (const as of [editor, viewer]) {
        expect(await accessAs(header, "read", as)).toEqual({
          tenant: { in: [1] },
        });
      }
      expect(await accessAs(header, "update", editor)).toEqual({
        tenant: { in: [1] },
      });
      expect(await accessAs(header, "read", outsider)).toEqual({
        tenant: { in: [2] },
      });
    });

    it("keeps Tenant Viewers read-only", async () => {
      const header = await configured();

      for (const key of ["create", "update", "delete"] as const) {
        expect(await accessAs(header, key, viewer)).toBe(false);
      }
    });

    it("lets Super Admins manage every tenant and alone delete a header", async () => {
      const header = await configured();

      for (const key of ["read", "create", "update", "delete"] as const) {
        expect(await accessAs(header, key, superAdmin)).toBe(true);
      }
      expect(await accessAs(header, "delete", editor)).toBe(false);
    });
  });
});
