import { describe, expect, it } from "vitest";

import { signPreviewToken, verifyPreviewToken } from "./preview";

const secret = "s3cret";
const now = 1_000_000;

describe("preview tokens", () => {
  it("accepts a fresh token for the signed path", () => {
    const token = signPreviewToken("/en/about", secret, now);
    expect(verifyPreviewToken(token, "/en/about", secret, now + 1000)).toEqual({
      ok: true,
    });
  });

  it("is valid for 10 minutes and not a moment longer", () => {
    const token = signPreviewToken("/en", secret, now);
    expect(verifyPreviewToken(token, "/en", secret, now + 600_000).ok).toBe(
      true,
    );
    expect(verifyPreviewToken(token, "/en", secret, now + 600_001)).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("rejects another path, another secret and an edited expiry", () => {
    const token = signPreviewToken("/en/a", secret, now);
    const [, signature] = token.split(".");
    expect(verifyPreviewToken(token, "/en/b", secret, now)).toEqual({
      ok: false,
      reason: "tampered",
    });
    expect(verifyPreviewToken(token, "/en/a", "other", now).ok).toBe(false);
    expect(
      verifyPreviewToken(
        `${now + 9_999_999}.${signature}`,
        "/en/a",
        secret,
        now,
      ).ok,
    ).toBe(false);
  });

  it("rejects malformed tokens", () => {
    for (const token of ["", "abc", "1.2.3", "x.y"]) {
      expect(verifyPreviewToken(token, "/en", secret, now).ok).toBe(false);
    }
  });
});
