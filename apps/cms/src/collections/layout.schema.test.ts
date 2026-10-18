import type { Field, RadioField } from "payload";
import { describe, expect, it } from "vitest";

import { FOOTER_SECTIONS } from "../admin/layoutEditor";
import { link } from "../fields/link";
import { schemaShape } from "../schemaShape";
import { applyMultiTenant, findField, subfields } from "../testing";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Tenants } from "./Tenants";
import { Users } from "./Users";

describe("header and footer data shape (DILM-61)", () => {
  it.each(["header", "footer"])(
    "keeps every %s data path, so the editor restyle needs no migration",
    async (slug) => {
      const collection = (
        await applyMultiTenant([Users, Tenants, Header, Footer])
      )(slug);
      expect(schemaShape(collection.fields).sort()).toMatchSnapshot();
    },
  );
});

describe("header and footer editor layout (TRD-UI §6.4, §6.5)", () => {
  const named = (fields: Field[]) =>
    Object.fromEntries(
      fields.flatMap((field) => ("name" in field ? [[field.name, field]] : [])),
    ) as Record<string, Field>;
  const position = (field: Field) =>
    (field.admin as { position?: string } | undefined)?.position;

  it.each([
    ["header", Header],
    ["footer", Footer],
  ])(
    "opens the %s editor with the locale banner and version info",
    (_, collection) => {
      expect(collection.fields[0]).toMatchObject({
        name: "localeBanner",
        type: "ui",
      });
      const fields = named(collection.fields);
      expect(position(fields.versionInfo)).toBe("sidebar");
      expect(position(fields.sourcedFrom)).toBe("sidebar");
    },
  );

  it("moves search, the language switcher and the CTA to the header sidebar", () => {
    const fields = named(Header.fields);
    for (const name of ["showSearch", "showLanguageSwitcher", "cta"]) {
      expect(position(fields[name]), name).toBe("sidebar");
    }
  });

  it("heads the footer's four sections with numbered anchors in order", () => {
    const order = Footer.fields.flatMap((field) =>
      "name" in field ? [field.name] : [],
    );
    expect(
      order.filter(
        (name) => name.startsWith("section_") || name === "sectionJump",
      ),
    ).toEqual([
      "sectionJump",
      ...FOOTER_SECTIONS.map(
        ({ anchor }) => `section_${anchor.replaceAll("-", "_")}`,
      ),
    ]);
    const before = (section: string, data: string) =>
      order.indexOf(section) < order.indexOf(data);
    expect(before("section_contact_band", "ctaBand")).toBe(true);
    expect(before("section_link_columns", "linkColumns")).toBe(true);
    expect(before("section_part_of", "partOf")).toBe(true);
    expect(before("section_copyright", "copyright")).toBe(true);
  });

  it("calls link types This site and Other site without changing the values", () => {
    const type = findField(subfields(link()), "type") as RadioField;
    expect(type.options).toEqual([
      { value: "internal", label: "This site" },
      { value: "external", label: "Other site" },
    ]);
  });
});
