import { describe, expect, it } from "vitest";

import {
  fileSize,
  hasAlt,
  imageCount,
  isGridView,
  mediaIntro,
  mediaView,
  originalText,
  thumbnail,
  sizesText,
  uploadedText,
  usageQuery,
  usedAsText,
  usesOf,
} from "./media";

describe("media view helpers", () => {
  it("only treats the grid segment as the grid view", () => {
    expect(isGridView({ segments: ["collections", "media", "grid"] })).toBe(
      true,
    );
    expect(isGridView({ segments: ["collections", "media"] })).toBe(false);
    expect(isGridView({ segments: ["collections", "media", "trash"] })).toBe(
      false,
    );
    expect(isGridView(undefined)).toBe(false);
  });

  it("falls back to the list view for unknown preferences", () => {
    expect(mediaView("grid")).toBe("grid");
    expect(mediaView("table")).toBe("list");
    expect(mediaView(undefined)).toBe("list");
  });

  it("counts images", () => {
    expect(imageCount(1)).toBe("1 image");
    expect(imageCount(48)).toBe("48 images");
  });

  it("uses the thumbnail size, or the original when it was too small to resize", () => {
    expect(
      thumbnail({
        url: "/a.png",
        sizes: { thumbnail: { url: "/a-400x300.png" } },
      }),
    ).toEqual({ url: "/a-400x300.png", original: false });
    expect(
      thumbnail({ url: "/logo.png", sizes: { thumbnail: { url: null } } }),
    ).toEqual({
      url: "/logo.png",
      original: true,
    });
    expect(thumbnail({})).toBeUndefined();
  });

  it("flags blank alt text", () => {
    expect(hasAlt("A plant")).toBe(true);
    expect(hasAlt("  ")).toBe(false);
    expect(hasAlt(null)).toBe(false);
  });
});

describe("media detail text", () => {
  it("formats file sizes", () => {
    expect(fileSize(512)).toBe("512 B");
    expect(fileSize(38 * 1024)).toBe("38 KB");
    expect(fileSize(2.1 * 1024 * 1024)).toBe("2.1 MB");
    expect(fileSize(undefined)).toBeUndefined();
  });

  it("describes the original file", () => {
    expect(
      originalText({ id: 1, width: 1200, height: 400, filesize: 38 * 1024 }),
    ).toBe("1200 × 400 · 38 KB");
    expect(originalText({ id: 1 })).toBe("—");
  });

  it("lists the sizes that were made", () => {
    expect(
      sizesText({
        thumbnail: { url: "/a-400x300.png", width: 400, height: 300 },
        card: { url: "/a-768x512.png", width: 768, height: 512 },
        "social-share": { url: "/a-1200x630.png", width: 1200, height: 630 },
      }),
    ).toBe("Thumbnail 400 × 300 · Card 768 × 512 · Social share 1200 × 630");
    expect(
      sizesText({
        thumbnail: { url: "/a-400x300.png", width: 400, height: 300 },
        card: { url: null },
      }),
    ).toBe("Thumbnail 400 × 300");
  });

  it("explains when an image was too small for any size", () => {
    expect(sizesText({ thumbnail: { url: null } })).toBe(
      "None. The original is smaller than every size, so it's used as is.",
    );
  });

  it("falls back to the configured sizes when none are reported", () => {
    expect(sizesText(undefined)).toBe(
      "Thumbnail 400 × 300 · Card 768 wide · Social share 1200 × 630",
    );
  });

  it("names the uploader, or marks imported files", () => {
    const createdAt = "2026-09-02T03:00:00.000Z";
    expect(
      uploadedText({
        id: 1,
        createdAt,
        uploadedBy: { id: 4, name: "Dimas Pratama" },
      }),
    ).toBe("2 Sep 2026 by Dimas");
    expect(uploadedText({ id: 1, createdAt, uploadedBy: null })).toBe(
      "2 Sep 2026 · Imported",
    );
  });

  it("introduces the library with the company domain", () => {
    expect(mediaIntro("duniakimia.com")).toBe(
      "Images for duniakimia.com. Every upload is public and gets three resized copies.",
    );
  });
});

describe("media usage", () => {
  it("finds where an image is used", () => {
    const uses = usesOf(7, {
      footer: [{ partOf: { logo: 7 } }],
      "tenant-settings": [
        { brand: { logoOnLight: { id: 7 }, logoOnDark: 8 }, defaultSeo: {} },
      ],
    });
    expect(uses.map(({ path }) => path)).toEqual([
      "partOf.logo",
      "brand.logoOnLight",
    ]);
    expect(usedAsText(uses)).toBe(
      'Used as the footer "Part of" logo and the logo for light backgrounds.',
    );
  });

  it("says nothing for unused images", () => {
    expect(usesOf(7, { footer: [{ partOf: { logo: 9 } }] })).toEqual([]);
    expect(usedAsText([])).toBeUndefined();
  });

  it("asks each collection only for its own fields", () => {
    const footer = new URLSearchParams(usageQuery("footer", 7));
    expect(footer.get("where[or][0][partOf.logo][equals]")).toBe("7");
    expect(footer.has("where[or][1][brand.logoOnLight][equals]")).toBe(false);
    const settings = new URLSearchParams(usageQuery("tenant-settings", 7));
    expect(settings.get("where[or][2][defaultSeo.ogImage][equals]")).toBe("7");
  });
});
