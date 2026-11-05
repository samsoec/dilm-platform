import { describe, expect, it } from "vitest";

import { SLUG_PATTERN } from "./fields/pageFields";
import {
  ROOT_MESSAGE,
  SLUG_MESSAGE,
  SLUG_REQUIRED_MESSAGE,
  slugify,
  slugShapeProblem,
} from "./slugRules";

describe("slugify", () => {
  it.each([
    ["History", "history"],
    ["About Us", "about-us"],
    ["  Our   Journey  ", "our-journey"],
    ["Products & Solutions", "products-solutions"],
    ["Café Société", "cafe-societe"],
    ["Tentang Kami — Sejarah!", "tentang-kami-sejarah"],
    ["--Already--hyphenated--", "already-hyphenated"],
    ["ESG 2025", "esg-2025"],
    ["日本語", ""],
    ["   ", ""],
    ["", ""],
  ])("turns %j into %j", (title, slug) => {
    expect(slugify(title)).toBe(slug);
  });

  it("only ever produces something the slug validator accepts", () => {
    for (const title of [
      "Hello, World!",
      "Ünïcödé Tïtle",
      "a/b\\c?d=e",
      "100% Safe_Work",
      "Under_score",
    ]) {
      const slug = slugify(title);
      expect(slug === "" || SLUG_PATTERN.test(slug)).toBe(true);
      expect(slug.startsWith("-") || slug.endsWith("-")).toBe(false);
      expect(slug).not.toContain("--");
    }
  });
});

describe("slugShapeProblem", () => {
  it("asks for a slug, with the Home wording when there is no parent", () => {
    expect(slugShapeProblem("", { required: true, hasParent: false })).toBe(
      ROOT_MESSAGE,
    );
    expect(
      slugShapeProblem(undefined, { required: true, hasParent: true }),
    ).toBe(SLUG_REQUIRED_MESSAGE);
  });

  it("lets an optional slug stay empty", () => {
    expect(
      slugShapeProblem("", { required: false, hasParent: false }),
    ).toBeUndefined();
  });

  it("rejects characters outside a-z, 0-9 and hyphens", () => {
    for (const slug of ["Upper", "with space", "under_score", "a/b", "é"]) {
      expect(slugShapeProblem(slug, { required: true, hasParent: true })).toBe(
        SLUG_MESSAGE,
      );
    }
    expect(
      slugShapeProblem("ok-2", { required: true, hasParent: false }),
    ).toBeUndefined();
  });
});
