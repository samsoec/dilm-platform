import { describe, expect, it } from "vitest";

import { compareLines, summarize } from "./versionSummary";

const header = (labels: string[], cta: string) => ({
  navItems: labels.map((label) => ({
    type: "dropdown",
    label,
    children: [],
  })),
  showSearch: false,
  showLanguageSwitcher: true,
  cta: { enabled: true, link: { type: "internal", label: cta } },
});

describe("version compare (H-09, FR-UI-77)", () => {
  it("marks moved rows as removed and added, and the CTA as edited", () => {
    const rows = compareLines(
      summarize(
        "header",
        header(["Product & Solutions", "Investor", "About Us"], "Contact"),
      ),
      summarize(
        "header",
        header(["Product & Solutions", "About Us", "Investor"], "Contact Us"),
      ),
    );

    expect(rows[0]).toEqual({
      left: { text: "01 Product & Solutions", kind: "same" },
      right: { text: "01 Product & Solutions", kind: "same" },
    });
    expect(rows[1]).toEqual({
      left: { text: "02 Investor", kind: "removed" },
      right: { text: "02 About Us", kind: "added" },
    });
    expect(rows.at(-1)).toEqual({
      left: { text: 'CTA · "Contact"', kind: "edited" },
      right: { text: 'CTA · "Contact Us"', kind: "edited" },
    });
  });

  it("summarizes footer columns and company settings", () => {
    expect(
      summarize("footer", {
        linkColumns: [{ title: "Company", links: [{}, {}] }],
        partOf: { enabled: false },
        copyright: "© {year} {legalName}",
      }).map(({ text }) => text),
    ).toEqual([
      "Heading · —",
      "01 Company · 2 links",
      "Part of · Off",
      'Copyright · "© {year} {legalName}"',
    ]);
    expect(
      summarize("tenant-settings", {
        siteName: "DKU Website",
        socialLinks: [{ platform: "linkedin" }],
      }).map(({ text }) => text),
    ).toContain('Site name · "DKU Website"');
  });

  it("lists rows that only one side has", () => {
    const rows = compareLines(
      [{ key: "a", text: "a" }],
      [
        { key: "a", text: "a" },
        { key: "b", text: "b" },
      ],
    );
    expect(rows[1]).toEqual({
      left: undefined,
      right: { text: "b", kind: "added" },
    });
  });
});
