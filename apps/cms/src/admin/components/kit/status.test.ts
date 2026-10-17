import { describe, expect, it } from "vitest";

import { CV_STATUSES } from "../../../collections/CvSubmissions";
import { ICON_NAMES } from "../../icons";
import { STATUS_SETS, statusChip } from "./status";

describe("status chips (K-02, FR-UI-65)", () => {
  it("covers every career application status", () => {
    expect(Object.keys(STATUS_SETS.application)).toEqual([...CV_STATUSES]);
  });

  it.each(Object.entries(STATUS_SETS))(
    "gives every %s status its own icon and a text label",
    (_, chips) => {
      const icons = Object.values(chips).map(({ icon }) => icon);
      expect(new Set(icons).size).toBe(icons.length);
      for (const chip of Object.values(chips)) {
        expect(ICON_NAMES).toContain(chip.icon);
        expect(chip.label).toMatch(/^[A-Z]/);
      }
    },
  );

  it("uses the K-02 labels", () => {
    expect(
      Object.values(STATUS_SETS).flatMap((chips) =>
        Object.values(chips).map(({ label }) => label),
      ),
    ).toEqual([
      "Received",
      "Reviewed",
      "Shortlisted",
      "Rejected",
      "Draft",
      "Published",
      "Trashed",
      "Synced",
      "Pending",
      "Failed",
      "Active",
      "Invited",
      "Locked",
    ]);
  });

  it("adds the try count to a failed sync and the minutes to a lock", () => {
    expect(statusChip("sync", "failed", 3)?.label).toBe("Failed · 3 tries");
    expect(statusChip("sync", "failed", 1)?.label).toBe("Failed · 1 try");
    expect(statusChip("sync", "pending", 2)?.label).toBe("Pending");
    expect(statusChip("user", "locked", 7)?.label).toBe("Locked · 7 min");
    expect(statusChip("user", "active", 7)?.label).toBe("Active");
  });

  it("shows sync states without a pill, as K-02 does", () => {
    expect(statusChip("sync", "synced")?.plain).toBe(true);
    expect(statusChip("application", "received")?.plain).toBeUndefined();
  });

  it("ignores unknown statuses", () => {
    expect(statusChip("application", "archived")).toBeUndefined();
    expect(statusChip("document", null)).toBeUndefined();
  });
});
