import type {
  Field,
  FieldHook,
  RelationshipField,
  TextField,
  TextFieldSingleValidation,
} from "payload";
import { describe, expect, it } from "vitest";

import { fieldNames } from "../testing";
import {
  REFERENCE_COLLECTIONS,
  hasTarget,
  link,
  referenceFilter,
} from "./link";
import { resolveLink } from "./linkResolve";

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
      "reference",
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

const published = { _status: { equals: "published" } };

describe("reference links", () => {
  const reference = () =>
    find(link({ required: true }).fields, "reference") as RelationshipField;

  it("points at the seven page and record collections", () => {
    expect(reference().relationTo).toEqual([
      "pages",
      "shared-pages",
      "products",
      "solutions",
      "jobs",
      "posts",
      "categories",
    ]);
    expect(REFERENCE_COLLECTIONS).toHaveLength(7);
  });

  it("scopes the picker for a tenant-scoped document", () => {
    const owner = 2;
    expect(referenceFilter("pages", owner)).toEqual({
      and: [published, { tenant: { equals: "2" } }],
    });
    expect(referenceFilter("jobs", owner)).toEqual({
      and: [published, { tenant: { equals: "2" } }],
    });
    expect(referenceFilter("posts", { id: 2 })).toEqual({
      and: [published, { tenant: { equals: "2" } }],
    });
    expect(referenceFilter("shared-pages", owner)).toEqual(published);
    expect(referenceFilter("products", owner)).toEqual(published);
    expect(referenceFilter("solutions", owner)).toEqual(published);
    expect(referenceFilter("categories", owner)).toBe(true);
  });

  it("offers every tenant's documents on a shared document", () => {
    for (const collection of REFERENCE_COLLECTIONS) {
      expect(referenceFilter(collection, undefined)).toEqual(
        collection === "categories" ? true : published,
      );
    }
  });

  it("applies the filter through the field", async () => {
    const filter = reference().filterOptions as (args: unknown) => unknown;
    expect(await filter({ relationTo: "pages", data: { tenant: 3 } })).toEqual({
      and: [published, { tenant: { equals: "3" } }],
    });
    expect(await filter({ relationTo: "pages", data: {} })).toEqual(published);
  });

  it("is only visible, required and kept for reference links", async () => {
    const field = reference();
    const condition = field.admin!.condition!;
    const show = (data: object) =>
      condition({}, data, {} as Parameters<typeof condition>[2]);
    expect(show({ type: "reference" })).toBe(true);
    expect(show({ type: "internal" })).toBe(false);
    expect(show({})).toBe(false);

    const validate = field.validate as unknown as (
      value: unknown,
      args: unknown,
    ) => Promise<unknown>;
    expect(await validate(null, { siblingData: { type: "internal" } })).toBe(
      true,
    );
    expect(await validate(null, { siblingData: { type: "reference" } })).toBe(
      "Pick the page or record this link goes to.",
    );
    const optional = find(
      link({ required: false }).fields,
      "reference",
    ) as RelationshipField;
    expect(
      await (optional.validate as unknown as typeof validate)(null, {
        siblingData: { type: "reference" },
      }),
    ).toBe(true);

    const [clear] = field.hooks!.beforeChange! as FieldHook[];
    const run = (type: string) =>
      clear({
        value: { relationTo: "pages", value: 1 },
        siblingData: { type },
      } as unknown as Parameters<FieldHook>[0]);
    expect(run("reference")).toEqual({ relationTo: "pages", value: 1 });
    expect(run("external")).toBeNull();
  });

  it("clears the other targets when a link becomes a reference", () => {
    const group = link();
    const [clear] = textField(group, "internalPath").hooks!
      .beforeChange! as FieldHook[];
    expect(
      clear({
        value: "/about",
        siblingData: { type: "reference" },
      } as unknown as Parameters<FieldHook>[0]),
    ).toBeNull();
  });

  it("counts a picked reference as a target", () => {
    expect(
      hasTarget({
        type: "reference",
        reference: { relationTo: "pages", value: 4 },
      }),
    ).toBe(true);
    expect(
      hasTarget({
        type: "reference",
        reference: { relationTo: "pages", value: null },
      }),
    ).toBe(false);
    expect(hasTarget({ type: "reference" })).toBe(false);
    expect(hasTarget({ type: "internal", internalPath: "/a" })).toBe(true);
  });
});

describe("resolveLink", () => {
  const warn = () => {
    const messages: string[] = [];
    return { messages, warn: (message: string) => messages.push(message) };
  };
  const to = (relationTo: string, value: unknown) => ({
    type: "reference" as const,
    reference: { relationTo, value: value as never },
  });

  it("leaves internal and external links untouched", () => {
    expect(resolveLink({ internalPath: "/about" })).toBe("/about");
    expect(resolveLink({ type: "internal", internalPath: "/about" })).toBe(
      "/about",
    );
    expect(
      resolveLink({ type: "external", externalUrl: "https://x.co/a" }),
    ).toBe("https://x.co/a");
    expect(resolveLink({ type: "internal" })).toBeNull();
    expect(resolveLink(null)).toBeNull();
  });

  it("returns the current path of a same-company target", () => {
    const doc = { id: 1, _status: "published", tenant: 2, path: "/about/team" };
    expect(resolveLink(to("pages", doc), { tenant: 2 })).toBe("/about/team");
    expect(resolveLink(to("pages", doc), { tenant: { id: 2 } })).toBe(
      "/about/team",
    );
  });

  it("picks the path of the locale and falls back to English", () => {
    const doc = {
      id: 1,
      _status: "published",
      path: { en: "/about", id: "/tentang" },
    };
    expect(resolveLink(to("shared-pages", doc), { locale: "id" })).toBe(
      "/tentang",
    );
    const partial = { ...doc, path: { en: "/about", id: null } };
    expect(resolveLink(to("shared-pages", partial), { locale: "id" })).toBe(
      "/about",
    );
  });

  it("serves shared pages and categories as relative paths", () => {
    expect(
      resolveLink(
        to("shared-pages", { _status: "published", path: "/privacy" }),
        { tenant: 1 },
      ),
    ).toBe("/privacy");
    expect(
      resolveLink(to("categories", { path: "/category/news" }), { tenant: 1 }),
    ).toBe("/category/news");
  });

  it("opens the owner's domain for another company's target", () => {
    const doc = {
      id: 9,
      _status: "published",
      tenant: { id: 1, slug: "indoacid", domain: "indonesianacids.com" },
      path: "/products/sulfuric-acid",
    };
    expect(resolveLink(to("products", doc), { tenant: 2 })).toBe(
      "https://indonesianacids.com/products/sulfuric-acid",
    );
    expect(resolveLink(to("products", doc), { tenant: 1 })).toBe(
      "/products/sulfuric-acid",
    );
    const bySlug = { ...doc, tenant: { id: 3, slug: "likutelaga" } };
    expect(resolveLink(to("products", bySlug), { tenant: 2 })).toBe(
      "https://likutelaga.com/products/sulfuric-acid",
    );
    const byMap = { ...doc, tenant: 3 };
    expect(
      resolveLink(to("products", byMap), {
        tenant: 2,
        domains: { "3": "likutelaga.com" },
      }),
    ).toBe("https://likutelaga.com/products/sulfuric-acid");
  });

  it("returns null and logs when the owner's domain is unknown", () => {
    const { messages, warn: log } = warn();
    const doc = { _status: "published", tenant: 3, path: "/x" };
    expect(resolveLink(to("jobs", doc), { tenant: 2, warn: log })).toBeNull();
    expect(messages).toHaveLength(1);
  });

  it("returns null and logs for unpublished, trashed and missing targets", () => {
    const { messages, warn: log } = warn();
    const options = { tenant: 2, warn: log };
    expect(
      resolveLink(
        to("pages", { _status: "draft", tenant: 2, path: "/a" }),
        options,
      ),
    ).toBeNull();
    expect(
      resolveLink(
        to("pages", {
          _status: "published",
          deletedAt: "2026-01-01",
          path: "/a",
        }),
        options,
      ),
    ).toBeNull();
    expect(resolveLink(to("pages", 12), options)).toBeNull();
    expect(resolveLink(to("pages", null), options)).toBeNull();
    expect(resolveLink({ type: "reference" }, options)).toBeNull();
    expect(
      resolveLink(to("pages", { _status: "published", tenant: 2 }), options),
    ).toBeNull();
    expect(messages).toHaveLength(6);
  });
});
