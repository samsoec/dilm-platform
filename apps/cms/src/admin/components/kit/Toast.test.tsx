// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KitToast, TOAST_DURATION_MS } from "./Toast";

vi.mock("@payloadcms/ui", () => ({ toast: {} }));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderToast(onDismiss = vi.fn(), onAction = vi.fn()) {
  render(
    <KitToast
      action={{ label: "View site", onClick: onAction }}
      body="duniakimia.com will show it within minutes."
      onDismiss={onDismiss}
      title="Header saved · version 13."
      tone="success"
    />,
  );
  return { onDismiss, onAction, toast: screen.getByRole("status") };
}

describe("KitToast (K-06, FR-UI-66)", () => {
  it("lasts 6 seconds", () => {
    const { onDismiss } = renderToast();
    expect(TOAST_DURATION_MS).toBe(6000);
    act(() => vi.advanceTimersByTime(5999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("stays while hovered, then finishes the time that was left", () => {
    const { onDismiss, toast } = renderToast();
    act(() => vi.advanceTimersByTime(4000));
    fireEvent.mouseEnter(toast);
    act(() => vi.advanceTimersByTime(20_000));
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.mouseLeave(toast);
    act(() => vi.advanceTimersByTime(1999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("stays while its action has focus", () => {
    const { onDismiss } = renderToast();
    const action = screen.getByRole("button", { name: "View site" });
    act(() => action.focus());
    act(() => vi.advanceTimersByTime(20_000));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => action.blur());
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("runs the action and closes", () => {
    const { onDismiss, onAction } = renderToast();
    fireEvent.click(screen.getByRole("button", { name: "View site" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
