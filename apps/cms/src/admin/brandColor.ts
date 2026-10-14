import type { FieldHook, TextFieldSingleValidation } from "payload";

import { AA_TEXT, contrast, HEX_COLOR } from "./contrast";

const WHITE = "#ffffff";

export const FALLBACK_TENANT_COLOR = "#3c6394";

const DARK_LIGHTNESS_STEP = 0.11;
const DARK_SATURATION_SCALE = 0.9;

export function normalizeBrandColor(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value.trim().toLowerCase() || null;
}

export const normalizeBrandColorHook: FieldHook = ({ value }) =>
  normalizeBrandColor(value);

export function brandColorProblem(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value !== "string" || !HEX_COLOR.test(value)) {
    return "Use a six-digit hex colour, like #2a2d7e.";
  }
  const ratio = contrast(value, WHITE);
  if (ratio < AA_TEXT) {
    return `White text on ${value} is only ${ratio.toFixed(2)}:1 and needs at least ${AA_TEXT}:1. Pick a darker colour.`;
  }
  return undefined;
}

export const validateBrandColor: TextFieldSingleValidation = (value) =>
  brandColorProblem(value) ?? true;

type Hsl = { h: number; s: number; l: number };

function toHsl(hex: string): Hsl {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h =
    max === r
      ? ((g - b) / d + 6) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function toHex({ h, s, l }: Hsl): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return `#${[r, g, b]
    .map((channel) =>
      Math.round((channel + m) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function darkTenantColor(hex: string): string {
  const { h, s, l } = toHsl(hex);
  let lightness = Math.min(1, l + DARK_LIGHTNESS_STEP);
  let candidate = toHex({ h, s: s * DARK_SATURATION_SCALE, l: lightness });
  while (contrast(candidate, WHITE) < AA_TEXT && lightness > 0) {
    lightness = Math.max(0, lightness - 0.01);
    candidate = toHex({ h, s: s * DARK_SATURATION_SCALE, l: lightness });
  }
  return candidate;
}

export type TenantColors = { light: string; dark: string };

export function tenantColors(brandColor: unknown): TenantColors {
  const light =
    typeof brandColor === "string" &&
    HEX_COLOR.test(brandColor) &&
    !brandColorProblem(brandColor)
      ? brandColor.toLowerCase()
      : FALLBACK_TENANT_COLOR;
  return { light, dark: darkTenantColor(light) };
}
