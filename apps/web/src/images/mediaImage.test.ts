import { describe, expect, it } from "vitest";

import {
  mediaBaseUrl,
  mediaImageProps,
  mediaLoader,
  mediaOrigin,
  mediaSrc,
} from "./mediaImage";

const base = "https://media.example.test";
const media = {
  filename: "hero.jpg",
  alt: "Hero",
  width: 3000,
  height: 1500,
  sizes: {
    w640: { filename: "hero-640x320.webp", width: 640, height: 320 },
    w1280: { filename: "hero-1280x640.webp", width: 1280, height: 640 },
    w1920: { filename: "hero-1920x960.webp", width: 1920, height: 960 },
    card: { filename: null, width: null, height: null },
  },
};

describe("mediaLoader", () => {
  const src = mediaSrc(media)!;

  it("picks the smallest ladder step at least as wide as requested", () => {
    expect(mediaLoader({ src, width: 600 }, base)).toBe(
      `${base}/media/hero-640x320.webp`,
    );
    expect(mediaLoader({ src, width: 1000 }, base)).toBe(
      `${base}/media/hero-1280x640.webp`,
    );
  });

  it("falls back to the original when no step is wide enough", () => {
    expect(mediaLoader({ src, width: 2400 }, base)).toBe(
      `${base}/media/hero.jpg`,
    );
  });

  it("uses the widest step when the original width is unknown", () => {
    const unknown = mediaSrc({ ...media, width: null })!;
    expect(mediaLoader({ src: unknown, width: 2400 }, base)).toBe(
      `${base}/media/hero-1920x960.webp`,
    );
  });

  it("serves a bare filename from the original", () => {
    expect(mediaLoader({ src: "a b.png", width: 640 }, base)).toBe(
      `${base}/media/a%20b.png`,
    );
  });
});

describe("mediaImageProps", () => {
  it("carries width, height and aspect ratio from the metadata", () => {
    const props = mediaImageProps(media)!;
    expect(props.width).toBe(3000);
    expect(props.height).toBe(1500);
    expect(props.style.aspectRatio).toBe("3000 / 1500");
  });

  it("refuses an image with no dimensions so layout cannot shift", () => {
    expect(mediaImageProps({ ...media, height: null })).toBeNull();
    expect(mediaImageProps({ ...media, filename: null })).toBeNull();
  });
});

describe("media base url", () => {
  it("is empty when unset and is trimmed of trailing slashes", () => {
    expect(mediaBaseUrl("")).toBe("");
    expect(mediaOrigin("")).toBeNull();
    expect(mediaBaseUrl("https://m.example.test/")).toBe(
      "https://m.example.test",
    );
    expect(mediaOrigin("https://m.example.test/x")).toBe(
      "https://m.example.test",
    );
  });

  it("rejects plain http", () => {
    expect(() => mediaBaseUrl("http://m.example.test")).toThrow(/https/);
  });
});
