import { describe, expect, it } from "vitest";

import type { PathProblem } from "../../../paths";
import {
  dialogProblem,
  idSlugNote,
  matchesQuery,
  orderedParents,
  pickableParent,
  shapeProblems,
  slugsPayload,
  splitDisplay,
  type ParentOption,
} from "./newPage";

const page = (
  id: string,
  title: string,
  path: string,
  shared = false,
): ParentOption => ({
  id,
  title,
  shared,
  collection: shared ? "shared-pages" : "pages",
  paths: { en: path, id: path },
});

describe("dialogProblem", () => {
  it("words a same-site clash like PG-02 and links the page", () => {
    const problem: PathProblem = {
      locale: "en",
      path: "/about-us/our-journey",
      message: "ignored",
      kind: "same-site",
      existing: { collection: "pages", id: 7, title: "Our Journey" },
    };
    expect(dialogProblem(problem)).toEqual({
      field: "slug-en",
      locale: "en",
      kind: "same-site",
      message: '"Our Journey" already uses /about-us/our-journey in English.',
      open: { collection: "pages", id: "7" },
    });
  });

  it("names the Indonesian language and field for an id clash", () => {
    const result = dialogProblem({
      locale: "id",
      path: "/tentang-kami",
      message: "x",
      kind: "same-site",
      existing: { collection: "pages", id: 3, title: "Tentang" },
    });
    expect(result.field).toBe("slug-id");
    expect(result.message).toBe(
      '"Tentang" already uses /tentang-kami in Indonesian.',
    );
  });

  it("keeps the reserved word and shared page messages as they are", () => {
    expect(
      dialogProblem({
        locale: "en",
        path: "/media",
        message:
          "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.",
        kind: "reserved",
      }),
    ).toMatchObject({
      kind: "reserved",
      message:
        "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.",
    });
    expect(
      dialogProblem({
        locale: "en",
        path: "/privacy-policy",
        message:
          '/privacy-policy is the shared page "Privacy Policy", on all 3 sites. Pick another slug.',
        kind: "shared",
        existing: {
          collection: "shared-pages",
          id: 1,
          title: "Privacy Policy",
        },
      }),
    ).toMatchObject({
      kind: "shared",
      message:
        '/privacy-policy is the shared page "Privacy Policy", on all 3 sites. Pick another slug.',
    });
  });

  it("turns a clash with the shared Home at / into the root message", () => {
    expect(
      dialogProblem({
        locale: "en",
        path: "/",
        message:
          '/ is the shared page "Home", on all 3 sites. Pick another slug.',
        kind: "shared",
      }),
    ).toMatchObject({
      kind: "root",
      message: "The root URL / is the shared Home. Give this page a slug.",
    });
  });
});

describe("shapeProblems", () => {
  it("flags an empty English slug without a parent as the root problem", () => {
    expect(shapeProblems({ en: "", id: "" }, false)).toEqual([
      expect.objectContaining({
        field: "slug-en",
        kind: "root",
        message: "The root URL / is the shared Home. Give this page a slug.",
      }),
    ]);
  });

  it("asks for a slug when there is a parent", () => {
    expect(shapeProblems({ en: "", id: "" }, true)).toEqual([
      expect.objectContaining({
        kind: "empty",
        message: "Add the page's slug.",
      }),
    ]);
  });

  it("flags invalid slugs per field and allows an empty Indonesian slug", () => {
    expect(shapeProblems({ en: "ok", id: "Bad Slug" }, false)).toEqual([
      expect.objectContaining({ field: "slug-id", kind: "invalid" }),
    ]);
    expect(shapeProblems({ en: "ok", id: "" }, false)).toEqual([]);
  });
});

describe("parent options", () => {
  const options = [
    page("3", "Sustainability", "/sustainability"),
    page("1", "About Us", "/about-us"),
    page("2", "Overview", "/about-us/overview"),
    page("9", "Products & Solutions", "/products-solutions", true),
  ];

  it("lists company pages by path, then shared pages", () => {
    expect(orderedParents(options).map(({ title }) => title)).toEqual([
      "About Us",
      "Overview",
      "Sustainability",
      "Products & Solutions",
    ]);
  });

  it("searches titles and paths of either language", () => {
    expect(matchesQuery(options[1], "about")).toBe(true);
    expect(matchesQuery(options[2], "/about-us/over")).toBe(true);
    expect(matchesQuery(options[0], "  ")).toBe(true);
    expect(matchesQuery(options[0], "zzz")).toBe(false);
    expect(
      matchesQuery({ ...options[0], paths: { id: "/keberlanjutan" } }, "keber"),
    ).toBe(true);
  });

  it("only accepts a numeric id of a company page as the starting parent", () => {
    expect(pickableParent(options, "1")?.title).toBe("About Us");
    expect(pickableParent(options, "9")).toBeUndefined();
    expect(pickableParent(options, "77")).toBeUndefined();
    expect(pickableParent(options, "1 or 1=1")).toBeUndefined();
    expect(pickableParent(options, undefined)).toBeUndefined();
  });
});

describe("slugs and URLs", () => {
  it("trims the slugs", () => {
    expect(slugsPayload(" history ", " ")).toEqual({ en: "history", id: "" });
  });

  it("says when the Indonesian address falls back", () => {
    expect(idSlugNote("history", "")).toBe(
      "Empty: the Indonesian address uses the English slug (history).",
    );
    expect(idSlugNote("history", "sejarah")).toBe(
      "Optional. Empty uses the English slug.",
    );
    expect(idSlugNote("", "")).toBe("Optional. Empty uses the English slug.");
  });

  it("splits the last segment off a displayed URL", () => {
    expect(splitDisplay("duniakimia.com/en/about-us/history")).toEqual({
      head: "duniakimia.com/en/about-us/",
      tail: "history",
    });
    expect(splitDisplay("duniakimia.com/en/about-us/")).toEqual({
      head: "duniakimia.com/en/about-us/",
      tail: "",
    });
    expect(splitDisplay("duniakimia.com/en")).toEqual({
      head: "duniakimia.com/",
      tail: "en",
    });
  });
});
