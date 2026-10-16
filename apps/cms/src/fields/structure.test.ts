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
