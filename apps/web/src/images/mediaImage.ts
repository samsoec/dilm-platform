export const MEDIA_PREFIX = "media";

const LADDER_NAME = /^w\d+$/;

export type MediaSize = {
  filename?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MediaDoc = {
  filename?: string | null;
  alt: string;
  width?: number | null;
  height?: number | null;
  sizes?: Record<string, MediaSize | undefined> | null;
};

// TODO(DILM-208): choose the production media origin and set the MEDIA_BASE_URL repository variable per stage; unset, images 404 and the CSP img-src gets no media origin.
export function mediaBaseUrl(
  raw: string | undefined = process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
): string {
  const value = (raw ?? "").trim().replace(/\/+$/, "");
  if (value === "") return "";
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    throw new Error("NEXT_PUBLIC_MEDIA_BASE_URL must be an https URL.");
  }
  return value;
}

export function mediaOrigin(raw?: string): string | null {
  const base = mediaBaseUrl(raw);
  return base === "" ? null : new URL(base).origin;
}

function objectUrl(base: string, filename: string): string {
  return `${base}/${MEDIA_PREFIX}/${encodeURIComponent(filename)}`;
}

export function mediaSrc(media: MediaDoc): string | null {
  if (!media.filename) return null;
  const params = new URLSearchParams();
  params.set("o", media.filename);
  if (media.width) params.set("ow", String(media.width));
  for (const [name, size] of Object.entries(media.sizes ?? {})) {
    if (LADDER_NAME.test(name) && size?.filename && size.width) {
      params.set(`s${size.width}`, size.filename);
    }
  }
  return `/${MEDIA_PREFIX}?${params.toString()}`;
}

export function mediaLoader(
  { src, width }: { src: string; width: number; quality?: number },
  base: string = mediaBaseUrl(),
): string {
  const params = new URL(src, "http://media.invalid").searchParams;
  const original = params.get("o") ?? src;
  const steps = [...params.entries()]
    .filter(([key]) => /^s\d+$/.test(key))
    .map(([key, filename]) => ({ width: Number(key.slice(1)), filename }))
    .sort((a, b) => a.width - b.width);
  const originalWidth = Number(params.get("ow")) || Infinity;
  const fit = steps.find((step) => step.width >= width);
  if (fit && fit.width <= originalWidth) return objectUrl(base, fit.filename);
  if (!fit && originalWidth === Infinity && steps.length > 0) {
    return objectUrl(base, steps[steps.length - 1]!.filename);
  }
  return objectUrl(base, original);
}

export function mediaImageProps(media: MediaDoc) {
  const src = mediaSrc(media);
  if (!src || !media.width || !media.height) return null;
  return {
    src,
    alt: media.alt,
    width: media.width,
    height: media.height,
    style: { height: "auto", aspectRatio: `${media.width} / ${media.height}` },
  };
}
