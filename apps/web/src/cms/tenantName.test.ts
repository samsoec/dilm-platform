import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/content/client", () => ({
  readTenant: async (scope: { tenant: string; locale: string }) => ({
    ...scope,
    seo: { title: "Liku Telaga", description: null, ogImageUrl: null },
    analyticsId: null,
  }),
}));

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

  it("reads the name from the fixture transport when it is selected", async () => {
    vi.stubEnv("CONTENT_TRANSPORT", "fixture");
    const fetcher = vi.fn();
    await expect(fetchTenantName("likutelaga", fetcher, "id")).resolves.toBe(
      "Liku Telaga",
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
});
