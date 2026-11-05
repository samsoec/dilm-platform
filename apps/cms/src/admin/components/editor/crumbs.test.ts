import { describe, expect, it } from "vitest";

import { withAncestorCrumbs } from "./crumbs";

const nav = () => [
  { label: "Dunia Kimia Utama" },
  { label: "Pages", url: "/admin/collections/pages" },
  { label: "Overview" },
];
const about = { label: "About Us", url: "/admin/collections/pages/14" };

describe("withAncestorCrumbs", () => {
  it("puts the parents between Pages and the open page", () => {
    const next = withAncestorCrumbs(nav(), [about]);
    expect(next.map(({ label }) => label)).toEqual([
      "Dunia Kimia Utama",
      "Pages",
      "About Us",
      "Overview",
    ]);
    expect(next[2].url).toBe(about.url);
  });

  it("returns the same array when nothing changed", () => {
    const once = withAncestorCrumbs(nav(), [about]);
    expect(withAncestorCrumbs(once, [about])).toBe(once);
  });

  it("replaces parents when the page moves and drops them when top-level", () => {
    const once = withAncestorCrumbs(nav(), [about]);
    const moved = withAncestorCrumbs(once, [
      { label: "Company", url: "/admin/collections/pages/9" },
    ]);
    expect(moved.map(({ label }) => label)).toContain("Company");
    expect(moved.map(({ label }) => label)).not.toContain("About Us");
    const top = withAncestorCrumbs(moved, []);
    expect(top.map(({ label }) => label)).toEqual([
      "Dunia Kimia Utama",
      "Pages",
      "Overview",
    ]);
  });

  it("leaves an empty trail alone", () => {
    const empty: { label: string }[] = [];
    expect(withAncestorCrumbs(empty, [about])).toBe(empty);
  });
});
