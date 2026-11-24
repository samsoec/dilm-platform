import { describe, expect, it } from "vitest";

import {
  REVALIDATE_MAX_AGE_MS,
  edgeConfigFrom,
  parseRevalidationRequest,
  signRevalidation,
  verifyRevalidation,
} from "./revalidate";

const body = JSON.stringify({ tags: ["layout:indoacid"], purge: [] });
const now = 1_700_000_000_000;

function check(
  overrides: Partial<{ body: string; timestamp: string; signature: string }>,
  secret = "s3cret",
  at = now,
) {
  const signed = signRevalidation(body, "s3cret", now);
  return verifyRevalidation({ body, ...signed, ...overrides }, secret, at);
}

describe("revalidation signature", () => {
  it("accepts a fresh, correctly signed body", () => {
    expect(check({})).toEqual({ ok: true });
  });

  it("rejects a bad signature, a changed body and the wrong secret", () => {
    expect(check({ signature: "0".repeat(64) })).toMatchObject({
      reason: "tampered",
    });
    expect(check({ body: body + " " })).toMatchObject({ reason: "tampered" });
    expect(check({}, "other")).toMatchObject({ reason: "tampered" });
  });

  it("rejects missing or malformed headers", () => {
    expect(check({ signature: "zz" })).toMatchObject({ reason: "malformed" });
    expect(check({ timestamp: "12abc" })).toMatchObject({
      reason: "malformed",
    });
  });

  it("rejects a timestamp older than five minutes or far in the future", () => {
    expect(check({}, "s3cret", now + REVALIDATE_MAX_AGE_MS)).toEqual({
      ok: true,
    });
    expect(check({}, "s3cret", now + REVALIDATE_MAX_AGE_MS + 1)).toMatchObject({
      reason: "stale",
    });
    expect(check({}, "s3cret", now - 60_000)).toMatchObject({
      reason: "stale",
    });
  });

  it("does not let a re-stamped timestamp reuse an old signature", () => {
    const old = signRevalidation(body, "s3cret", now - 10 * 60_000);
    expect(
      verifyRevalidation(
        { body, timestamp: String(now), signature: old.signature },
        "s3cret",
        now,
      ),
    ).toMatchObject({ reason: "tampered" });
  });

  it("never accepts anything without a configured secret", () => {
    expect(check({}, "")).toMatchObject({ reason: "unconfigured" });
    expect(
      verifyRevalidation({ body, timestamp: null, signature: null }, undefined),
    ).toMatchObject({ reason: "unconfigured" });
  });
});

describe("parseRevalidationRequest", () => {
  it("parses a valid request and rejects malformed ones", () => {
    expect(
      parseRevalidationRequest(
        JSON.stringify({
          tags: ["a"],
          purge: [{ host: "h.test", pathPrefix: "/en/", exact: true }],
        }),
      ),
    ).toMatchObject({ ok: true });
    for (const bad of [
      "nope",
      "[]",
      JSON.stringify({ tags: "a", purge: [] }),
      JSON.stringify({ tags: [], purge: [{ host: "h", pathPrefix: "en" }] }),
      JSON.stringify({ tags: [], purge: [{ host: "h", pathPrefix: "//x" }] }),
    ]) {
      expect(parseRevalidationRequest(bad).ok).toBe(false);
    }
  });
});

describe("edgeConfigFrom", () => {
  it("leaves Cloudflare off for missing or placeholder values", () => {
    expect(
      edgeConfigFrom({ REVALIDATE_SECRET: "x" }).cloudflare,
    ).toBeUndefined();
    expect(
      edgeConfigFrom({
        CLOUDFLARE_API_TOKEN: "unset",
        CLOUDFLARE_ZONE_IDS: "unset",
      }).cloudflare,
    ).toBeUndefined();
    expect(
      edgeConfigFrom({
        CLOUDFLARE_API_TOKEN: "t",
        CLOUDFLARE_ZONE_IDS: '{"A.test":"z1"}',
      }).cloudflare,
    ).toEqual({ apiToken: "t", zones: { "a.test": "z1" } });
  });
});
