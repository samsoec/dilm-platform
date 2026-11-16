import { describe, expect, it } from "vitest";

import {
  isLocked,
  liveMessage,
  parseRedirectsQuery,
  redirectsHref,
  redirectsWhere,
} from "./redirects";

describe("parseRedirectsQuery", () => {
  it("keeps known kinds and languages only", () => {
    expect(
      parseRedirectsQuery({ kind: "auto", lang: "id", q: " abc " }),
    ).toEqual({ kind: "auto", lang: "id", search: "abc" });
    expect(parseRedirectsQuery({ kind: "x", lang: "fr" })).toEqual({
      kind: undefined,
      lang: undefined,
      search: "",
    });
  });
});

describe("redirectsHref", () => {
  it("round-trips the filters", () => {
    expect(redirectsHref("/a", { kind: "manual", search: "x" })).toBe(
      "/a?kind=manual&q=x",
    );
  });
});

describe("redirectsWhere", () => {
  it("always scopes to the company plus all-site rows", () => {
    const where = redirectsWhere({ kind: "manual", lang: "en", search: "" }, 2);
    expect(JSON.stringify(where)).toContain('"tenant":{"equals":2}');
    expect(JSON.stringify(where)).toContain('"tenant":{"exists":false}');
    expect(JSON.stringify(where)).toContain('"origin":{"equals":"manual"}');
  });

  it("searches plain text columns", () => {
    const text = JSON.stringify(
      redirectsWhere({ kind: undefined, lang: undefined, search: "x" }, 2),
    );
    expect(text).toContain("to.internalPath");
    expect(text).not.toContain("richText");
  });
});

describe("isLocked", () => {
  const manualOwn = { origin: "manual", allSites: false };
  it("locks automatic and all-site rows for editors", () => {
    const editor = { superAdmin: false, canChange: true };
    expect(isLocked(manualOwn, editor)).toBe(false);
    expect(isLocked({ origin: "auto", allSites: false }, editor)).toBe(true);
    expect(isLocked({ origin: "manual", allSites: true }, editor)).toBe(true);
  });

  it("lets Super Admins edit everything and locks viewers", () => {
    expect(
      isLocked(
        { origin: "auto", allSites: true },
        { superAdmin: true, canChange: true },
      ),
    ).toBe(false);
    expect(isLocked(manualOwn, { superAdmin: false, canChange: false })).toBe(
      true,
    );
  });
});

describe("liveMessage", () => {
  it("matches RD-02", () => {
    expect(liveMessage("Career")).toBe(
      '"Career" is live at this URL, so visitors see the page, not the redirect.',
    );
  });
});
