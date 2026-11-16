// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import {
  BUTTON_STYLE_OPTIONS,
  buttonStyleLabel,
  buttonSummary,
  limitReason,
  removedFromHtml,
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

  it("reports what pasted HTML would carry into the title (SE-08)", () => {
    const html =
      '<meta charset="utf-8"><p>Our <b>story</b>, <a href="https://x.com">read</a></p>';
    expect(titleNotice(removedFromHtml(html))).toBe(
      "Pasted bold and a link were removed from the title.",
    );
    expect(
      removedFromHtml('<span style="font-weight:700">x</span><h2>y</h2>'),
    ).toEqual(["bold", "a heading"]);
    expect(removedFromHtml("<i>only italic</i>")).toEqual([]);
    expect(titleNotice([])).toBe("");
  });
});
