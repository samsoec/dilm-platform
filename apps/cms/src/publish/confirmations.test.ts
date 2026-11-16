import { describe, expect, it } from "vitest";

import {
  childrenRefusal,
  fieldProblems,
  placementsIn,
  publishButtonLabel,
  templateChangeText,
  unpublishLead,
  unpublishTitle,
  validationSummary,
  type Impact,
} from "./confirmations";
import { urlsFor } from "./impact";

const impact = (over: Partial<Impact> = {}): Impact => ({
  title: "X",
  collection: "pages",
  reach: { scope: "tenant", sites: 1, label: "duniakimia.com" },
  sites: [{ domain: "duniakimia.com", urls: [] }],
  links: [],
  linkCount: 0,
  placements: [],
  refusal: null,
  block: null,
  template: null,
  live: true,
  ...over,
});

describe("publish confirmation copy", () => {
  it("words the validation summary", () => {
    expect(validationSummary(3)).toBe(
      "Fix 3 things to publish. Your draft is saved.",
    );
    expect(validationSummary(1)).toBe(
      "Fix 1 thing to publish. Your draft is saved.",
    );
  });

  it("lists only invalid fields", () => {
    expect(
      fieldProblems({ a: { valid: true }, b: { valid: false } }, { b: "Slug" }),
    ).toEqual([{ path: "b", label: "Slug", message: "Fix this field." }]);
  });

  it("names the button for shared items", () => {
    const shared = impact({
      reach: { scope: "all", sites: 3, label: "All 3 sites" },
    });
    expect(publishButtonLabel(shared)).toBe("Publish to 3 sites");
    expect(publishButtonLabel(impact())).toBe("Publish now");
  });

  it("states the template change", () => {
    expect(
      templateChangeText({
        type: "Product",
        count: 12,
        sites: ["a.com", "b.com", "c.com"],
      }),
    ).toBe("Changes 12 product pages on a.com, b.com and c.com.");
  });

  it("words the unpublish lead and the post title", () => {
    expect(unpublishLead(impact({ linkCount: 2 }))).toBe(
      "It goes back to draft and leaves duniakimia.com. 2 links will show as plain text:",
    );
    expect(
      unpublishTitle(
        "Renovating Al-Falah Kindergarten",
        impact({ collection: "posts" }),
      ),
    ).toBe(
      'Unpublish "Renovating Al-Falah Kindergarten"? It leaves duniakimia.com and disappears from:',
    );
  });

  it("words the children refusal", () => {
    expect(
      childrenRefusal("About Us", [
        { title: "a" },
        { title: "b" },
        { title: "c" },
        { title: "d" },
      ]),
    ).toBe(
      '"About Us" has 4 child pages. Move or trash them first, then trash About Us.',
    );
  });
});

describe("placementsIn", () => {
  it("finds highlights and hand-picked cards", () => {
    const layout = [
      { blockType: "hero", highlights: { items: [4, { id: 7 }] } },
      { blockType: "postListing", featured: { id: 7 } },
      {
        blockType: "cards",
        items: [{ doc: { relationTo: "posts", value: 9 } }],
      },
    ];
    expect([...placementsIn(layout, "7")].sort()).toEqual([
      "card",
      "highlights",
    ]);
    expect([...placementsIn(layout, "9")]).toEqual(["card"]);
    expect([...placementsIn(layout, "1")]).toEqual([]);
  });
});

describe("urlsFor", () => {
  it("builds a url per locale and drops the trailing slash at the root", () => {
    expect(urlsFor("a.com", { en: "/about" })).toContainEqual({
      locale: "en",
      url: "a.com/en/about",
    });
    expect(urlsFor("a.com", { en: "/" })[0]!.url).toBe("a.com/en");
  });
});
