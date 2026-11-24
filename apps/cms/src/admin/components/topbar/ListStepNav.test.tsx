// @vitest-environment jsdom
import type { StepNavItem } from "@payloadcms/ui";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { withAncestorCrumbs } from "../editor/crumbs";
import { ListStepNav } from "./ListStepNav";
import { withShellCrumbs } from "./topbar";

const world = vi.hoisted(() => ({
  nav: { stepNav: [] as StepNavItem[], setStepNav: vi.fn() },
}));

vi.mock("@payloadcms/ui", () => ({
  useStepNav: () => world.nav,
}));

afterEach(() => {
  cleanup();
  world.nav.setStepNav.mockReset();
});

describe("ListStepNav", () => {
  it("drops the previous document's crumbs when a list opens", () => {
    const shell = withShellCrumbs(
      [{ label: "Posts", url: "/admin/collections/posts" }, { label: "1" }],
      ["Dunia Kimia Utama", "Website content"],
    );
    const editor = withAncestorCrumbs(shell, [
      { label: "Parent", url: "/admin/collections/posts/0" },
    ]);
    world.nav.stepNav = editor;

    render(<ListStepNav label="Shared pages" />);

    const next = world.nav.setStepNav.mock.calls[0][0] as StepNavItem[];
    expect(next.map(({ label }) => label)).toEqual([
      "Dunia Kimia Utama",
      "Website content",
      "Shared pages",
    ]);
  });
});
