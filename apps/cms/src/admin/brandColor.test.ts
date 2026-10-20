import { describe, expect, it } from "vitest";

import {
  checkBrandColor,
  passingShade,
  ratioText,
  brandColorProblem,
  darkTenantColor,
  FALLBACK_TENANT_COLOR,
  normalizeBrandColor,
  tenantColors,
} from "./brandColor";
import { AA_TEXT, contrast } from "./contrast";

describe("brandColor validation (FR-UI-09)", () => {
  it("accepts an empty value and dark hex colours", () => {
    expect(brandColorProblem(undefined)).toBeUndefined();
    expect(brandColorProblem(null)).toBeUndefined();
    expect(brandColorProblem("")).toBeUndefined();
    expect(brandColorProblem("#2a2d7e")).toBeUndefined();
    expect(brandColorProblem("#2A2D7E")).toBeUndefined();
  });

  it("rejects anything that isn't a six-digit hex colour", () => {
    for (const value of ["2a2d7e", "#2a2d7", "#2a2d7e00", "navy", "#ggg000"]) {
      expect(brandColorProblem(value)).toMatch(/six-digit hex/);
    }
  });

  it("rejects colours too light for white text", () => {
    expect(brandColorProblem("#558ed4")).toMatch(/3\.38:1.*4\.5:1/);
    expect(brandColorProblem("#ffffff")).toMatch(/darker colour/);
  });

  it("trims and lowercases before validating", () => {
    expect(normalizeBrandColor("  #2A2D7E ")).toBe("#2a2d7e");
    expect(normalizeBrandColor("   ")).toBeNull();
    expect(normalizeBrandColor(undefined)).toBeUndefined();
  });

  it("falls back to a safe colour when none is stored", () => {
    expect(brandColorProblem(FALLBACK_TENANT_COLOR)).toBeUndefined();
  });
});

describe("tenant card colours", () => {
  it("uses the stored colour in light mode", () => {
    expect(tenantColors("#2a2d7e").light).toBe("#2a2d7e");
    expect(tenantColors(null).light).toBe(FALLBACK_TENANT_COLOR);
    expect(tenantColors("#558ed4").light).toBe(FALLBACK_TENANT_COLOR);
  });

  it("lightens the same hue for dark mode, close to the design's DKU value", () => {
    const dark = darkTenantColor("#2a2d7e");
    const channels = (hex: string) =>
      [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const designDark = channels("#3b3fa6");

    expect(dark).not.toBe("#2a2d7e");
    channels(dark).forEach((value, i) =>
      expect(Math.abs(value - designDark[i])).toBeLessThanOrEqual(12),
    );
  });

  it.each([
    "#2a2d7e",
    "#000000",
    "#1f7a4d",
    "#7a1f1f",
    "#595959",
    FALLBACK_TENANT_COLOR,
  ])("keeps white text at AA on the dark-mode colour of %s", (hex) => {
    expect(contrast(darkTenantColor(hex), "#ffffff")).toBeGreaterThanOrEqual(
      AA_TEXT,
    );
  });
});

describe("live contrast check (FR-UI-97)", () => {
  it("passes a dark colour with its ratio", () => {
    expect(checkBrandColor("#2A2D7E")).toEqual({
      state: "passes",
      color: "#2a2d7e",
      ratio: "11.8 : 1",
    });
  });

  it("flags a light colour and suggests a darker shade that passes", () => {
    const check = checkBrandColor("#6FC2A8");
    expect(check).toMatchObject({ state: "too-light", ratio: "2.1 : 1" });
    const suggestion = (check as { suggestion: string }).suggestion;
    expect(contrast(suggestion, "#ffffff")).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("never rounds a failing ratio up to the threshold", () => {
    expect(ratioText(4.499)).toBe("4.4 : 1");
  });

  it("separates empty from malformed input", () => {
    expect(checkBrandColor("  ")).toEqual({ state: "empty" });
    expect(checkBrandColor("#12")).toMatchObject({ state: "invalid" });
  });

  it("leaves a passing colour unchanged when asked for a shade", () => {
    expect(passingShade("#2a2d7e")).toBe("#2a2d7e");
  });
});
