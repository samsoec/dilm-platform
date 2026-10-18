import { describe, expect, it } from "vitest";

import { errorEntries } from "./validationErrors";

describe("validation summary (H-02, FR-UI-87)", () => {
  it("names each invalid field by its row and field, like the design", () => {
    const entries = errorEntries(
      {
        "navItems.2.link.internalPath": { valid: false },
        "navItems.2.link.label": { valid: true },
        "cta.link.externalUrl": { valid: false },
        navItems: { valid: false, rows: [] },
        "navItems.3.children": {
          valid: false,
          rows: [],
          errorMessage: "This field requires at least 1 Dropdown link.",
        },
      },
      (path) => (path === "navItems.2" ? "03 Investor" : path),
    );
    expect(entries).toEqual([
      { path: "navItems.2.link.internalPath", text: "03 Investor · Page path" },
      { path: "cta.link.externalUrl", text: "Call-to-action · Web address" },
      {
        path: "navItems.3.children",
        text: "navItems.3 · Dropdown links",
      },
    ]);
  });
});
