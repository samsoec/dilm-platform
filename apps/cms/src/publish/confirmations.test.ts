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
import { consentBlock, errorStatus, urlsFor, visibleReferrers } from "./impact";

const impact = (over: Partial<Impact> = {}): Impact => ({
  title: "X",
  collection: "pages",
  reach: { scope: "tenant", sites: 1, label: "duniakimiautama.com" },
  sites: [{ domain: "duniakimiautama.com", urls: [] }],
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
      "It goes back to draft and leaves duniakimiautama.com. 2 links will show as plain text:",
    );
    expect(
      unpublishTitle(
        "Renovating Al-Falah Kindergarten",
        impact({ collection: "posts" }),
      ),
    ).toBe(
      'Unpublish "Renovating Al-Falah Kindergarten"? It leaves duniakimiautama.com and disappears from:',
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

describe("visibleReferrers", () => {
  const link = (tenant: string | null) => ({
    collection: "pages" as const,
    id: "1",
    tenant,
    paths: {},
  });
  const editor = {
    roles: ["tenant-editor"],
    tenants: [{ tenant: 2 }],
  };

  it("hides other companies from a tenant editor on shared items", () => {
    expect(
      visibleReferrers([link("2"), link("3"), link(null)], editor),
    ).toEqual([link("2"), link(null)]);
  });

  it("shows every company to a super admin", () => {
    expect(
      visibleReferrers([link("2"), link("3")], { roles: ["super-admin"] }),
    ).toHaveLength(2);
  });

  it("keeps a company item to its own company", () => {
    expect(
      visibleReferrers([link("2"), link("3")], { roles: ["super-admin"] }, "2"),
    ).toEqual([link("2")]);
  });
});

describe("errorStatus", () => {
  it("reads a Payload error status", () => {
    expect(errorStatus({ status: 404 })).toBe(404);
    expect(errorStatus(new Error("x"))).toBeUndefined();
  });
});

describe("consentBlock", () => {
  const text = {
    root: { children: [{ children: [{ text: "I agree" }] }] },
  };
  it("blocks when a language has no consent text", () => {
    const block = consentBlock([{ form: { consentText: { en: text } } }]);
    expect(block?.kind).toBe("consent");
  });
  it("passes when all languages have it, or there is no form", () => {
    const all = Object.fromEntries(["en", "id"].map((code) => [code, text]));
    expect(consentBlock([{ form: { consentText: all } }])).toBeNull();
    expect(consentBlock([{ blockType: "hero" }])).toBeNull();
  });
});

describe("a slug clash on publish", () => {
  it("is listed in the summary under the slug field with the server's message", async () => {
    const { recordClashMessage } = await import("../paths");
    const message = recordClashMessage(
      "products",
      { collection: "products", name: "Soda ash", company: "Dunia Kimia" },
      3,
    );
    const problems = fieldProblems({
      name: { valid: true },
      slug: { valid: false, errorMessage: message },
    });
    expect(problems).toEqual([{ path: "slug", label: "Slug", message }]);
    expect(message).toContain("already uses this URL");
  });
});
