import type { Field, FieldAccess, PayloadRequest } from "payload";
import { describe, expect, it } from "vitest";

import { Footer } from "../collections/Footer";
import { Header } from "../collections/Header";
import {
  changedRowStructure,
  defaultLocaleOnly,
  keepRowStructure,
} from "./structure";

function leaves(fields: Field[], prefix = ""): [string, Field][] {
  return fields.flatMap((field): [string, Field][] => {
    if (field.type === "ui") return [];
    if (field.type === "tabs") {
      return field.tabs.flatMap((tab) => leaves(tab.fields, prefix));
    }
    if ("fields" in field) {
      const path = "name" in field ? `${prefix}${field.name}.` : prefix;
      return leaves(field.fields, path);
    }
    return "name" in field ? [[`${prefix}${field.name}`, field]] : [];
  });
}

function update(field: Field, locale: string) {
  const access = (field as { access?: { update?: FieldAccess } }).access
    ?.update;
  return access
    ? access({
        req: { locale } as PayloadRequest,
      } as Parameters<FieldAccess>[0])
    : true;
}

describe("shared structure is edited in English only (FR-UI-41)", () => {
  it.each([
    ["header", Header.fields],
    ["footer", Footer.fields],
  ])("locks every non-localized %s field outside EN", (_, fields) => {
    const all = leaves(fields).filter(([path]) => path !== "updatedBy");
    const locked = all.filter(([, field]) => update(field, "id") === false);
    const localized = all.filter(
      ([, field]) => "localized" in field && field.localized,
    );

    expect(locked.length).toBeGreaterThan(0);
    expect(locked.length + localized.length).toBe(all.length);
    for (const [, field] of all) expect(update(field, "en")).toBe(true);
    for (const [, field] of localized) expect(update(field, "id")).toBe(true);
  });

  it("treats a request without a locale as the default locale", () => {
    expect(
      defaultLocaleOnly({
        req: { locale: undefined } as unknown as PayloadRequest,
      } as Parameters<FieldAccess>[0]),
    ).toBe(true);
  });
});

describe("row structure guard", () => {
  const original = {
    navItems: [
      { id: "a", label: "About", children: [{ id: "a1" }, { id: "a2" }] },
      { id: "b", label: "News", children: [] },
    ],
    cta: { enabled: true },
  };

  it("allows relabelling rows", () => {
    expect(
      changedRowStructure(
        {
          navItems: [
            {
              id: "a",
              label: "Tentang",
              children: [{ id: "a1" }, { id: "a2" }],
            },
            { id: "b", label: "Berita", children: [] },
          ],
        },
        original,
      ),
    ).toEqual([]);
  });

  it("spots added, removed and reordered rows at any depth", () => {
    expect(
      changedRowStructure(
        { navItems: [original.navItems[1], original.navItems[0]] },
        original,
      ),
    ).toEqual(["navItems"]);
    expect(
      changedRowStructure(
        {
          navItems: [
            { ...original.navItems[0], children: [{ id: "a2" }] },
            original.navItems[1],
          ],
        },
        original,
      ),
    ).toEqual(["navItems"]);
  });

  it("ignores arrays the request doesn't send", () => {
    expect(changedRowStructure({ cta: { enabled: false } }, original)).toEqual(
      [],
    );
  });

  const run = (locale: string, data: Record<string, unknown>) =>
    keepRowStructure({
      data,
      operation: "update",
      originalDoc: original,
      req: { locale } as PayloadRequest,
    } as Parameters<typeof keepRowStructure>[0]);

  it("rejects a reorder saved in Indonesian and allows it in English", () => {
    const reordered = {
      navItems: [original.navItems[1], original.navItems[0]],
    };
    expect(() => run("id", reordered)).toThrow(
      /only be added, removed or reordered in English/,
    );
    expect(run("en", reordered)).toBe(reordered);
  });
});

describe("row structure guard and rich text", () => {
  const span = (text: string, format = 0) => ({
    type: "text",
    text,
    format,
    version: 1,
  });
  const heading = (...children: unknown[]) => ({
    root: {
      type: "root",
      version: 1,
      children: [{ type: "heading", tag: "h2", version: 1, children }],
    },
  });
  const original = {
    ctaBand: { heading: heading(span("Build "), span("better", 2)) },
    navItems: [
      { id: "a", label: "About", body: heading(span("x")), children: [] },
      { id: "b", label: "News", children: [{ id: "b1" }] },
    ],
  };
  const run = (
    locale: string,
    data: Record<string, unknown>,
    originalDoc: Record<string, unknown> = original,
  ) =>
    keepRowStructure({
      data,
      operation: "update",
      originalDoc,
      req: { locale } as PayloadRequest,
    } as Parameters<typeof keepRowStructure>[0]);

  it("allows italic spans to split differently in another locale", () => {
    const data = {
      ctaBand: {
        heading: heading(span("Bangun "), span("lebih", 2), span(" baik")),
      },
    };
    expect(run("id", data)).toBe(data);
  });

  it("allows a rich text value that the stored document does not have yet", () => {
    const data = { ctaBand: { heading: heading(span("Halo", 2)) } };
    expect(run("id", data, { ctaBand: {}, navItems: original.navItems })).toBe(
      data,
    );
    expect(changedRowStructure({ navItems: original.navItems }, {})).toEqual([
      "navItems",
    ]);
  });

  it("still refuses added, removed and reordered rows around rich text", () => {
    const [a, b] = original.navItems;
    expect(changedRowStructure({ navItems: [a] }, original)).toEqual([
      "navItems",
    ]);
    expect(
      changedRowStructure({ navItems: [a, b, { id: "c" }] }, original),
    ).toEqual(["navItems"]);
    expect(changedRowStructure({ navItems: [b, a] }, original)).toEqual([
      "navItems",
    ]);
    expect(() => run("id", { navItems: [b, a] })).toThrow(
      /only be added, removed or reordered in English/,
    );
  });

  it("still refuses a row nested in a group or another array", () => {
    expect(
      changedRowStructure(
        {
          navItems: [
            original.navItems[0],
            { ...original.navItems[1], children: [{ id: "b1" }, { id: "b2" }] },
          ],
        },
        original,
      ),
    ).toEqual(["navItems"]);
    expect(
      changedRowStructure(
        { group: { items: [{ id: "x" }] } },
        { group: { items: [] } },
      ),
    ).toEqual(["group.items"]);
  });

  it("compares only the array rows when a row holds rich text", () => {
    const [a, b] = original.navItems;
    const retitled = {
      navItems: [
        { ...a, label: "Tentang", body: heading(span("y"), span("z", 2)) },
        b,
      ],
    };
    expect(changedRowStructure(retitled, original)).toEqual([]);
    expect(run("id", retitled)).toBe(retitled);
  });
});
