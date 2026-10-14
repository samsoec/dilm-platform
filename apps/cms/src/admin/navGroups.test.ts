import { describe, expect, it } from "vitest";

import { ICON_NAMES } from "./icons";
import { NAV_GROUPS, navGroup, navGroupByLabel } from "./navGroups";

describe("NAV_GROUPS", () => {
  it("lists the sidebar groups in TRD-UI §4.1 order", () => {
    expect(NAV_GROUPS.map(({ key }) => key)).toEqual([
      "content",
      "layout",
      "inbox",
      "investor",
      "media",
      "settings",
      "admin",
    ]);
  });

  it("has unique keys and labels", () => {
    const keys = NAV_GROUPS.map(({ key }) => key);
    const labels = NAV_GROUPS.map(({ label }) => label);

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("only uses icons from the self-hosted subset", () => {
    for (const { icon } of NAV_GROUPS) {
      expect(ICON_NAMES).toContain(icon);
    }
  });

  it("marks only Administration as Super Admin only", () => {
    expect(
      NAV_GROUPS.filter((group) => "superAdminOnly" in group).map(
        ({ key }) => key,
      ),
    ).toEqual(["admin"]);
  });
});

describe("navGroup", () => {
  it("returns the label Payload groups the sidebar by", () => {
    expect(navGroup("inbox")).toBe("Inbox");
    expect(navGroupByLabel(navGroup("investor"))?.key).toBe("investor");
    expect(navGroupByLabel("Catalogue")).toBeUndefined();
  });
});
