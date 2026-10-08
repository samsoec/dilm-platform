import type {
  Field,
  FieldHook,
  TextField,
  TextFieldSingleValidation,
} from "payload";
import { describe, expect, it } from "vitest";

import { fieldNames } from "../testing";
import { link } from "./link";

function find(fields: Field[], name: string): Field {
  for (const field of fields) {
    if ("name" in field && field.name === name) return field;
    if ("fields" in field) {
      const nested = find(field.fields, name);
      if (nested) return nested;
    }
  }
  return undefined as unknown as Field;
}

function textField(group: Field, name: string) {
  return find((group as { fields: Field[] }).fields, name) as TextField;
}

function check(
  group: Field,
  name: string,
  value: string,
  siblingData: Record<string, unknown>,
) {
  const validate = textField(group, name).validate as TextFieldSingleValidation;
  return validate(value, {
    siblingData,
  } as Parameters<TextFieldSingleValidation>[1]);
}

function visible(group: Field, name: string, siblingData: object) {
  const condition = textField(group, name).admin!.condition!;
  return condition({}, siblingData, {} as Parameters<typeof condition>[2]);
}

describe("link field", () => {
  it("has the type, target, label and new-tab fields", () => {
    const group = link();
    expect(group).toMatchObject({ name: "link", type: "group" });
    expect(fieldNames(group.fields)).toEqual([
      "type",
      "newTab",
      "internalPath",
      "externalUrl",
      "label",
    ]);
  });

  it("localizes only the label", () => {
    const group = link();
    const localized = fieldNames(group.fields).filter(
      (name) => (find(group.fields, name) as { localized?: boolean }).localized,
    );
    expect(localized).toEqual(["label"]);
    expect(group.localized).toBeUndefined();
  });

  it("drops the label when withLabel is false", () => {
    expect(fieldNames(link({ withLabel: false }).fields)).not.toContain(
      "label",
    );
  });

  it("takes a custom name", () => {
    expect(link({ name: "cta" }).name).toBe("cta");
  });

  it("shows only the target that matches the type", () => {
    const group = link();
    expect(visible(group, "internalPath", { type: "internal" })).toBe(true);
    expect(visible(group, "externalUrl", { type: "internal" })).toBe(false);
    expect(visible(group, "internalPath", { type: "external" })).toBe(false);
    expect(visible(group, "externalUrl", { type: "external" })).toBe(true);
  });

  it("clears the target that does not match the type on save", () => {
    const group = link();
    const run = (name: string, value: string, type: string) =>
      (textField(group, name).hooks!.beforeChange![0] as FieldHook)({
        value,
        siblingData: { type },
      } as unknown as Parameters<FieldHook>[0]);
    expect(run("externalUrl", "https://example.com", "internal")).toBeNull();
    expect(run("internalPath", "/about", "internal")).toBe("/about");
  });

  describe("internal paths", () => {
    const group = link();
    const internal = (value: string) =>
      check(group, "internalPath", value, { type: "internal" });

    it("accept site paths", () => {
      for (const path of ["/", "/about", "/investor/reports?year=2025"]) {
        expect(internal(path)).toBe(true);
      }
    });

    it("reject paths without a leading slash or with two", () => {
      for (const path of ["about", "https://example.com", "//example.com"]) {
        expect(internal(path)).toBeTypeOf("string");
      }
    });

    it("reject a locale prefix", () => {
      for (const path of ["/en", "/id/", "/en/about", "/ID/tentang", "/id?x"]) {
        expect(internal(path)).toBeTypeOf("string");
      }
      expect(internal("/english")).toBe(true);
      expect(internal("/identity")).toBe(true);
    });
  });

  it("accepts only https external URLs", () => {
    const group = link();
    const external = (value: string) =>
      check(group, "externalUrl", value, { type: "external" });
    expect(external("https://example.com/page")).toBe(true);
    expect(external("http://example.com")).toBeTypeOf("string");
    expect(external("example.com")).toBeTypeOf("string");
  });

  it("ignores the target that does not match the type", () => {
    const group = link({ required: true });
    expect(check(group, "externalUrl", "", { type: "internal" })).toBe(true);
    expect(check(group, "internalPath", "nope", { type: "external" })).toBe(
      true,
    );
  });

  it("requires the active target only when the link is required", () => {
    const sibling = { type: "external" };
    expect(check(link(), "externalUrl", "", sibling)).toBe(true);
    expect(
      check(link({ required: true }), "externalUrl", "", sibling),
    ).toBeTypeOf("string");
  });

  it("requires a label once the link points somewhere", () => {
    expect(check(link(), "label", "", { type: "internal" })).toBe(true);
    expect(
      check(link(), "label", "", { type: "internal", internalPath: "/about" }),
    ).toBeTypeOf("string");
    expect(
      check(link({ required: true }), "label", "", { type: "internal" }),
    ).toBeTypeOf("string");
    expect(
      check(link(), "label", "About us", {
        type: "internal",
        internalPath: "/about",
      }),
    ).toBe(true);
  });
});
