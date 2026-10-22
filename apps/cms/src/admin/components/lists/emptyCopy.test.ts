import { describe, expect, it } from "vitest";

import { emptyCopy, hasActiveQuery, noMatchesTitle } from "./emptyCopy";

describe("hasActiveQuery", () => {
  it("ignores paging and sorting params", () => {
    expect(hasActiveQuery({ limit: "20", page: "1", sort: "-timestamp" })).toBe(
      false,
    );
    expect(hasActiveQuery(undefined)).toBe(false);
  });

  it("ignores a blank search but counts a real one", () => {
    expect(hasActiveQuery({ search: "  " })).toBe(false);
    expect(hasActiveQuery({ search: "annual" })).toBe(true);
  });

  it("counts any where filter", () => {
    expect(hasActiveQuery({ "where[status][equals]": "new" })).toBe(true);
  });
});

describe("emptyCopy", () => {
  it("names the company domain on career applications", () => {
    expect(
      emptyCopy("cv-submissions", { domain: "duniakimia.com" }).lines,
    ).toEqual([
      "They arrive here automatically when someone applies on the careers page of duniakimia.com.",
    ]);
  });

  it("names the company on media", () => {
    expect(emptyCopy("media", { company: "Dunia Kimia Utama" }).title).toBe(
      "No images for Dunia Kimia Utama yet",
    );
  });

  it("builds the no-matches titles", () => {
    expect(noMatchesTitle("cv-submissions")).toBe(
      "No applications match these filters",
    );
    expect(noMatchesTitle("media")).toBe("No images match these filters");
  });
});
