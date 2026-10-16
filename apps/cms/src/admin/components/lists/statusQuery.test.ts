import { describe, expect, it } from "vitest";

import { activeStatus, STATUS_PARAM, statusTabHref } from "./statusQuery";

const LIST = "/admin/collections/cv-submissions";

describe("status tabs in the URL (FR-UI-38)", () => {
  it("treats a list without a status filter as All", () => {
    expect(activeStatus({})).toBeUndefined();
    expect(activeStatus({ search: "rani" })).toBeUndefined();
  });

  it("reads the active tab from where[status][equals]", () => {
    expect(activeStatus({ [STATUS_PARAM]: "received" })).toBe("received");
  });

  it("selects no tab for any other status filter", () => {
    expect(activeStatus({ "where[status][in]": "received" })).toBe("");
  });

  it("deep-links a tab and keeps search and other filters", () => {
    const href = statusTabHref(
      LIST,
      {
        search: "rani",
        page: "3",
        "where[position][equals]": "Chemist",
        [STATUS_PARAM]: "received",
      },
      "shortlisted",
    );
    const url = new URL(href, "http://cms.test");
    expect(url.pathname).toBe(LIST);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      search: "rani",
      "where[position][equals]": "Chemist",
      [STATUS_PARAM]: "shortlisted",
    });
  });

  it("drops only the status filter for All", () => {
    expect(
      statusTabHref(
        LIST,
        { [STATUS_PARAM]: "received", limit: "50" },
        undefined,
      ),
    ).toBe(`${LIST}?limit=50`);
    expect(statusTabHref(LIST, { [STATUS_PARAM]: "received" }, undefined)).toBe(
      LIST,
    );
  });
});
