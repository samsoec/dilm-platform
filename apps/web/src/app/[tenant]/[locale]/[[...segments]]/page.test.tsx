import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("tenant page", () => {
  it("renders the tenant name", async () => {
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
