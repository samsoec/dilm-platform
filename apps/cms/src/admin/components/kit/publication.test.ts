import { describe, expect, it } from "vitest";

import { isListed } from "../../../jobs";
import { ICON_NAMES } from "../../icons";
import {
  getJobListing,
  getPublishStatus,
  PUBLISH_STATUSES,
} from "./publication";
import { STATUS_SETS, statusChip } from "./status";

describe("getPublishStatus (US-PUB-1.2)", () => {
  it("reads draft and published straight from _status", () => {
    expect(getPublishStatus({ _status: "draft" })).toBe("draft");
    expect(getPublishStatus({ _status: "published" })).toBe("published");
  });

  it("treats a document with no status as a draft", () => {
    expect(getPublishStatus({})).toBe("draft");
    expect(getPublishStatus(null)).toBe("draft");
  });

  it("resolves the list-only changed status", () => {
    expect(getPublishStatus({ _status: "changed" })).toBe("changed");
    expect(
      getPublishStatus({ _status: "changed" }, { hasPublishedVersion: true }),
    ).toBe("changed");
    expect(
      getPublishStatus({ _status: "changed" }, { hasPublishedVersion: false }),
    ).toBe("draft");
  });

  it("calls an edited draft of a live document changed since publish", () => {
    expect(
      getPublishStatus({ _status: "draft" }, { hasPublishedVersion: true }),
    ).toBe("changed");
    expect(
      getPublishStatus({ _status: "draft" }, { hasPublishedVersion: false }),
    ).toBe("draft");
    expect(
      getPublishStatus({ _status: "published" }, { hasPublishedVersion: true }),
    ).toBe("published");
  });

  it("lets Trashed win over every other state", () => {
    const deletedAt = "2026-11-01T00:00:00.000Z";

    for (const _status of ["draft", "published", "changed"]) {
      expect(getPublishStatus({ _status, deletedAt })).toBe("trashed");
    }
    expect(getPublishStatus({ _status: "draft", deletedAt: null })).toBe(
      "draft",
    );
  });

  it("has a badge with an icon and words for every status", () => {
    for (const status of PUBLISH_STATUSES) {
      const chip = statusChip("document", status);

      expect(chip?.label).toMatch(/\w/);
      expect(ICON_NAMES).toContain(chip?.icon);
    }
    expect(statusChip("document", "trashed")).toMatchObject({
      icon: "delete",
      tone: "danger",
    });
    expect(statusChip("document", "changed")).toMatchObject({
      label: "Changed since publish",
      tone: "warn",
    });
  });
});

describe("getJobListing (US-JOB-1.2)", () => {
  const now = new Date("2026-11-04T10:00:00.000Z");

  it("is open with no closing date or a future one", () => {
    expect(getJobListing({ status: "open" }, now)).toBe("open");
    expect(
      getJobListing(
        { status: "open", closingDate: "2026-11-04T10:00:01Z" },
        now,
      ),
    ).toBe("open");
  });

  it("is closed when an editor closed it, whatever the date", () => {
    expect(getJobListing({ status: "closed" }, now)).toBe("closed");
    expect(
      getJobListing(
        { status: "closed", closingDate: "2026-01-01T00:00:00Z" },
        now,
      ),
    ).toBe("closed");
  });

  it("is closed automatically once the closing instant has passed", () => {
    expect(
      getJobListing(
        { status: "open", closingDate: "2026-11-04T10:00:00Z" },
        now,
      ),
    ).toBe("closedAutomatically");
    expect(
      getJobListing(
        { status: "open", closingDate: new Date("2026-11-03") },
        now,
      ),
    ).toBe("closedAutomatically");
  });

  it("compares instants, so a closing time set in WIT closes before the same clock time in WIB", () => {
    const afternoon = new Date("2026-11-04T08:00:00.000Z");
    const closesAt3pmWit = "2026-11-04T06:00:00.000Z";
    const closesAt3pmWib = "2026-11-04T08:00:00.000Z";
    const later = new Date("2026-11-04T07:00:00.000Z");

    expect(
      getJobListing({ status: "open", closingDate: closesAt3pmWit }, later),
    ).toBe("closedAutomatically");
    expect(
      getJobListing({ status: "open", closingDate: closesAt3pmWib }, later),
    ).toBe("open");
    expect(
      getJobListing({ status: "open", closingDate: closesAt3pmWib }, afternoon),
    ).toBe("closedAutomatically");
  });

  it("agrees with isListed for published jobs", () => {
    const jobs = [
      { status: "open" },
      { status: "closed" },
      { status: "open", closingDate: "2026-12-01T00:00:00Z" },
      { status: "open", closingDate: "2026-10-01T00:00:00Z" },
    ];

    for (const job of jobs) {
      expect(getJobListing(job, now) === "open").toBe(
        isListed({ ...job, _status: "published" }, now),
      );
    }
  });

  it("has a badge with an icon and words for every state", () => {
    expect(Object.keys(STATUS_SETS.job)).toEqual([
      "open",
      "closed",
      "closedAutomatically",
    ]);
    for (const chip of Object.values(STATUS_SETS.job)) {
      expect(ICON_NAMES).toContain(chip.icon);
    }
  });
});
