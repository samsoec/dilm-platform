import { describe, expect, it } from "vitest";

import {
  SITE_READ_CONTEXT,
  readMembersOrPublishedSite,
  readMembersOrSite,
} from "./access";
import { parseSiteScope, siteError, siteOk } from "./siteApi";

const url = (query: string) => new URL(`http://x/api/site/tenant${query}`);

describe("parseSiteScope", () => {
  it("accepts a known tenant and locale", () => {
    expect(parseSiteScope(url("?tenant=likutelaga&locale=id"))).toEqual({
      tenant: "likutelaga",
      locale: "id",
    });
  });

  it("has no default tenant or locale", async () => {
    for (const query of [
      "",
      "?locale=en",
      "?tenant=likutelaga",
      "?tenant=nobody&locale=en",
      "?tenant=likutelaga&locale=fr",
    ]) {
      const result = parseSiteScope(url(query));
      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(400);
    }
  });
});

describe("responses", () => {
  it("wraps data in the envelope", async () => {
    expect(await siteOk({ a: 1 }).json()).toEqual({ data: { a: 1 } });
  });

  it("maps error codes to statuses and never caches them", async () => {
    const response = siteError("not-found", "gone");
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      error: { code: "not-found", message: "gone" },
    });
    expect(siteError("unavailable", "x").status).toBe(503);
  });
});

describe("site read access", () => {
  const args = (req: object) => ({ req }) as never;

  it("lets the site context read settings and nobody else anonymously", () => {
    expect(readMembersOrSite(args({ context: SITE_READ_CONTEXT }))).toBe(true);
    expect(readMembersOrSite(args({ context: {} }))).toBe(false);
  });

  it("limits site reads of IR documents to published ones", () => {
    expect(
      readMembersOrPublishedSite(args({ context: SITE_READ_CONTEXT })),
    ).toEqual({ _status: { equals: "published" } });
    expect(readMembersOrPublishedSite(args({ context: {} }))).toBe(false);
    expect(
      readMembersOrPublishedSite(
        args({ context: {}, user: { roles: ["tenant-viewer"] } }),
      ),
    ).toBe(true);
  });
});
