import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchTenantName } from "./tenantName";

afterEach(() => vi.unstubAllEnvs());

describe("fetchTenantName", () => {
  it("returns the name the CMS sends", async () => {
    vi.stubEnv("CMS_URL", "https://cms.example");
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify({ name: "Liku Telaga" })),
    );
    await expect(fetchTenantName("likutelaga", fetcher)).resolves.toBe(
      "Liku Telaga",
    );
    expect(fetcher).toHaveBeenCalledWith(
      "https://cms.example/api/web-tenant/likutelaga",
    );
  });

  it("throws on a failed lookup so ISR keeps the last good page", async () => {
    vi.stubEnv("CMS_URL", "https://cms.example");
    const fetcher = vi.fn(async () => new Response("no", { status: 500 }));
    await expect(fetchTenantName("likutelaga", fetcher)).rejects.toThrow(/500/);
  });
});
