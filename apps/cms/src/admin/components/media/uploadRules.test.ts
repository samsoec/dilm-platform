import { describe, expect, it } from "vitest";

import { checkImageFile, progressText } from "./uploadRules";

const MB = 1024 * 1024;

describe("checkImageFile (M-01, FR-UI-79)", () => {
  it.each([
    ["plant.jpg", "image/jpeg", 3.9 * MB],
    ["team.webp", "image/webp", 4 * MB],
    ["lab.png", "image/png", 1 * MB],
    ["logo.svg", "image/svg+xml", 0.9 * MB],
  ])("accepts %s", (name, type, size) => {
    expect(checkImageFile({ name, type, size })).toEqual({ ok: true });
  });

  it("rejects other types with the M-01 message", () => {
    expect(
      checkImageFile({ name: "hero-raw.tiff", type: "image/tiff", size: MB }),
    ).toEqual({
      ok: false,
      message: "TIFF isn't supported. Use JPG, PNG, WebP or SVG.",
    });
  });

  it("rejects photos over 4 MB and SVGs over 1 MB", () => {
    expect(
      checkImageFile({ name: "big.png", type: "image/png", size: 6.3 * MB }),
    ).toEqual({
      ok: false,
      message: "big.png is 6.3 MB. The limit is 4 MB. Resize it and try again.",
    });
    expect(
      checkImageFile({
        name: "logo.svg",
        type: "image/svg+xml",
        size: 1.5 * MB,
      }),
    ).toMatchObject({ ok: false, message: expect.stringContaining("1 MB") });
  });

  it("writes progress like the design", () => {
    expect(progressText(2.1 * MB, 3.4 * MB)).toBe("2.1 of 3.4 MB");
  });
});
