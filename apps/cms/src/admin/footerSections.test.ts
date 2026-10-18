import { describe, expect, it } from "vitest";

import {
  footerSectionCounts,
  isPlainOrItalic,
  plainOrItalic,
  sectionOfPath,
} from "./footerSections";

describe("footer section jump (F-01, FR-UI-88)", () => {
  it("maps fields to their numbered section", () => {
    expect(sectionOfPath("linkColumns.2.links.0.link.label")).toBe(
      "link-columns",
    );
    expect(sectionOfPath("ctaBand.heading")).toBe("contact-band");
    expect(sectionOfPath("updatedBy")).toBeUndefined();
  });

  it("counts errors after a save attempt and untranslated labels in ID", () => {
    const counts = footerSectionCounts(
      {
        "linkColumns.3.title": { value: "", valid: false },
        "linkColumns.0.title": { value: "Company" },
        copyright: { value: "Copyright © {year}" },
        "partOf.label": { value: "Bagian dari" },
      },
      {
        submitted: true,
        englishDoc: {
          linkColumns: [{ title: "Company" }],
          copyright: "Copyright © {year}",
          partOf: { label: "Part of" },
        },
      },
    );
    expect(counts["link-columns"]).toEqual({ errors: 1, untranslated: 1 });
    expect(counts.copyright).toEqual({ errors: 0, untranslated: 1 });
    expect(counts["part-of"]).toEqual({ errors: 0, untranslated: 0 });
  });
});

describe("footer heading (F-02)", () => {
  const pasted = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Let's Grow ", format: 1 },
          {
            type: "link",
            children: [{ type: "text", text: "Together", format: 3 }],
          },
        ],
      },
      {
        type: "list",
        children: [
          { type: "listitem", children: [{ type: "text", text: "One" }] },
        ],
      },
    ],
  };

  it("turns pasted bold, links and lists into plain or italic text", () => {
    expect(isPlainOrItalic(pasted)).toBe(false);
    const clean = plainOrItalic(pasted);
    expect(isPlainOrItalic(clean)).toBe(true);
    expect(clean.children?.[0]?.children).toEqual([
      { type: "text", text: "Let's Grow ", format: 0 },
      { type: "text", text: "Together", format: 2 },
    ]);
    expect(clean.children?.[1]?.children?.[0]).toMatchObject({ text: "One" });
  });
});
