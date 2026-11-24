import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";

beforeEach(() => {
  vi.stubEnv("CMS_URL", "https://cms.example");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ name: "Liku Telaga" }))),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("tenant page", () => {
  it("renders the tenant name read from the CMS", async () => {
    const ui = await Page({
      params: Promise.resolve({ tenant: "likutelaga", locale: "en" }),
    });
    render(ui);
    expect(screen.getByText("Liku Telaga")).toBeTruthy();
  });

  it("is not found for an unknown locale", async () => {
    await expect(
      Page({ params: Promise.resolve({ tenant: "likutelaga", locale: "xx" }) }),
    ).rejects.toBeDefined();
  });
});
