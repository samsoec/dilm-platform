import { describe, expect, it } from "vitest";

import {
  closeTitle,
  comboOptions,
  createLabel,
  departmentsOf,
  dayText,
  jobsHref,
  listingOf,
  jobsWhere,
  noCareerPageReason,
  parseJobsQuery,
  tabCounts,
  tabOf,
} from "./jobs";

const NOW = new Date("2026-11-01T00:00:00Z");

describe("job listing state", () => {
  it("keeps drafts out of the listing", () => {
    expect(listingOf({ status: "draft", listingStatus: "open" }, NOW)).toBe(
      "notListed",
    );
  });

  it("tells open, closed and closed automatically apart", () => {
    const published = { status: "published" as const };
    expect(listingOf({ ...published, listingStatus: "open" }, NOW)).toBe(
      "open",
    );
    expect(listingOf({ ...published, listingStatus: "closed" }, NOW)).toBe(
      "closed",
    );
    expect(
      listingOf(
        {
          ...published,
          listingStatus: "open",
          closingDate: "2026-10-31T00:00:00Z",
        },
        NOW,
      ),
    ).toBe("closedAutomatically");
  });

  it("files a published open job with a past closing date under Open", () => {
    expect(tabOf({ status: "published", listingStatus: "open" })).toBe("open");
    expect(tabOf({ status: "changed", listingStatus: "closed" })).toBe(
      "closed",
    );
    expect(tabOf({ status: "draft", listingStatus: "open" })).toBe("draft");
  });
});

describe("job list filters", () => {
  const rows = [
    { tab: "open" as const, department: "Sales" },
    { tab: "open" as const, department: "QHSE" },
    { tab: "closed" as const, department: "Sales" },
    { tab: "draft" as const, department: "" },
  ];

  it("counts per tab", () => {
    expect(tabCounts(rows)).toEqual({ all: 4, open: 2, closed: 1, draft: 1 });
  });

  it("puts search, department and open tab into the database query", () => {
    const query = parseJobsQuery({
      status: "open",
      department: "Sales",
      q: "eng",
    });
    expect(jobsWhere(query, { tenant: 3, published: [7, 8] })).toEqual({
      and: [
        { tenant: { equals: 3 } },
        { title: { like: "eng" } },
        { department: { equals: "Sales" } },
        { status: { equals: "open" } },
        { id: { in: [7, 8] } },
      ],
    });
  });

  it("asks for the closed tab by listing status and published ids", () => {
    expect(
      jobsWhere(parseJobsQuery({ status: "closed" }), {
        tenant: 3,
        published: [],
      }).and,
    ).toEqual([
      { tenant: { equals: 3 } },
      { status: { equals: "closed" } },
      { id: { exists: false } },
    ]);
  });

  it("asks for the draft tab as everything not published", () => {
    expect(
      jobsWhere(parseJobsQuery({ status: "draft" }), {
        tenant: 3,
        published: [7],
      }).and,
    ).toEqual([{ tenant: { equals: 3 } }, { id: { not_in: [7] } }]);
  });

  it("leaves the tab out when counting", () => {
    expect(
      jobsWhere(parseJobsQuery({ status: "open" }), {
        tenant: 3,
        published: [7],
        skipTab: true,
      }).and,
    ).toEqual([{ tenant: { equals: 3 } }]);
  });

  it("ignores unknown tabs and trims the search", () => {
    expect(parseJobsQuery({ status: "x", q: "  eng " })).toEqual({
      tab: undefined,
      department: "",
      search: "eng",
    });
  });

  it("round-trips a query through the address", () => {
    const query = parseJobsQuery({ status: "closed", q: "a b" });
    expect(jobsHref("/admin/collections/jobs", query)).toBe(
      "/admin/collections/jobs?status=closed&q=a+b",
    );
  });

  it("lists each department once", () => {
    expect(departmentsOf([...rows])).toEqual(["QHSE", "Sales"]);
  });
});

describe("combobox options", () => {
  const found = [
    { value: "Engineering", count: 3 },
    { value: "Sales", count: 1 },
  ];

  it("offers matching suggestions and a Create row for new text", () => {
    expect(comboOptions(found, "Eng")).toEqual([
      { kind: "suggestion", value: "Engineering", count: 3 },
      { kind: "create", value: "Eng" },
    ]);
    expect(createLabel("Eng")).toBe('Create "Eng"');
  });

  it("does not offer Create for an exact match, whatever its case", () => {
    expect(comboOptions(found, "sales")).toEqual([
      { kind: "suggestion", value: "Sales", count: 1 },
    ]);
  });

  it("lists every suggestion for empty text", () => {
    expect(comboOptions(found, "")).toHaveLength(2);
  });
});

describe("texts", () => {
  it("quotes the job in the close question", () => {
    expect(closeTitle("Process Engineer")).toBe('Close "Process Engineer"?');
  });

  it("names the company in the blocked publish reason", () => {
    expect(noCareerPageReason("Liku Telaga")).toBe(
      "No Career page is set for Liku Telaga. Company settings › Careers.",
    );
  });

  it("formats days in Jakarta time and dashes the empty ones", () => {
    expect(dayText("2026-10-28T12:00:00Z")).toBe("28 Oct 2026");
    expect(dayText(null)).toBe("—");
  });
});
