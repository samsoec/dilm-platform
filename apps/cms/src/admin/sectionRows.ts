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

export function itemCount(data: SectionData | null | undefined): number {
  if (!data) return 0;
  return Object.values(data).reduce<number>(
    (sum, value) => sum + (Array.isArray(value) ? value.length : 0),
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
