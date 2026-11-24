import { signRevalidation, revalidationHeaders } from "@dilm/runtime-config";
import { describe, expect, it, vi } from "vitest";

import {
  cloudflarePurger,
  disabledPurger,
  type CloudflareFetch,
} from "./cloudflare";
import { handleRevalidate, type RevalidateDeps } from "./handle";

const secret = "s3cret";
const now = 1_700_000_000_000;

function signed(payload: unknown, at = now, key = secret) {
  const body = JSON.stringify(payload);
  return new Request("https://indoacid.localhost/api/revalidate", {
    method: "POST",
    body,
    headers: revalidationHeaders(signRevalidation(body, key, at)),
  });
}

function setup(overrides: Partial<RevalidateDeps> = {}) {
  const order: string[] = [];
  const deps: RevalidateDeps = {
    secret,
    now,
    knownHost: (host) => host.endsWith(".test"),
    expireTag: vi.fn(async (tag: string) => {
      order.push(`tag:${tag}`);
    }),
    warm: vi.fn(async ({ path }) => {
      order.push(`warm:${path}`);
      return true;
    }),
    purge: vi.fn(async (entries) => {
      order.push(`purge:${entries.length}`);
      return { status: "done" as const, requests: 1 };
    }),
    log: { info: vi.fn(), error: vi.fn() },
    ...overrides,
  };
  return { deps, order };
}

const payload = {
  tags: ["layout:indoacid", "route:indoacid:en:/about"],
  purge: [
    { host: "a.test", pathPrefix: "/en/about", exact: true },
    { host: "a.test", pathPrefix: "/en/news/" },
  ],
};

describe("handleRevalidate", () => {
  it("expires tags, warms exact paths, then purges, in that order", async () => {
    const { deps, order } = setup();
    const result = await handleRevalidate(signed(payload), deps);
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(order).toEqual([
      "tag:layout:indoacid",
      "tag:route:indoacid:en:/about",
      "warm:/en/about",
      "purge:2",
    ]);
  });

  it("rejects a bad signature and touches nothing", async () => {
    const { deps } = setup();
    const result = await handleRevalidate(signed(payload, now, "wrong"), deps);
    expect(result.status).toBe(401);
    expect(deps.expireTag).not.toHaveBeenCalled();
    expect(deps.purge).not.toHaveBeenCalled();
  });

  it("rejects a stale timestamp", async () => {
    const { deps } = setup();
    const result = await handleRevalidate(
      signed(payload, now - 5 * 60_000 - 1),
      deps,
    );
    expect(result.status).toBe(401);
    expect(deps.expireTag).not.toHaveBeenCalled();
  });

  it("rejects an unsigned request and refuses when no secret is set", async () => {
    const { deps } = setup();
    const bare = new Request("https://a.test/api/revalidate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect((await handleRevalidate(bare, deps)).status).toBe(401);
    const none = setup({ secret: undefined });
    expect((await handleRevalidate(signed(payload), none.deps)).status).toBe(
      503,
    );
    expect(none.deps.expireTag).not.toHaveBeenCalled();
  });

  it("rejects a purge for a host the site does not serve", async () => {
    const { deps } = setup();
    const result = await handleRevalidate(
      signed({
        tags: [],
        purge: [{ host: "evil.example", pathPrefix: "/en/" }],
      }),
      deps,
    );
    expect(result.status).toBe(400);
    expect(deps.purge).not.toHaveBeenCalled();
  });

  it("expires tags immediately rather than serving stale", async () => {
    const { deps } = setup();
    await handleRevalidate(signed({ tags: ["x"], purge: [] }), deps);
    expect(deps.expireTag).toHaveBeenCalledWith("x");
  });

  it("reports partial failures and still purges", async () => {
    const { deps } = setup({
      expireTag: vi.fn(async (tag: string) => {
        if (tag === "layout:indoacid") throw new Error("boom");
      }),
      warm: vi.fn(async () => false),
    });
    const result = await handleRevalidate(signed(payload), deps);
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(false);
    expect(result.body.failedTags).toEqual(["layout:indoacid"]);
    expect(result.body.failedWarms).toEqual(["a.test/en/about"]);
    expect(deps.purge).toHaveBeenCalled();
    expect(deps.log.error).toHaveBeenCalled();
  });

  it("treats a skipped purge as success", async () => {
    const { deps } = setup({ purge: disabledPurger });
    const result = await handleRevalidate(signed(payload), deps);
    expect(result.body.ok).toBe(true);
    expect(result.body.purge).toMatchObject({ status: "skipped" });
  });
});

describe("cloudflarePurger", () => {
  it("is a no-op without configuration", async () => {
    const send = vi.fn();
    const out = await cloudflarePurger(
      undefined,
      send,
    )([{ host: "a.test", pathPrefix: "/en/" }]);
    expect(out.status).toBe("skipped");
    expect(send).not.toHaveBeenCalled();
  });

  it("scopes purges to host prefixes and exact files, never everything", async () => {
    const send = vi.fn<CloudflareFetch>(async () => ({
      ok: true,
      status: 200,
    }));
    const out = await cloudflarePurger(
      { apiToken: "t", zones: { "a.test": "z1" } },
      send,
    )([
      { host: "a.test", pathPrefix: "/en/about", exact: true },
      { host: "a.test", pathPrefix: "/en/news/" },
    ]);
    expect(out).toEqual({ status: "done", requests: 2 });
    const bodies = send.mock.calls.map(([, init]) => JSON.parse(init.body));
    expect(bodies).toContainEqual({ files: ["https://a.test/en/about"] });
    expect(bodies).toContainEqual({ prefixes: ["a.test/en/news/"] });
    expect(JSON.stringify(bodies)).not.toContain("purge_everything");
  });

  it("fails an entry whose host has no zone, without calling Cloudflare", async () => {
    const send = vi.fn();
    const out = await cloudflarePurger(
      { apiToken: "t", zones: { "a.test": "z1" } },
      send,
    )([{ host: "b.test", pathPrefix: "/en/" }]);
    expect(out.status).toBe("failed");
    expect(send).not.toHaveBeenCalled();
  });
});
