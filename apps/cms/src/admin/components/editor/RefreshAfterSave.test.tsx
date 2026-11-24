// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RefreshAfterSave } from "./EditorHeader";

const world = vi.hoisted(() => ({
  refresh: vi.fn(),
  info: {
    lastUpdateTime: 1 as number | undefined,
    id: 5 as number | string,
    collectionSlug: "posts" as string | undefined,
    globalSlug: undefined as string | undefined,
  },
  events: { mostRecentUpdate: null as unknown },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: world.refresh }),
}));

vi.mock("@payloadcms/ui", () => ({
  useDocumentInfo: () => world.info,
  useDocumentEvents: () => world.events,
  useFormFields: () => undefined,
}));

afterEach(() => {
  cleanup();
  world.refresh.mockClear();
  world.info.lastUpdateTime = 1;
  world.events.mostRecentUpdate = null;
});

describe("RefreshAfterSave", () => {
  it("does not refresh when only lastUpdateTime changes", () => {
    const view = render(<RefreshAfterSave />);
    world.info.lastUpdateTime = 2;
    view.rerender(<RefreshAfterSave />);
    world.info.lastUpdateTime = 3;
    view.rerender(<RefreshAfterSave />);
    expect(world.refresh).not.toHaveBeenCalled();
  });

  it("refreshes once per reported save", () => {
    const view = render(<RefreshAfterSave />);
    world.events.mostRecentUpdate = {
      id: 5,
      entitySlug: "posts",
      operation: "update",
    };
    view.rerender(<RefreshAfterSave />);
    view.rerender(<RefreshAfterSave />);
    expect(world.refresh).toHaveBeenCalledTimes(1);
    world.events.mostRecentUpdate = {
      id: 5,
      entitySlug: "posts",
      operation: "update",
    };
    view.rerender(<RefreshAfterSave />);
    expect(world.refresh).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["another entity", { id: 5, entitySlug: "media" }],
    ["another id", { id: 6, entitySlug: "posts" }],
    ["a drawer", { id: 5, entitySlug: "posts", drawerSlug: "drawer-1" }],
  ])("ignores a save from %s", (_name, update) => {
    const view = render(<RefreshAfterSave />);
    world.events.mostRecentUpdate = update;
    view.rerender(<RefreshAfterSave />);
    expect(world.refresh).not.toHaveBeenCalled();
  });
});
