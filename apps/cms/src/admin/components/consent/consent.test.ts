import { describe, expect, it } from "vitest";

import {
  matchingPreset,
  presetRange,
  rangeFromWhere,
  rangeText,
  recordCount,
  timestampText,
  withRange,
} from "./consent";

describe("timestampText", () => {
  it("shows the moment in WIB", () => {
    expect(timestampText("2026-10-17T02:41:00.000Z")).toBe(
      "17 Oct 2026, 09:41",
    );
  });

  it("abbreviates September to three letters", () => {
    expect(timestampText("2026-09-01T01:00:00.000Z")).toBe("1 Sep 2026, 08:00");
  });

  it("is empty for a missing value", () => {
    expect(timestampText(undefined)).toBe("");
  });
});

describe("date range filter", () => {
  it("round-trips WIB calendar days through the where clause", () => {
    const where = withRange(
      { consentType: { equals: "contact-form" } },
      { from: "2026-09-01", to: "2026-10-17" },
    );

    expect(where).toEqual({
      consentType: { equals: "contact-form" },
      timestamp: {
        greater_than_equal: "2026-09-01T00:00:00.000+07:00",
        less_than_equal: "2026-10-17T23:59:59.999+07:00",
      },
    });
    expect(rangeFromWhere(where)).toEqual({
      from: "2026-09-01",
      to: "2026-10-17",
    });
  });

  it("drops the condition when both ends are empty", () => {
    expect(
      withRange({ timestamp: { greater_than_equal: "x" } }, { from: "" }),
    ).toEqual({});
  });

  it("keeps a one-sided range", () => {
    expect(withRange({}, { to: "2026-10-17" })).toEqual({
      timestamp: { less_than_equal: "2026-10-17T23:59:59.999+07:00" },
    });
  });
});

describe("presets", () => {
  const now = new Date("2026-10-17T18:30:00.000Z");

  it("counts days in Jakarta, where it is already the 18th", () => {
    expect(presetRange("7d", now)).toEqual({
      from: "2026-10-12",
      to: "2026-10-18",
    });
    expect(presetRange("30d", now)).toEqual({
      from: "2026-09-19",
      to: "2026-10-18",
    });
    expect(presetRange("year", now)).toEqual({
      from: "2026-01-01",
      to: "2026-10-18",
    });
  });

  it("recognises a range that matches a preset", () => {
    expect(matchingPreset(presetRange("30d", now), now)).toBe("30d");
    expect(matchingPreset({ from: "2026-09-01" }, now)).toBeUndefined();
  });
});

describe("rangeText", () => {
  it("names the year once when both ends share it", () => {
    expect(rangeText({ from: "2026-09-01", to: "2026-10-17" })).toBe(
      "1 Sep – 17 Oct 2026",
    );
    expect(rangeText({ from: "2025-12-20", to: "2026-01-05" })).toBe(
      "20 Dec 2025 – 5 Jan 2026",
    );
  });

  it("labels open-ended ranges", () => {
    expect(rangeText({ from: "2026-09-01" })).toBe("From 1 Sep 2026");
    expect(rangeText({ to: "2026-10-17" })).toBe("Until 17 Oct 2026");
  });
});

it("pluralises the record count", () => {
  expect(recordCount(1)).toBe("1 record");
  expect(recordCount(128)).toBe("128 records");
});
