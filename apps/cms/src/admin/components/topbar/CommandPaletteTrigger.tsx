import { MaterialIcon } from "../MaterialIcon";

export function CommandPaletteTrigger() {
  // TODO(DILM-56): open the command palette from here and on ⌘K / Ctrl+K.
  return (
    <button
      className="dil-search-trigger"
      disabled
      title="Search arrives with the command palette"
      type="button"
    >
      <MaterialIcon name="search" />
      <span className="dil-search-trigger__text">Search or jump to…</span>
      <kbd className="dil-search-trigger__key">⌘K</kbd>
    </button>
  );
}
