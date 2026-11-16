import { describe, expect, it } from "vitest";

import {
  checkManualRedirect,
  createdByValue,
  stampCreatedBy,
  SYSTEM_REDIRECT_WRITE,
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

describe("redirectProblem with sloppy targets", () => {
  it("catches a target with a trailing slash, query or hash", () => {
    for (const targetPath of ["/old/", "/old?x=1", "/old#top"]) {
      expect(redirectProblem(facts({ targetPath }), [])).toMatchObject({
        path: "to",
      });
    }
  });

  it("catches a chain loop through a sloppy target", () => {
    const known = [row({ id: "5", from: "/new", targetPath: "/old/" })];
    expect(redirectProblem(facts(), known)).toMatchObject({ path: "to" });
  });
});

describe("createdByValue", () => {
  it("stamps a manual create by a user", () => {
    expect(createdByValue("create", "manual", 7, undefined)).toBe(7);
    expect(createdByValue("create", undefined, 7, undefined)).toBe(7);
  });

  it("leaves automatic rows without an author", () => {
    expect(createdByValue("create", "auto", 7, undefined)).toBeNull();
  });

  it("keeps the stored author on update", () => {
    expect(createdByValue("update", "manual", 9, 7)).toBe(7);
  });
});

describe("redirect hooks", () => {
  const find = () => {
    throw new Error("must not read");
  };
  const system = {
    user: { id: 7 },
    context: { [SYSTEM_REDIRECT_WRITE]: true },
    payload: { find },
  };

  it("does not stamp an automatic row made during an editor's rename", () => {
    const out = stampCreatedBy({
      data: { origin: "auto" },
      operation: "create",
      originalDoc: undefined,
      req: system,
    } as never) as { createdBy: unknown };
    expect(out.createdBy).toBeNull();
  });

  it("stamps a manual create by an editor", () => {
    const out = stampCreatedBy({
      data: { origin: "manual" },
      operation: "create",
      originalDoc: undefined,
      req: { user: { id: 7 }, context: {} },
    } as never) as { createdBy: unknown };
    expect(out.createdBy).toBe(7);
  });

  it("lets the cascade update a legacy manual row without validating it", async () => {
    const data = { from: "bad", origin: "manual", to: { type: "internal" } };
    await expect(
      checkManualRedirect({
        data,
        originalDoc: { id: 1, origin: "manual", locale: "en" },
        req: system,
      } as never),
    ).resolves.toBe(data);
  });

  it("still validates a manual create by an editor", async () => {
    const payload = { find: async () => ({ docs: [] }) };
    await expect(
      checkManualRedirect({
        data: { from: "bad", origin: "manual", locale: "en", tenant: 2 },
        originalDoc: undefined,
        req: { user: { id: 7 }, context: {}, payload },
      } as never),
    ).rejects.toThrow();
  });
});
