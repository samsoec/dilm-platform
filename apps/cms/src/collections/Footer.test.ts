import type {
  ArrayField,
  Condition,
  Field,
  RichTextField,
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
  COPYRIGHT_TOKENS,
  Footer,
  isCopyrightTemplate,
  isItalicOnlyHeading,
  MAX_COLUMN_LINKS,
  MAX_LINK_COLUMNS,
} from "./Footer";
import { Tenants } from "./Tenants";
import { Users } from "./Users";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);

async function configured() {
  return (await applyMultiTenant([Users, Tenants, Footer]))("footer");
}

function shown(field: Field, siblingData: object) {
  const condition = field.admin!.condition as Condition;
  return condition({}, siblingData, {} as Parameters<Condition>[2]);
}

const ctaBand = subfields(findField(Footer.fields, "ctaBand"));
const linkColumns = findField(Footer.fields, "linkColumns") as ArrayField;
const partOf = subfields(findField(Footer.fields, "partOf"));

function text(value: string, format = 0) {
  return { type: "text", text: value, format, version: 1 };
}

function heading(...children: object[]) {
  return {
    root: {
      type: "root",
      version: 1,
      children: [{ type: "paragraph", version: 1, children }],
    },
  };
}

function checkHeading(value: object) {
  return isItalicOnlyHeading(value, {
    editor: { validate: () => true },
  } as unknown as Parameters<typeof isItalicOnlyHeading>[1]);
}

function checkCopyright(value: string) {
  return isCopyrightTemplate(
    value,
    {} as Parameters<TextFieldSingleValidation>[1],
  );
}

describe("footer", () => {
  it("is a multi-tenant global: one document per tenant", async () => {
    const footer = await configured();

    expect(findField(footer.fields, "tenant")).toMatchObject({
      type: "relationship",
      relationTo: "tenants",
      unique: true,
    });
  });

  it("keeps versions for rollback without drafts", () => {
    expect(Footer.versions).toEqual({ drafts: false });
  });

  it("leaves logo, tagline, contacts and social links to tenant-settings", () => {
    const names = fieldNames(Footer.fields);

    expect(names).toEqual(
      expect.arrayContaining(["ctaBand", "linkColumns", "partOf", "copyright"]),
    );
    for (const name of [
      "tagline",
      "phone",
      "contactPhone",
      "email",
      "contactEmail",
      "address",
      "socialLinks",
    ]) {
      expect(names).not.toContain(name);
    }
    expect(fieldNames(partOf)).toContain("logo");
    expect(names.filter((name) => /logo/i.test(name))).toEqual(["logo"]);
  });

  describe("contact band", () => {
    it("has a localized eyebrow and two buttons, the secondary optional", () => {
      expect(findField(ctaBand, "eyebrow")).toMatchObject({
        type: "text",
        localized: true,
      });
      for (const name of ["primaryButton", "secondaryButton"]) {
        const button = findField(ctaBand, name);
        expect(button).toMatchObject({ name, type: "group" });
        expect(fieldNames(subfields(button))).toEqual(
          fieldNames(link().fields),
        );
      }
      const missing = { type: "external", externalUrl: "" };
      const target = (name: string) =>
        findField(subfields(findField(ctaBand, name)), "externalUrl") as {
          validate: TextFieldSingleValidation;
        };
      const args = {
        siblingData: missing,
      } as unknown as Parameters<TextFieldSingleValidation>[1];
      expect(target("primaryButton").validate("", args)).toBeTypeOf("string");
      expect(target("secondaryButton").validate("", args)).toBe(true);
    });

    it("has a localized rich-text heading limited to italic", () => {
      const field = findField(ctaBand, "heading") as RichTextField;

      expect(field).toMatchObject({ type: "richText", localized: true });
      expect(field.validate).toBe(isItalicOnlyHeading);
      expect(field.editor).toBeTypeOf("function");
    });

    it("accepts plain and italic heading text", async () => {
      expect(
        await checkHeading(
          heading(text("Let's Find the Right Solution "), text("Together", 2)),
        ),
      ).toBe(true);
    });

    it("rejects any other formatting in the heading", async () => {
      for (const format of [1, 3, 8, 16]) {
        expect(
          await checkHeading(heading(text("Together", format))),
        ).toBeTypeOf("string");
      }
    });

    it("rejects headings, lists and links in the heading", async () => {
      expect(
        await checkHeading({
          root: {
            type: "root",
            children: [{ type: "heading", tag: "h2", children: [text("x")] }],
          },
        }),
      ).toBeTypeOf("string");
      expect(
        await checkHeading(
          heading({ type: "link", fields: {}, children: [text("x")] }),
        ),
      ).toBeTypeOf("string");
      expect(
        await checkHeading({
          root: { type: "root", children: [{ type: "list", children: [] }] },
        }),
      ).toBeTypeOf("string");
    });

    it("passes the editor's own validation errors through", async () => {
      expect(
        await isItalicOnlyHeading(heading(text("x")), {
          editor: { validate: () => "broken" },
        } as unknown as Parameters<typeof isItalicOnlyHeading>[1]),
      ).toBe("broken");
    });
  });

  it("caps the footer at four columns of up to eight links", () => {
    const links = findField(linkColumns.fields, "links") as ArrayField;

    expect(linkColumns).toMatchObject({
      type: "array",
      maxRows: MAX_LINK_COLUMNS,
    });
    expect(MAX_LINK_COLUMNS).toBe(4);
    expect(findField(linkColumns.fields, "title")).toMatchObject({
      type: "text",
      localized: true,
      required: true,
    });
    expect(links).toMatchObject({ type: "array", maxRows: MAX_COLUMN_LINKS });
    expect(MAX_COLUMN_LINKS).toBe(8);
    expect(fieldNames(links.fields)).toEqual(fieldNames([link()]));
    expect(linkColumns.localized).toBeUndefined();
  });

  it("shows the Part of label, logo and link only once enabled", () => {
    expect(findField(partOf, "enabled")).toMatchObject({ type: "checkbox" });
    expect(findField(partOf, "label")).toMatchObject({ localized: true });
    expect(findField(partOf, "logo")).toMatchObject({
      type: "upload",
      relationTo: "media",
    });
    for (const name of ["label", "logo", "link"]) {
      expect(shown(findField(partOf, name), { enabled: true })).toBe(true);
      expect(shown(findField(partOf, name), { enabled: false })).toBe(false);
    }
  });

  describe("copyright", () => {
    it("is localized text checked as a template", () => {
      expect(findField(Footer.fields, "copyright")).toMatchObject({
        type: "text",
        localized: true,
        validate: isCopyrightTemplate,
      });
      expect(COPYRIGHT_TOKENS).toEqual(["year", "legalName"]);
    });

    it("accepts {year}, {legalName} and plain text", () => {
      for (const value of [
        "",
        "All rights reserved",
        "Copyright © {year} {legalName}. All Right Reserved",
        "{legalName} {year} {year}",
      ]) {
        expect(checkCopyright(value)).toBe(true);
      }
    });

    it("rejects unknown placeholders, naming them", () => {
      expect(checkCopyright("© {Year} {company} {legalName}")).toBe(
        "Unknown placeholder {Year}, {company}; use {year} or {legalName}.",
      );
      expect(checkCopyright("© {}")).toBeTypeOf("string");
    });

    it("rejects an unclosed placeholder", () => {
      for (const value of ["© {year", "© year}", "© {{year}}"]) {
        expect(checkCopyright(value)).toBeTypeOf("string");
      }
    });
  });

  describe("access", () => {
    it("scopes Tenant Editors and Viewers to their own tenant's footer", async () => {
      const footer = await configured();

      for (const as of [editor, viewer]) {
        expect(await accessAs(footer, "read", as)).toEqual({
          tenant: { in: [1] },
        });
      }
      expect(await accessAs(footer, "update", editor)).toEqual({
        tenant: { in: [1] },
      });
    });

    it("keeps Tenant Viewers read-only", async () => {
      const footer = await configured();

      for (const key of ["create", "update", "delete"] as const) {
        expect(await accessAs(footer, key, viewer)).toBe(false);
      }
    });

    it("lets Super Admins manage every tenant and alone delete a footer", async () => {
      const footer = await configured();

      for (const key of ["read", "create", "update", "delete"] as const) {
        expect(await accessAs(footer, key, superAdmin)).toBe(true);
      }
      expect(await accessAs(footer, "delete", editor)).toBe(false);
    });
  });
});
