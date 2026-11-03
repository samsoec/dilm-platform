import { describe, expect, it } from "vitest";

import {
  VIDEO_FRAME_SOURCES,
  VIDEO_URL_MESSAGE,
  frameSrcDirective,
  isSupportedVideoUrl,
  parseVideoUrl,
  videoEmbedUrl,
} from "./video-embed";

describe("video links (FR-PM-64)", () => {
  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/watch?v=dQw4w9WgXcQ&t=10s",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  ])("accepts the YouTube link %s", (url) => {
    expect(parseVideoUrl(url)).toEqual({
      provider: "youtube",
      id: "dQw4w9WgXcQ",
    });
  });

  it.each([
    "https://vimeo.com/76979871",
    "https://www.vimeo.com/76979871",
    "https://player.vimeo.com/video/76979871",
    "https://vimeo.com/channels/staffpicks/76979871",
  ])("accepts the Vimeo link %s", (url) => {
    expect(parseVideoUrl(url)).toEqual({ provider: "vimeo", id: "76979871" });
  });

  it("keeps the privacy hash of an unlisted Vimeo video", () => {
    expect(parseVideoUrl("https://vimeo.com/76979871/abc123def4")).toEqual({
      provider: "vimeo",
      id: "76979871",
      hash: "abc123def4",
    });
    expect(videoEmbedUrl("https://vimeo.com/76979871/abc123def4")).toBe(
      "https://player.vimeo.com/video/76979871?dnt=1&h=abc123def4",
    );
  });

  it.each([
    "",
    "not a link",
    "https://example.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com.evil.test/watch?v=dQw4w9WgXcQ",
    "https://evil.test/https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://user:pw@www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/",
    "https://vimeo.com/about",
    "https://vimeo.com/",
    "javascript:alert(1)",
    "ftp://youtu.be/dQw4w9WgXcQ",
  ])("refuses %j", (url) => {
    expect(isSupportedVideoUrl(url)).toBe(false);
    expect(videoEmbedUrl(url)).toBeUndefined();
  });

  it("refuses values that are not text", () => {
    expect(parseVideoUrl(undefined)).toBeUndefined();
    expect(parseVideoUrl(42)).toBeUndefined();
  });

  it("words the refusal like the design (PS-04)", () => {
    expect(VIDEO_URL_MESSAGE).toBe("Use a YouTube or Vimeo link.");
  });
});

describe("privacy-enhanced players", () => {
  it("embeds YouTube from youtube-nocookie.com", () => {
    expect(videoEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("embeds Vimeo from player.vimeo.com with dnt=1", () => {
    expect(videoEmbedUrl("https://vimeo.com/76979871")).toBe(
      "https://player.vimeo.com/video/76979871?dnt=1",
    );
  });

  it("allows exactly those two hosts as CSP frame sources", () => {
    expect([...VIDEO_FRAME_SOURCES]).toEqual([
      "https://www.youtube-nocookie.com",
      "https://player.vimeo.com",
    ]);
    expect(frameSrcDirective()).toBe(
      "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
    );
    expect(frameSrcDirective(["'self'"])).toBe(
      "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com",
    );
  });
});
