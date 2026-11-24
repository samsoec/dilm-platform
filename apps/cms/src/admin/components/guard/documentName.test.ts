import { describe, expect, it } from "vitest";

import { resolveDocumentName } from "./documentName";

describe("resolveDocumentName", () => {
  it("uses the typed title of a new document", () => {
    expect(
      resolveDocumentName({
        liveTitle: "  Hello  ",
        defaultLocaleTitle: undefined,
        singularLabel: "Post",
      }),
    ).toEqual({ title: "Hello", titled: true });
  });

  it("names a new untitled document by its singular label", () => {
    expect(
      resolveDocumentName({
        liveTitle: "",
        defaultLocaleTitle: undefined,
        singularLabel: "Post",
      }),
    ).toEqual({ title: "post", titled: false });
  });

  it("falls back to the default-locale title when the locale is empty", () => {
    expect(
      resolveDocumentName({
        liveTitle: undefined,
        defaultLocaleTitle: "English title",
        singularLabel: "Post",
      }),
    ).toEqual({ title: "English title", titled: true });
  });

  it("never returns an ID-like value from the form", () => {
    expect(
      resolveDocumentName({
        liveTitle: null,
        defaultLocaleTitle: null,
        singularLabel: undefined,
      }).titled,
    ).toBe(false);
  });
});
