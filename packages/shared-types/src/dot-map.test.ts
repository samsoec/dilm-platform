import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  dotMapDots,
  dotMapSvg,
  nudgePin,
  pinFromPoint,
  pinToViewBox,
} from "./dot-map";

describe("dot map", () => {
  it("ships the same SVG the code draws", () => {
    const file = readFileSync(
      new URL("./dot-map.svg", import.meta.url),
      "utf8",
    );
    expect(file.trim()).toBe(dotMapSvg());
  });

  it("has dots over Java and none in the open sea", () => {
    const dots = dotMapDots();
    expect(dots.length).toBeGreaterThan(300);
    expect(dots.some(([x, y]) => x === 305 && y === 265)).toBe(true);
    expect(dots.some(([x, y]) => x === 5 && y === 5)).toBe(false);
  });

  it("converts a click to percentages and back", () => {
    const box = { left: 100, top: 50, width: 400, height: 200 };
    expect(pinFromPoint(box, 300, 150)).toEqual({ x: 50, y: 50 });
    expect(pinFromPoint(box, 0, 900)).toEqual({ x: 0, y: 100 });
    expect(pinFromPoint({ ...box, width: 0 }, 1, 1)).toBeNull();
    expect(pinToViewBox({ x: 50, y: 50 })).toEqual({ cx: 460, cy: 170 });
  });

  it("nudges with the arrow keys and stays on the map", () => {
    expect(nudgePin({ x: 10, y: 10 }, "ArrowRight")).toEqual({
      x: 10.5,
      y: 10,
    });
    expect(nudgePin({ x: 10, y: 10 }, "ArrowUp", true)).toEqual({
      x: 10,
      y: 5,
    });
    expect(nudgePin({ x: 0, y: 0 }, "ArrowLeft")).toEqual({ x: 0, y: 0 });
    expect(nudgePin(null, "ArrowDown")).toEqual({ x: 50, y: 50 });
    expect(nudgePin({ x: 1, y: 1 }, "a")).toBeNull();
  });
});
