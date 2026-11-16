import { describe, expect, it } from "vitest";

import { Categories } from "../../../collections/Categories";
import { findField } from "../../../testing";
import {
  COMPANY_COLUMNS,
  shouldWarnSlugChange,
  slugChangeMessage,
  slugText,
} from "./categories";

describe("slugChangeMessage", () => {
  it("matches the CT-02 wording", () => {
    expect(slugChangeMessage("company-news", "news", 24)).toBe(
      'Changing "company-news" to "news" changes the URL of 24 posts on all 3 sites. Redirects are created for each.',
    );
  });

  it("uses the singular for one post", () => {
    expect(slugChangeMessage("a", "b", 1)).toContain("of 1 post on");
  });
});

describe("shouldWarnSlugChange", () => {
  it("warns only for a changed slug with posts", () => {
    expect(shouldWarnSlugChange("a", "b", 3)).toBe(true);
    expect(shouldWarnSlugChange("a", "a", 3)).toBe(false);
    expect(shouldWarnSlugChange("a", "b", 0)).toBe(false);
    expect(shouldWarnSlugChange("", "b", 3)).toBe(false);
  });
});

describe("slugText", () => {
  it("falls back to the default locale", () => {
    expect(slugText({ en: "news", id: null }, "id", "en")).toBe("news");
    expect(slugText({ en: "news", id: "berita" }, "id", "en")).toBe("berita");
    expect(slugText(null, "id", "en")).toBe("");
  });
});

describe("columns and counts", () => {
  it("lists the companies in the ticket order", () => {
    expect(COMPANY_COLUMNS.map(({ label }) => label)).toEqual([
      "DKU",
      "IAI",
      "LTG",
    ]);
  });
});

describe("Categories collection", () => {
  it("uses the categories screen and the slug impact field", () => {
    expect(JSON.stringify(Categories.admin?.components)).toContain(
      "CategoriesView#CategoriesView",
    );
    expect(findField(Categories.fields, "slugImpact")).toBeDefined();
  });
});
