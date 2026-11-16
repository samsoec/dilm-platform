export type SectionData = {
  blockType?: string;
  variant?: unknown;
  heading?: { eyebrow?: unknown; title?: unknown } | null;
  banner?: { eyebrow?: unknown; title?: unknown } | null;
  [key: string]: unknown;
};

const COUNTED = [
  ["products", "product", "products"],
  ["cards", "card", "cards"],
  ["items", "item", "items"],
  ["entries", "entry", "entries"],
  ["tabs", "tab", "tabs"],
  ["slides", "slide", "slides"],
] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function positionText(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function sectionCountText(count: number, max: number | undefined) {
  return max ? `${count} of ${max} sections` : `${count} sections`;
}

export function variantText(variant: unknown): string {
  const value = text(variant);
  if (!value) return "";
  const spaced = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function sectionSummary(
  data: SectionData | null | undefined,
  record: boolean,
): string {
  if (!data) return "";
  const source = data.heading ?? data.banner;
  const eyebrow = text(source?.eyebrow);
  const title = text(source?.title);
  if (eyebrow && title) return `${eyebrow} · ${title}`;
  if (title || eyebrow) return title || eyebrow;
  for (const [key, one, many] of COUNTED) {
    const value = data[key];
    if (Array.isArray(value) && value.length > 0) {
      return `${value.length} ${value.length === 1 ? one : many}`;
    }
  }
  return record ? "Filled from the record" : "";
}

const NOT_ITEMS = new Set(["buttons"]);

export function itemCount(data: SectionData | null | undefined): number {
  if (!data) return 0;
  return Object.entries(data).reduce<number>(
    (sum, [key, value]) =>
      sum + (Array.isArray(value) && !NOT_ITEMS.has(key) ? value.length : 0),
    0,
  );
}

export function removeCopy(name: string, data: SectionData | null | undefined) {
  const count = itemCount(data);
  const items = `${count} ${count === 1 ? "item" : "items"}`;
  return {
    title: `Remove "${name}"?`,
    body: `Its ${items} and their text in English and Indonesian go with it. You can get it back from Versions until you publish.`,
  };
}

export function clampMove(from: number, delta: number, count: number) {
  const to = from + delta;
  return to < 0 || to >= count ? from : to;
}

export function pickedUpText(name: string, index: number, count: number) {
  return `${name}, picked up. Position ${index + 1} of ${count}. Arrow keys to move, Space to drop, Escape to cancel.`;
}

export function movedText(name: string, index: number, count: number) {
  return `${name}, moved to position ${index + 1} of ${count}.`;
}

export function droppedText(name: string, index: number, count: number) {
  return `${name}, dropped at position ${index + 1} of ${count}.`;
}

export function cancelledText(name: string, index: number, count: number) {
  return `${name}, move cancelled. Back at position ${index + 1} of ${count}.`;
}

export type PickupState = { pickedUp: boolean; origin: number };

export type PickupResult = {
  state: PickupState;
  moveTo?: number;
  announce?: string;
  handled: boolean;
};

export function pickupKey(
  state: PickupState,
  key: string,
  index: number,
  count: number,
  name: string,
): PickupResult {
  const confirm = key === " " || key === "Enter";
  if (!state.pickedUp) {
    if (!confirm) return { state, handled: false };
    return {
      state: { pickedUp: true, origin: index },
      announce: pickedUpText(name, index, count),
      handled: true,
    };
  }
  if (key === "ArrowUp" || key === "ArrowDown") {
    const to = clampMove(index, key === "ArrowUp" ? -1 : 1, count);
    return {
      state,
      handled: true,
      ...(to === index
        ? {}
        : { moveTo: to, announce: movedText(name, to, count) }),
    };
  }
  if (confirm) {
    return {
      state: { ...state, pickedUp: false },
      announce: droppedText(name, index, count),
      handled: true,
    };
  }
  if (key === "Escape") {
    return {
      state: { ...state, pickedUp: false },
      ...(state.origin === index ? {} : { moveTo: state.origin }),
      announce: cancelledText(name, state.origin, count),
      handled: true,
    };
  }
  return { state, handled: false };
}

const ROW_ID = /^(.+)-row-(\d+)$/;

export function altArrowMove(
  event: { altKey: boolean; key: string },
  rowId: string | undefined,
  fieldPath: string,
  count: number,
): { from: number; to: number } | null {
  if (!event.altKey || !rowId) return null;
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return null;
  const match = ROW_ID.exec(rowId);
  if (!match || match[1] !== fieldPath.split(".").join("-")) return null;
  const from = Number(match[2]);
  const to = clampMove(from, event.key === "ArrowUp" ? -1 : 1, count);
  return to === from ? null : { from, to };
}

export type MenuActionId =
  "up" | "down" | "insertAbove" | "insertBelow" | "duplicate" | "remove";

export function menuActions(index: number, count: number) {
  return [
    { id: "up", label: "Move up", hint: "⌥↑", disabled: index === 0 },
    {
      id: "down",
      label: "Move down",
      hint: "⌥↓",
      disabled: index >= count - 1,
    },
    { id: "insertAbove", label: "Insert above", disabled: false },
    { id: "insertBelow", label: "Insert below", disabled: false },
    { id: "duplicate", label: "Duplicate", disabled: false },
    { id: "remove", label: "Remove…", disabled: false },
  ] as { id: MenuActionId; label: string; hint?: string; disabled: boolean }[];
}

export type MenuHandlers = {
  move: (to: number) => void;
  openCatalog: (index: number) => void;
  duplicate: () => void;
  confirmRemove: () => void;
};

export function runMenuAction(
  id: MenuActionId,
  index: number,
  count: number,
  handlers: MenuHandlers,
) {
  switch (id) {
    case "up":
      return handlers.move(clampMove(index, -1, count));
    case "down":
      return handlers.move(clampMove(index, 1, count));
    case "insertAbove":
      return handlers.openCatalog(index);
    case "insertBelow":
      return handlers.openCatalog(index + 1);
    case "duplicate":
      return handlers.duplicate();
    case "remove":
      return handlers.confirmRemove();
  }
}
