import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SiteScope } from "@dilm/shared-types";

const unstableCache = vi.fn(
  (fn: () => Promise<unknown>, ...rest: [string[], { tags: string[] }]) => (
    void rest,
    fn
  ),
);
vi.mock("next/cache", () => ({
  unstable_cache: (...args: Parameters<typeof unstableCache>) =>
    unstableCache(...args),
}));

import { ContentError } from "./errors";
import { readSite, readTenant } from "./client";
import {
  fixtureKey,
  fixtureTransport,
  selectTransport,
  type Transport,
} from "./transport";

const scope: SiteScope = { tenant: "likutelaga", locale: "en" };
const row = {
  ...scope,
  seo: { title: "Liku", description: null, ogImageUrl: null },
  analyticsId: "G-ABCDE12345",
};
const ok = () => Response.json({ data: row });
const kindOf = async (promise: Promise<unknown>) =>
  promise.then(
    () => "resolved",
    (error: unknown) => (error instanceof ContentError ? error.kind : "other"),
  );

describe("readTenant", () => {
  beforeEach(() => unstableCache.mockClear());

  it("reads through a fixture transport", async () => {
    const transport = fixtureTransport({ [fixtureKey("tenant", scope)]: row });
    expect(await readTenant(scope, { transport })).toEqual(row);
  });

  it("refuses a read without tenant or locale", async () => {
    const transport = vi.fn<Transport>(async () => ok());
    for (const bad of [{ locale: "en" }, { tenant: "likutelaga" }, undefined]) {
      expect(
        await kindOf(
          readSite("tenant", bad as unknown as SiteScope, { transport }),
        ),
      ).toBe("contract");
    }
    expect(transport).not.toHaveBeenCalled();
  });

  it("maps 404 to not-found", async () => {
    const transport: Transport = async () =>
      new Response("{}", { status: 404 });
    expect(await kindOf(readTenant(scope, { transport }))).toBe("not-found");
  });

  it("retries once on unavailable then succeeds", async () => {
    const transport = vi
      .fn<Transport>()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(ok());
    expect(await readTenant(scope, { transport })).toEqual(row);
    expect(transport).toHaveBeenCalledTimes(2);
  });

  it("gives up after one retry with unavailable", async () => {
    const transport = vi.fn<Transport>(async () => {
      throw new Error("down");
    });
    expect(await kindOf(readTenant(scope, { transport }))).toBe("unavailable");
    expect(transport).toHaveBeenCalledTimes(2);
  });

  it("times out without retrying", async () => {
    const transport = vi.fn<Transport>(
      (_path, { signal }) =>
        new Promise((_resolve, reject) =>
          signal.addEventListener("abort", () => reject(new Error("aborted"))),
        ),
    );
    expect(await kindOf(readTenant(scope, { transport, timeoutMs: 10 }))).toBe(
      "timeout",
    );
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("does not retry other client errors", async () => {
    const transport = vi.fn<Transport>(
      async () => new Response("{}", { status: 400 }),
    );
    expect(await kindOf(readTenant(scope, { transport }))).toBe("contract");
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("rejects an answer without the data envelope", async () => {
    const transport: Transport = async () => Response.json({ nope: 1 });
    expect(await kindOf(readTenant(scope, { transport }))).toBe("contract");
    const text: Transport = async () => new Response("<html>");
    expect(await kindOf(readTenant(scope, { transport: text }))).toBe(
      "contract",
    );
  });

  it("rejects an answer for another tenant", async () => {
    const transport: Transport = async () =>
      Response.json({ data: { ...row, tenant: "duniakimia" } });
    expect(await kindOf(readTenant(scope, { transport }))).toBe("contract");
  });

  it("caches with tenant tags and bypasses the cache for drafts", async () => {
    const transport: Transport = async () => ok();
    await readTenant(scope, { transport });
    expect(unstableCache).toHaveBeenCalledTimes(1);
    const [, key, options] = unstableCache.mock.calls[0]!;
    expect(key).toEqual(["site", "likutelaga", "en", "tenant"]);
    expect(options.tags).toEqual([
      "layout:likutelaga",
      "site:likutelaga:en:tenant",
    ]);
    await readTenant(scope, { transport, draft: true });
    expect(unstableCache).toHaveBeenCalledTimes(1);
  });
});

describe("selectTransport", () => {
  it("serves typed fixtures when CONTENT_TRANSPORT is fixture", async () => {
    const response = await selectTransport({ CONTENT_TRANSPORT: "fixture" })(
      fixtureKey("tenant", scope),
      { signal: new AbortController().signal },
    );
    expect(response.status).toBe(200);
  });

  it("calls the local CMS over plain HTTP without iam", async () => {
    const fetcher = vi.fn(async () => ok());
    await selectTransport(
      { CMS_URL: "http://localhost:3000" },
      fetcher as unknown as typeof fetch,
    )("/api/site/tenant?x=1", { signal: new AbortController().signal });
    expect(fetcher).toHaveBeenCalledWith(
      "http://localhost:3000/api/site/tenant?x=1",
      expect.anything(),
    );
  });

  it("signs with SigV4 when CMS_AUTH is iam", async () => {
    const fetcher = vi.fn(
      async (input: RequestInfo | URL) =>
        new Response((input as Request).headers.get("authorization")),
    );
    const response = await selectTransport(
      {
        CMS_URL: "https://cms.example",
        CMS_AUTH: "iam",
        AWS_ACCESS_KEY_ID: "AKIAEXAMPLE",
        AWS_SECRET_ACCESS_KEY: "secret",
        AWS_REGION: "ap-southeast-3",
      },
      fetcher as unknown as typeof fetch,
    )("/api/site/tenant", { signal: new AbortController().signal });
    expect(await response.text()).toMatch(/^AWS4-HMAC-SHA256 /);
  });
});
