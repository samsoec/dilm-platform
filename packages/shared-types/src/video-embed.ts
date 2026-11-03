export const VIDEO_URL_MESSAGE = "Use a YouTube or Vimeo link.";

export const VIDEO_FRAME_SOURCES = [
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
] as const;

export type VideoProvider = "youtube" | "vimeo";

export type ParsedVideo = {
  provider: VideoProvider;
  id: string;
  hash?: string;
};

const YOUTUBE_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "www.youtube-nocookie.com",
];

const VIMEO_HOSTS = ["vimeo.com", "www.vimeo.com", "player.vimeo.com"];

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

const VIMEO_ID = /^\d{5,}$/;

const VIMEO_HASH = /^[A-Za-z0-9]{6,}$/;

function toUrl(value: string) {
  try {
    return new URL(value.trim());
  } catch {
    return undefined;
  }
}

type ParsedUrl = NonNullable<ReturnType<typeof toUrl>>;

function parseYoutube(url: ParsedUrl): ParsedVideo | undefined {
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  if (url.hostname === "youtu.be") {
    id = parts[0];
  } else if (YOUTUBE_HOSTS.includes(url.hostname)) {
    if (parts[0] === "watch" && parts.length === 1) {
      id = url.searchParams.get("v") ?? undefined;
    } else if (["embed", "shorts", "live", "v"].includes(parts[0])) {
      id = parts[1];
    }
  }
  return id && YOUTUBE_ID.test(id) ? { provider: "youtube", id } : undefined;
}

function parseVimeo(url: ParsedUrl): ParsedVideo | undefined {
  if (!VIMEO_HOSTS.includes(url.hostname)) return undefined;
  const parts = url.pathname.split("/").filter(Boolean);
  const start = parts[0] === "video" || parts[0] === "channels" ? 1 : 0;
  const rest = parts[0] === "channels" ? parts.slice(2) : parts.slice(start);
  const id = rest[0];
  if (!id || !VIMEO_ID.test(id)) return undefined;
  const candidate = rest[1] ?? url.searchParams.get("h") ?? undefined;
  const hash = candidate && VIMEO_HASH.test(candidate) ? candidate : undefined;
  return { provider: "vimeo", id, ...(hash ? { hash } : {}) };
}

export function parseVideoUrl(value: unknown): ParsedVideo | undefined {
  if (typeof value !== "string") return undefined;
  const url = toUrl(value);
  if (!url) return undefined;
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
  if (url.username || url.password) return undefined;
  return parseYoutube(url) ?? parseVimeo(url);
}

export function isSupportedVideoUrl(value: unknown): boolean {
  return parseVideoUrl(value) !== undefined;
}

export function videoEmbedUrl(value: unknown): string | undefined {
  const video = parseVideoUrl(value);
  if (!video) return undefined;
  if (video.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${video.id}`;
  }
  const hash = video.hash ? `&h=${video.hash}` : "";
  return `https://player.vimeo.com/video/${video.id}?dnt=1${hash}`;
}

export function frameSrcDirective(extra: readonly string[] = []): string {
  return `frame-src ${[...extra, ...VIDEO_FRAME_SOURCES].join(" ")}`;
}
