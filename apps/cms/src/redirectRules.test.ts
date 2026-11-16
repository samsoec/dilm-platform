import { describe, expect, it } from "vitest";

import {
  CHAIN_LOOP_MESSAGE,
  duplicateMessage,
  fromProblem,
  normalizeFrom,
  redirectProblem,
  SELF_LOOP_MESSAGE,
  type KnownRedirect,
} from "./redirectRules";

const facts = (over: Partial<Parameters<typeof redirectProblem>[0]> = {}) => ({
  from: "/old",
  locale: "en",
  tenant: "2",
  targetPath: "/new",
  ...over,
});

const row = (over: Partial<KnownRedirect> = {}): KnownRedirect => ({
  id: "1",
  from: "/x",
  tenant: "2",
  targetPath: "/y",
  ...over,
});

describe("normalizeFrom", () => {
  it("trims and drops trailing slashes", () => {
    expect(normalizeFrom("  /old/ ")).toBe("/old");
    expect(normalizeFrom("/")).toBe("/");
  });
});

describe("fromProblem", () => {
  it("wants a path starting with / and no language", () => {
    expect(fromProblem("old")).toBeDefined();
    expect(fromProblem("/en/old")).toBeDefined();
    expect(fromProblem("")).toBeDefined();
    expect(fromProblem("/old")).toBeUndefined();
  });
});

describe("redirectProblem", () => {
  it("accepts a clean redirect", () => {
    expect(redirectProblem(facts(), [row()])).toBeUndefined();
  });

  it("refuses a duplicate in the same company or all-site", () => {
    expect(redirectProblem(facts(), [row({ from: "/old" })])).toEqual({
      path: "from",
      message: duplicateMessage("/old"),
    });
    expect(
      redirectProblem(facts(), [row({ from: "/old", tenant: null })]),
    ).toMatchObject({ path: "from" });
  });

  it("lets the row being edited keep its own address", () => {
    expect(
      redirectProblem(facts({ id: "1" }), [row({ from: "/old" })]),
    ).toBeUndefined();
  });

  it("refuses a self-loop", () => {
    expect(redirectProblem(facts({ targetPath: "/old" }), [])).toEqual({
      path: "to",
      message: SELF_LOOP_MESSAGE,
    });
  });

  it("refuses a loop through other redirects", () => {
    const known = [
      row({ id: "5", from: "/new", targetPath: "/mid" }),
      row({ id: "6", from: "/mid", targetPath: "/old" }),
    ];
    expect(redirectProblem(facts(), known)).toEqual({
      path: "to",
      message: CHAIN_LOOP_MESSAGE,
    });
  });

  it("ends on a chain that never comes back", () => {
    const known = [row({ id: "5", from: "/new", targetPath: "/mid" })];
    expect(redirectProblem(facts(), known)).toBeUndefined();
  });
});
