import { describe, expect, it } from "vitest";

import { listboxKey, typeaheadIndex } from "./listbox";

describe("tenant switch keyboard (FR-UI-16, NFR-UI-02)", () => {
  it("moves with the arrow keys and stops at either end", () => {
    expect(listboxKey("ArrowDown", 0, 3)).toEqual({ index: 1 });
    expect(listboxKey("ArrowDown", 2, 3)).toEqual({ index: 2 });
    expect(listboxKey("ArrowUp", 1, 3)).toEqual({ index: 0 });
    expect(listboxKey("ArrowUp", 0, 3)).toEqual({ index: 0 });
  });

  it("jumps to the first and last option", () => {
    expect(listboxKey("Home", 2, 3)).toEqual({ index: 0 });
    expect(listboxKey("End", 0, 3)).toEqual({ index: 2 });
  });

  it("selects with Enter or Space and closes with Escape or Tab", () => {
    expect(listboxKey("Enter", 1, 3)).toEqual({ select: true });
    expect(listboxKey(" ", 1, 3)).toEqual({ select: true });
    expect(listboxKey("Escape", 1, 3)).toEqual({ close: true });
    expect(listboxKey("Tab", 1, 3)).toEqual({ close: true });
  });

  it("ignores other keys", () => {
    expect(listboxKey("a", 1, 3)).toBeUndefined();
    expect(listboxKey("ArrowDown", 0, 0)).toBeUndefined();
  });

  it("finds the next option starting with the typed letters", () => {
    const labels = [
      "Dunia Kimia Utama",
      "Indonesian Acids Industry",
      "Liku Telaga",
    ];

    expect(typeaheadIndex(labels, "l", 0)).toBe(2);
    expect(typeaheadIndex(labels, "d", 0)).toBe(0);
    expect(typeaheadIndex(labels, "ind", 2)).toBe(1);
    expect(typeaheadIndex(labels, "x", 0)).toBeUndefined();
  });
});
