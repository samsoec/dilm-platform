import { describe, expect, it } from "vitest";

import {
  groupRows,
  isOtherCompany,
  searchQuery,
  shownUrl,
  targetState,
  toRow,
} from "./linkPicker";

const own = { id: 1, _status: "published", path: { en: "/about" } };
const other = {
  id: 2,
  _status: "published",
  path: "/about",
  tenant: { id: 9, name: "Duniakimia", domain: "duniakimia.com" },
};

describe("link picker model", () => {
  it("shows a path for this site and an absolute URL for another", () => {
    const where = { siteDomain: "likutelaga.com", locale: "en" };
    expect(shownUrl(own, where)).toBe("/about");
    expect(shownUrl(other, where)).toBe("https://duniakimia.com/about");
    expect(isOtherCompany(other, "likutelaga.com")).toBe(true);
    expect(isOtherCompany(other, "https://duniakimia.com")).toBe(false);
  });

  it("makes drafts visible but not selectable", () => {
    const row = toRow("pages", { id: 3, _status: "draft", title: "X" }, "en");
    expect(row.selectable).toBe(false);
    expect(row.status).toBe("draft");
    expect(toRow("categories", { id: 4, name: "C" }, "en").selectable).toBe(
      true,
    );
  });

  it("groups by type and filters", () => {
    const rows = [
      toRow("posts", { id: 1, _status: "published", title: "P" }, "en"),
      toRow("products", { id: 2, _status: "published", name: "Q" }, "en"),
    ];
    expect(groupRows(rows, "all").map((g) => g.label)).toEqual([
      "Products · all companies",
      "Posts · this site",
    ]);
    expect(groupRows(rows, "posts")).toHaveLength(1);
  });

  it("scopes tenant-owned searches and detects lost targets", () => {
    expect(searchQuery("posts", "a", "5")).toContain("where%5Btenant%5D");
    expect(searchQuery("products", "a", "5")).not.toContain("tenant");
    expect(targetState("pages", { id: 1, _status: "draft" }, true)).toBe(
      "lost",
    );
    expect(targetState("pages", undefined, false)).toBe("empty");
  });
});
