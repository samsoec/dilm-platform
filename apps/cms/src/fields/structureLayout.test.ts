import { describe, expect, it } from "vitest";

import { pageLayout } from "./pageFields";
import {
  changedRowStructure,
  isDefaultLocale,
  keepSectionStructure,
} from "./structure";

type AnyField = { name?: string; access?: unknown; localized?: boolean };

function leaves(fields: readonly unknown[]): AnyField[] {
  return (fields as AnyField[]).flatMap((field) => {
    const nested = (field as { fields?: unknown[] }).fields;
    return nested ? leaves(nested) : [field];
  });
}

describe("sections in Indonesian", () => {
  it("locks every shared field inside sections and keeps text editable", () => {
    const blocks = pageLayout().blocks;
    const all = blocks.flatMap((block) => leaves(block.fields));
    const shared = all.filter(
      (field) => field.name && !field.localized && "access" in field,
    );
    expect(shared.length).toBeGreaterThan(0);
    const localized = all.filter((field) => field.localized);
    expect(localized.length).toBeGreaterThan(0);
    expect(localized.every((field) => !field.access)).toBe(true);
  });

  const before = {
    layout: [
      { id: "a", blockType: "x", title: "Hello", items: [{ id: "i1" }] },
      { id: "b", blockType: "y" },
    ],
    breadcrumbs: [{ id: "z1" }],
  };

  it("flags reordered sections and changed list rows", () => {
    const reordered = { layout: [before.layout[1], before.layout[0]] };
    expect(changedRowStructure(reordered, before, ["layout"])).toEqual([
      "layout",
    ]);
    const rows = {
      layout: [
        { ...before.layout[0], items: [{ id: "i1" }, { id: "i2" }] },
        before.layout[1],
      ],
    };
    expect(changedRowStructure(rows, before, ["layout"])).toEqual(["layout"]);
  });

  it("allows text edits, unchanged saves and other row lists", () => {
    const edited = {
      layout: [{ ...before.layout[0], title: "Halo" }, before.layout[1]],
      breadcrumbs: [{ id: "new" }],
    };
    expect(changedRowStructure(edited, before, ["layout"])).toEqual([]);
    expect(changedRowStructure(before, before, ["layout"])).toEqual([]);
  });

  it("rejects on the server only in Indonesian updates", () => {
    const run = (locale: string, data: Record<string, unknown>) =>
      (keepSectionStructure as unknown as (args: object) => unknown)({
        data,
        operation: "update",
        originalDoc: before,
        req: { locale },
      });
    const moved = { layout: [before.layout[1], before.layout[0]] };
    expect(isDefaultLocale("id")).toBe(false);
    expect(() => run("id", moved)).toThrow(/English/);
    expect(() => run("en", moved)).not.toThrow();
    expect(() => run("id", before)).not.toThrow();
  });

  it("compares with the latest version, so a draft reorder in English does not block Indonesian", () => {
    const latest = {
      layout: [before.layout[1], before.layout[0]],
      title: "Old",
    };
    const form = {
      layout: [before.layout[1], before.layout[0]],
      title: "Baru",
    };
    expect(changedRowStructure(form, latest, ["layout"])).toEqual([]);
  });

  it("flags a stale form and says to reload", () => {
    const latest = { layout: [before.layout[1], before.layout[0]] };
    const stale = { layout: before.layout };
    expect(changedRowStructure(stale, latest, ["layout"])).toEqual(["layout"]);
    expect(() =>
      (keepSectionStructure as unknown as (args: object) => unknown)({
        data: stale,
        operation: "update",
        originalDoc: latest,
        req: { locale: "id" },
      }),
    ).toThrow(/reload/);
  });
});
