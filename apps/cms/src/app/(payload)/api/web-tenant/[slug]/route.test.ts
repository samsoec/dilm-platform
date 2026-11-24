import { beforeEach, describe, expect, it, vi } from "vitest";

const find = vi.fn();

vi.mock("@payload-config", () => ({ default: {} }));
vi.mock("payload", () => ({
  getPayload: async () => ({ find }),
}));

import { GET } from "./route";

const call = (slug: string) =>
  GET(new Request("http://x"), { params: Promise.resolve({ slug }) });

describe("web-tenant route", () => {
  beforeEach(() => find.mockReset());

  it("returns the name of a known tenant", async () => {
    find.mockResolvedValue({ docs: [{ slug: "likutelaga", name: "Liku" }] });
    const response = await call("likutelaga");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ slug: "likutelaga", name: "Liku" });
  });

  it("answers 404 for an unknown tenant", async () => {
    find.mockResolvedValue({ docs: [] });
    expect((await call("nobody")).status).toBe(404);
  });
});
