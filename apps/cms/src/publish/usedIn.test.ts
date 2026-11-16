import { describe, expect, it } from "vitest";

import {
  USED_IN_EMPTY,
  hiddenText,
  replaceAllText,
  sectionLabel,
  usedInTitle,
  variantLabel,
} from "../admin/components/kit/usedIn";
import {
  SKIP_NOTE,
  handPickedLead,
  handPickedTitle,
  isHandPicked,
  linkPlace,
  unpublishTitle,
  type Impact,
} from "./confirmations";
import { sectionsReferencing } from "./usedInSections";

const impact = (over: Partial<Impact>): Impact =>
  ({
    title: "Aluminium Sulfate",
    collection: "products",
    reach: { scope: "all", sites: 3, label: "All 3 sites" },
    sites: [],
    links: [],
    linkCount: 3,
    placements: [],
    refusal: null,
    block: null,
    template: null,
    live: true,
    ...over,
  }) as Impact;

describe("Used in copy", () => {
  it("titles the panel and the document variant list", () => {
    expect(usedInTitle(3, "places")).toBe("Used in · 3");
    expect(usedInTitle(8, "variants")).toBe("Used in · 8 variants");
    expect(replaceAllText(8)).toBe("Replace PDF · updates all 8");
    expect(USED_IN_EMPTY).toBe("Not used anywhere yet");
    expect(hiddenText(2)).toContain("2 more");
    expect(variantLabel("Aluminium Sulfate", "DILMasul101")).toBe(
      "Aluminium Sulfate › DILMasul101",
    );
    expect(sectionLabel("Home", ["Products & solutions tabs"])).toBe(
      "Home › Products & solutions tabs",
    );
    expect(sectionLabel("Home", [])).toBe("Home");
  });

  it("words the hand-picked unpublish warning (PR-07)", () => {
    const hand = impact({});
    expect(isHandPicked(hand)).toBe(true);
    expect(unpublishTitle("Aluminium Sulfate", hand)).toBe(
      'Unpublish "Aluminium Sulfate" from all 3 sites?',
    );
    expect(handPickedTitle("X", hand)).toContain("all 3 sites");
    expect(handPickedLead(hand)).toBe("It's hand-picked in 3 places.");
    expect(SKIP_NOTE).toBe(
      "Those sections will skip it; no empty cards appear.",
    );
    expect(isHandPicked(impact({ linkCount: 0 }))).toBe(false);
    expect(isHandPicked(impact({ collection: "pages" }))).toBe(false);
  });

  it("names the place of a link", () => {
    expect(
      linkPlace({
        collection: "pages",
        id: "1",
        title: "Home",
        sections: ["Solutions and products tabs"],
        paths: {},
      }),
    ).toBe("Home › Solutions and products tabs");
  });
});

describe("sectionsReferencing", () => {
  it("finds the sections that pick an item", () => {
    const layout = [
      {
        blockType: "productsSolutionsTabs",
        productsTab: { items: [{ relationTo: "products", value: 7 }] },
      },
      { blockType: "richText" },
    ];
    expect(sectionsReferencing(layout, "products:7")).toEqual([
      "Solutions and products tabs",
    ]);
    expect(sectionsReferencing(layout, "products:8")).toEqual([]);
    expect(sectionsReferencing(null, "products:7")).toEqual([]);
  });
});
