import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const adminDir = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.join(adminDir, "styles");
const fontsDir = path.join(adminDir, "fonts");

const AA_TEXT = 4.5;
const AA_UI = 3;

function block(source: string, selector: string): string {
  const start = source.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No ${selector} block in tokens.scss`);
  return source.slice(start, source.indexOf("}", start));
}

function colours(css: string): Record<string, string> {
  return Object.fromEntries(
    [...css.matchAll(/--dil-([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(
      ([, name, hex]) => [name, hex.toLowerCase()],
    ),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const tokens = readFileSync(path.join(stylesDir, "tokens.scss"), "utf8");
const light = colours(block(tokens, ":root"));
const themes = {
  light,
  dark: { ...light, ...colours(block(tokens, 'html[data-theme="dark"]')) },
};

const TEXT_PAIRS: [string, string][] = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["ink", "surface-2"],
  ["ink-2", "surface"],
  ["ink-2", "surface-2"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["muted", "surface-2"],
  ["brand-ink", "bg"],
  ["brand-ink", "surface"],
  ["on-action", "action"],
  ["on-action", "action-hover"],
  ["sel-ink", "sel-bg"],
  ["warn", "warn-bg"],
  ["ok", "ok-bg"],
  ["danger", "danger-bg"],
  ["danger", "surface"],
  ["tenant-ink", "tenant-soft"],
];

const UI_PAIRS: [string, string][] = [
  ["brand", "surface"],
  ["brand", "bg"],
];

describe("admin theme tokens", () => {
  it("gives dark mode a value for every light colour token", () => {
    const dark = colours(block(tokens, 'html[data-theme="dark"]'));
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  describe.each(Object.entries(themes))("%s theme", (_, palette) => {
    it.each(TEXT_PAIRS)("%s on %s meets AA for text", (fg, bg) => {
      expect(palette[fg], `--dil-${fg}`).toBeDefined();
      expect(palette[bg], `--dil-${bg}`).toBeDefined();
      expect(contrast(palette[fg], palette[bg])).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
    });

    it.each(UI_PAIRS)("%s on %s meets AA for UI components", (fg, bg) => {
      expect(contrast(palette[fg], palette[bg])).toBeGreaterThanOrEqual(AA_UI);
    });
  });
});

describe("admin stylesheets", () => {
  const sheets = readdirSync(stylesDir).map((file) => ({
    file,
    css: readFileSync(path.join(stylesDir, file), "utf8"),
  }));

  it.each(sheets)("$file never uses !important", ({ css }) => {
    expect(css).not.toMatch(/!important/);
  });

  it.each(sheets)(
    "$file never pulls in Tailwind or Google Fonts",
    ({ css }) => {
      expect(css).not.toMatch(/tailwind|fonts\.(googleapis|gstatic)\.com/i);
    },
  );

  it("orders the dil layer after payload-default", () => {
    expect(tokens.trimStart()).toMatch(/^@layer payload-default, dil;/);
  });

  it("keeps the self-hosted fonts within 250 KB", () => {
    const bytes = readdirSync(fontsDir).reduce(
      (total, file) => total + statSync(path.join(fontsDir, file)).size,
      0,
    );
    expect(bytes).toBeLessThanOrEqual(250 * 1024);
  });
});
