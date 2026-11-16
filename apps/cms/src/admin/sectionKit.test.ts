import { describe, expect, it } from "vitest";

import {
  BUTTON_STYLE_OPTIONS,
  buttonStyleLabel,
  buttonSummary,
  limitReason,
  removedFromTitle,
  sectionArrayLabel,
  titleNotice,
} from "./sectionKit";

describe("section field kit", () => {
  it("describes the three button styles (SE-06)", () => {
    expect(
      BUTTON_STYLE_OPTIONS.map((o) => `${o.label} · ${o.description}`),
    ).toEqual([
      "Primary · Filled navy button",
      "Light · White, for dark or photo backgrounds",
      "Text link · Underlined text with an arrow",
    ]);
    expect(buttonStyleLabel("text")).toBe("Text link");
    expect(buttonStyleLabel(undefined)).toBe("Primary");
  });

  it("summarises a button link", () => {
    expect(
      buttonSummary({
        type: "external",
        externalUrl: "https://a.com/x",
        label: "Go",
      }),
    ).toBe("Go → a.com/x");
    expect(buttonSummary({ label: "Go" })).toBe("Go");
    expect(buttonSummary(null)).toBe("");
  });

  it("labels arrays with N of M and explains the limit", () => {
    expect(sectionArrayLabel("Buttons", 1, 2)).toBe("Buttons · 1 of 2");
    expect(limitReason(1, 2)).toBeUndefined();
    expect(limitReason(2, 2, "button")).toBe(
      "Limit reached: 2 of 2 buttons. Remove one to add another.",
    );
  });

  it("reports what pasting removed from the title (SE-08)", () => {
    const root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", format: 1 },
            { type: "link", children: [{ type: "text", format: 0 }] },
          ],
        },
      ],
    };
    expect(titleNotice(removedFromTitle(root))).toBe(
      "Pasted bold and a link were removed from the title.",
    );
    expect(titleNotice(removedFromTitle(undefined))).toBe("");
  });
});
