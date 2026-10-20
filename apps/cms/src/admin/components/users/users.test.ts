import { describe, expect, it } from "vitest";

import { lastSignInText, userStatus } from "./users";

const now = new Date("2026-10-20T03:00:00.000Z");

describe("userStatus (K-02)", () => {
  it("is locked while lockUntil is in the future, with whole minutes left", () => {
    expect(
      userStatus(
        {
          lastLoginAt: "2026-10-19T01:00:00.000Z",
          lockUntil: "2026-10-20T03:06:10.000Z",
        },
        now,
      ),
    ).toEqual({ status: "locked", minutes: 7 });
  });

  it("is invited until the first sign-in", () => {
    expect(userStatus({ lastLoginAt: null }, now)).toEqual({
      status: "invited",
    });
  });

  it("is active once signed in and any lock has passed", () => {
    expect(
      userStatus(
        {
          lastLoginAt: "2026-10-19T01:00:00.000Z",
          lockUntil: "2026-10-20T02:00:00.000Z",
        },
        now,
      ),
    ).toEqual({ status: "active" });
  });

  it("never exposes how many wrong attempts were made", () => {
    const status = userStatus(
      { loginAttempts: 4, lastLoginAt: "2026-10-19T01:00:00.000Z" } as never,
      now,
    );
    expect(JSON.stringify(status)).not.toMatch(/attempt|4/);
  });
});

describe("lastSignInText", () => {
  it("reads like the design in WIB", () => {
    expect(lastSignInText("2026-10-20T01:02:00.000Z", now)).toBe(
      "Today, 08:02",
    );
    expect(lastSignInText("2026-10-19T01:02:00.000Z", now)).toBe("Yesterday");
    expect(lastSignInText("2026-10-03T01:02:00.000Z", now)).toBe("3 Oct");
    expect(lastSignInText("2025-12-03T01:02:00.000Z", now)).toBe("3 Dec 2025");
    expect(lastSignInText(null, now)).toBe("—");
  });
});
