export type ListboxMove =
  { index: number } | { select: true } | { close: true };

export function listboxKey(
  key: string,
  index: number,
  count: number,
): ListboxMove | undefined {
  if (count === 0) return key === "Escape" ? { close: true } : undefined;
  switch (key) {
    case "ArrowDown":
      return { index: Math.min(count - 1, index + 1) };
    case "ArrowUp":
      return { index: Math.max(0, index - 1) };
    case "Home":
    case "PageUp":
      return { index: 0 };
    case "End":
    case "PageDown":
      return { index: count - 1 };
    case "Enter":
    case " ":
      return { select: true };
    case "Escape":
    case "Tab":
      return { close: true };
    default:
      return undefined;
  }
}

export function typeaheadIndex(
  labels: string[],
  query: string,
  from: number,
): number | undefined {
  const wanted = query.toLowerCase();
  for (let step = 1; step <= labels.length; step++) {
    const index = (from + step) % labels.length;
    if (labels[index].toLowerCase().startsWith(wanted)) return index;
  }
  return undefined;
}
