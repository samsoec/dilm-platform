import { describe, expect, it } from "vitest";

import { formulaPlainText } from "../../../fields/formula";
import {
  documentUses,
  inheritedFrom,
  parseSpecs,
  previewSpecs,
  productPublishLead,
  sameOnSitesText,
  variantSummary,
  variantsCountText,
} from "./productEditor";

const formula = (text: string) => ({
  root: {
    type: "root",
    children: [
      { type: "paragraph", children: [{ type: "text", text, format: 0 }] },
    ],
  },
});

describe("variants", () => {
  it("counts rows and says what the cards show", () => {
    expect(variantsCountText(3)).toBe('3 of 20 · cards show "3 Variants"');
    expect(variantsCountText(1)).toBe('1 of 20 · cards show "1 Variant"');
  });

  it("summarises a collapsed row, falling back to the product formula", () => {
    expect(
      variantSummary(
        { specs: [{}, {}], pdsFile: 4, sdsFile: 5 },
        formula("NaOH"),
      ),
    ).toEqual(["NaOH", "2 spec rows", "PDS, SDS"]);
    expect(
      variantSummary({ formula: formula("KOH"), specs: [{}] }, formula("NaOH")),
    ).toEqual(["KOH", "1 spec row", "No data sheets"]);
  });

  it("marks empty overrides as inherited", () => {
    expect(inheritedFrom("", "7664-93-9")).toEqual({
      empty: true,
      text: "7664-93-9",
    });
    expect(inheritedFrom(formula(""), formula("H2")).empty).toBe(true);
    expect(inheritedFrom("x", "y").empty).toBe(false);
  });

  it("counts the variants that use a document", () => {
    const rows = [{ pdsFile: 3 }, { pdsFile: { id: 3 } }, { pdsFile: 4 }, {}];
    expect(documentUses(rows, "pdsFile", 3)).toBe(2);
    expect(documentUses(rows, "pdsFile", undefined)).toBe(0);
  });
});

describe("pasting specifications", () => {
  it("reads tab-separated rows, skips a header and flags missing cells", () => {
    const rows = parseSpecs(
      "Parameter\tMethod\tGuaranteed value\r\nPurity\tASTM\t99%\nColour\t\t\n\n",
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]!.missing).toEqual([]);
    expect(rows[1]).toMatchObject({
      parameter: "Colour",
      missing: ["method", "value"],
    });
  });

  it("previews how many rows land and how many fit", () => {
    const rows = parseSpecs("a\tb\tc\nd\te\tf\ng\th\ti");
    expect(previewSpecs(4, rows).text).toBe(
      "3 rows added after row 4 · 7 of 30 after applying",
    );
    const over = previewSpecs(29, rows);
    expect(over.accepted).toHaveLength(1);
    expect(over.dropped).toBe(2);
    expect(previewSpecs(0, rows).text).toBe(
      "3 rows added · 3 of 30 after applying",
    );
  });
});

describe("wording", () => {
  it("keeps the verbatim publish lead and the sites line", () => {
    expect(productPublishLead(3)).toBe("Goes live on all 3 sites");
    expect(sameOnSitesText(["a.com", "b.com", "c.com"])).toBe(
      "same path on a.com, b.com and c.com",
    );
    expect(formulaPlainText(formula("H2O"))).toBe("H2O");
  });
});
