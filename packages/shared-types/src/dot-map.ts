export const DOT_MAP_WIDTH = 920;
export const DOT_MAP_HEIGHT = 340;
export const DOT_MAP_SPACING = 10;
export const DOT_MAP_RADIUS = 2.4;

const PER_DEGREE = 20;
const WEST = 95;
const NORTH = 6;

type Ring = ReadonlyArray<readonly [number, number]>;

const ISLANDS: ReadonlyArray<Ring> = [
  [
    [95.3, 5.6],
    [98, 4],
    [100, 2],
    [103.5, -1],
    [106, -3],
    [105.8, -5.8],
    [104.5, -5.9],
    [102, -4],
    [100.3, -1],
    [98.5, 1.5],
    [97, 3.5],
  ],
  [
    [105.2, -6.5],
    [108, -6.1],
    [111, -6.5],
    [114.5, -7.7],
    [114.4, -8.7],
    [110, -8.2],
    [106.5, -7.5],
  ],
  [
    [109, 1.5],
    [110, 2],
    [113, 3],
    [116, 4.5],
    [118, 1],
    [117.5, -1],
    [116.5, -3.8],
    [114.5, -4],
    [111.5, -3.3],
    [110, -2.5],
    [109.2, -0.5],
  ],
  [
    [120, 1.2],
    [125, 1.5],
    [124, 0.5],
    [121, -0.8],
    [120, 0.5],
  ],
  [
    [119, -1],
    [121, -1],
    [122.5, -2],
    [123, -4],
    [122, -4.8],
    [120.5, -5.5],
    [119.5, -5.6],
    [119.2, -3.5],
  ],
  [
    [115, -8.3],
    [119, -8.3],
    [124, -9],
    [124, -10.2],
    [119, -9],
    [115, -8.8],
  ],
  [
    [131, -0.8],
    [135, -3.2],
    [138, -1.5],
    [141, -2.6],
    [141, -9],
    [138, -8.3],
    [137, -5],
    [134, -4],
    [132.5, -2.5],
  ],
  [
    [127, 2],
    [128.5, 1],
    [128, -0.5],
    [127.5, 0.5],
  ],
  [
    [128, -3],
    [130.5, -3],
    [130.5, -3.8],
    [128, -3.6],
  ],
];

function inside(ring: Ring, lon: number, lat: number): boolean {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      hit = !hit;
  }
  return hit;
}

export function dotMapDots(): Array<[number, number]> {
  const dots: Array<[number, number]> = [];
  for (let y = DOT_MAP_SPACING / 2; y < DOT_MAP_HEIGHT; y += DOT_MAP_SPACING) {
    for (let x = DOT_MAP_SPACING / 2; x < DOT_MAP_WIDTH; x += DOT_MAP_SPACING) {
      const lon = WEST + x / PER_DEGREE;
      const lat = NORTH - y / PER_DEGREE;
      if (ISLANDS.some((ring) => inside(ring, lon, lat))) dots.push([x, y]);
    }
  }
  return dots;
}

export function dotMapSvg(): string {
  const circles = dotMapDots()
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${DOT_MAP_RADIUS}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DOT_MAP_WIDTH} ${DOT_MAP_HEIGHT}" fill="currentColor">${circles}</svg>`;
}

export type MapPin = { x: number; y: number };

export function pinToViewBox(pin: MapPin): { cx: number; cy: number } {
  return {
    cx: (pin.x / 100) * DOT_MAP_WIDTH,
    cy: (pin.y / 100) * DOT_MAP_HEIGHT,
  };
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value * 10) / 10));
}

export function pinFromPoint(
  box: { left: number; top: number; width: number; height: number },
  clientX: number,
  clientY: number,
): MapPin | null {
  if (box.width <= 0 || box.height <= 0) return null;
  return {
    x: clampPercent(((clientX - box.left) / box.width) * 100),
    y: clampPercent(((clientY - box.top) / box.height) * 100),
  };
}

export const NUDGE_STEP = 0.5;
export const NUDGE_STEP_LARGE = 5;

export function nudgePin(
  pin: MapPin | null,
  key: string,
  large = false,
): MapPin | null {
  const step = large ? NUDGE_STEP_LARGE : NUDGE_STEP;
  const from = pin ?? { x: 50, y: 50 };
  const delta: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  };
  const move = delta[key];
  if (!move) return null;
  if (!pin) return from;
  return {
    x: clampPercent(from.x + move[0]),
    y: clampPercent(from.y + move[1]),
  };
}
