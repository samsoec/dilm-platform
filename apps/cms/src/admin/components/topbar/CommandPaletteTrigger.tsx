"use client";

import { useSyncExternalStore } from "react";

import { useCommandPalette } from "../command-palette/context";
import { shortcutLabel } from "../command-palette/search";
import { MaterialIcon } from "../MaterialIcon";

const noSubscription = () => () => {};

export function CommandPaletteTrigger() {
  const palette = useCommandPalette();
  const shortcut = useSyncExternalStore(
    noSubscription,
    () => shortcutLabel(navigator.platform || navigator.userAgent),
    () => shortcutLabel("mac"),
  );

  return (
    <button
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className="dil-search-trigger"
      disabled={!palette}
      onClick={palette?.open}
      type="button"
    >
      <MaterialIcon name="search" />
      <span className="dil-search-trigger__text">Search or jump to…</span>
      <kbd className="dil-search-trigger__key">{shortcut}</kbd>
    </button>
  );
}
