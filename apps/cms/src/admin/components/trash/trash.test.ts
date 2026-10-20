import { describe, expect, it } from "vitest";

import { stampTrashedBy } from "../../../fields/authoring";
import { firstName, isTrashView, trashedText } from "./trash";

describe("stampTrashedBy (FR-UI-80)", () => {
  const run = (
    data: object,
    originalDoc: object,
    user: object | null = { id: 7 },
  ) =>
    stampTrashedBy({ data, originalDoc, req: { user, context: {} } } as never);

  it("records who moved something to the trash", () => {
    expect(run({ deletedAt: "2026-10-20T00:00:00.000Z" }, {})).toMatchObject({
      trashedBy: 7,
    });
  });

  it("clears it on restore and leaves ordinary saves alone", () => {
    expect(run({ deletedAt: null }, { deletedAt: "2026-10-01" })).toMatchObject(
      { trashedBy: null },
    );
    expect(run({ title: "x" }, {})).toEqual({ title: "x" });
    expect(
      run({ deletedAt: "2026-10-21" }, { deletedAt: "2026-10-01" }),
    ).toEqual({ deletedAt: "2026-10-21" });
  });
});

describe("trash helpers", () => {
  it("knows the trash route", () => {
    expect(isTrashView({ segments: ["collections", "media", "trash"] })).toBe(
      true,
    );
    expect(isTrashView({ segments: ["collections", "media"] })).toBe(false);
  });

  it("formats the trash date and the person", () => {
    expect(trashedText("2026-10-03T03:00:00.000Z")).toBe("3 Oct 2026");
    expect(firstName({ name: "Dimas Pratama" })).toBe("Dimas");
    expect(firstName(null)).toBe("—");
  });
});
