import { describe, expect, it } from "vitest";

import {
  clearFilters,
  countValues,
  filterChips,
  flatWhere,
  rangeText,
  selectedValues,
  toggleValue,
} from "./cvFilters";

describe("career application filters (C-01, C-02, FR-UI-86)", () => {
  const where = {
    status: { equals: "received" },
    position: { in: ["Process Engineer"] },
    externalSyncStatus: { in: ["failed"] },
  };

  it("reads the selected values from Payload's where", () => {
    expect(selectedValues(where, "position")).toEqual(["Process Engineer"]);
    expect(
      selectedValues({ position: { equals: "Lab Analyst" } }, "position"),
    ).toEqual(["Lab Analyst"]);
    expect(selectedValues({}, "externalSyncStatus")).toEqual([]);
  });

  it("toggles a value on and off, dropping the condition when empty", () => {
    const added = toggleValue(where, "position", "Lab Analyst");
    expect(added.position).toEqual({ in: ["Process Engineer", "Lab Analyst"] });
    const removed = toggleValue(where, "externalSyncStatus", "failed");
    expect(removed).not.toHaveProperty("externalSyncStatus");
    expect(removed.status).toEqual({ equals: "received" });
  });

  it("turns active filters into chips and clears them, keeping the tab", () => {
    expect(filterChips(where).map(({ label }) => label)).toEqual([
      "Position: Process Engineer",
      "Sync: Failed",
    ]);
    expect(clearFilters(where)).toEqual({ status: { equals: "received" } });
  });

  it("counts positions and sync states for the menus", () => {
    expect(
      countValues(
        [
          { position: "Lab Analyst" },
          { position: "Process Engineer" },
          { position: "Lab Analyst" },
          { position: "" },
        ],
        "position",
      ),
    ).toEqual([
      { value: "Lab Analyst", count: 2 },
      { value: "Process Engineer", count: 1 },
    ]);
  });

  it("reads the nested where Payload writes when a view is applied", () => {
    expect(
      flatWhere({
        or: [
          {
            and: [
              { position: { in: ["Lab Analyst"] } },
              { externalSyncStatus: { in: ["failed"] } },
            ],
          },
        ],
      }),
    ).toEqual({
      position: { in: ["Lab Analyst"] },
      externalSyncStatus: { in: ["failed"] },
    });
    expect(flatWhere({ status: { equals: "received" } })).toEqual({
      status: { equals: "received" },
    });
  });

  it("writes the page range like C-07", () => {
    expect(rangeText(3, 20, 128)).toBe("41–60 of 128");
    expect(rangeText(7, 20, 128)).toBe("121–128 of 128");
    expect(rangeText(1, 20, 0)).toBe("0 of 0");
  });
});
