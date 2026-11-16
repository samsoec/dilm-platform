import { describe, expect, it } from "vitest";

import { formulaPlainText, SUBSCRIPT } from "./formula";

const text = (value: string, format = 0) => ({
  type: "text",
  text: value,
  format,
});

describe("formulaPlainText", () => {
  it("joins text nodes and ignores subscript formatting", () => {
    const value = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              text("H"),
              text("2", SUBSCRIPT),
              text("SO"),
              text("4", SUBSCRIPT),
            ],
          },
        ],
      },
    };
    expect(formulaPlainText(value)).toBe("H2SO4");
  });

  it("is empty for a missing or empty formula", () => {
    expect(formulaPlainText(undefined)).toBe("");
    expect(formulaPlainText(null)).toBe("");
    expect(formulaPlainText({ root: { type: "root", children: [] } })).toBe("");
  });
});
