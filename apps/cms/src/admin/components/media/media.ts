import { IMAGE_SIZES } from "../../../storage";

export type MediaView = "list" | "grid";

export const MEDIA_VIEW_PREFERENCE = "media-view";

export const GRID_PATH = "/grid";

export type MediaSize = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MediaDoc = {
  id: number;
  filename?: string | null;
  alt?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  filesize?: number | null;
  createdAt?: string;
  uploadedBy?: number | { id: number; name?: string | null } | null;
  sizes?: Record<string, MediaSize | undefined> | null;
};

export function mediaView(value: unknown): MediaView {
  return value === "grid" ? "grid" : "list";
}

export function isGridView(params: unknown): boolean {
  const segments = (params as { segments?: unknown } | undefined)?.segments;
  return Array.isArray(segments) && segments[2] === GRID_PATH.slice(1);
}

export function imageCount(count: number): string {
  return `${count} ${count === 1 ? "image" : "images"}`;
}

export function hasAlt(alt: unknown): boolean {
  return typeof alt === "string" && alt.trim() !== "";
}

export type Thumbnail = { url: string; original: boolean };

export function thumbnail(
  doc: Pick<MediaDoc, "sizes" | "url">,
): Thumbnail | undefined {
  const sized = doc.sizes?.thumbnail?.url;
  if (sized) return { url: sized, original: false };
  return doc.url ? { url: doc.url, original: true } : undefined;
}

export function previewURL(
  doc: Pick<MediaDoc, "sizes" | "url">,
): string | undefined {
  return doc.sizes?.card?.url || doc.url || undefined;
}

export function fileSize(bytes: unknown): string | undefined {
  if (typeof bytes !== "number" || !Number.isFinite(bytes)) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function originalText(doc: MediaDoc): string {
  const dimensions =
    doc.width && doc.height ? `${doc.width} × ${doc.height}` : undefined;
  return (
    [dimensions, fileSize(doc.filesize)].filter(Boolean).join(" · ") || "—"
  );
}

export function sizeLabel(name: string): string {
  const words = name.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function sizesText(sizes: MediaDoc["sizes"]): string {
  const made = IMAGE_SIZES.flatMap(({ name, width, height }) => {
    const size = sizes?.[name];
    if (sizes && !size?.url) return [];
    const w = size?.width ?? width;
    const h = size?.height ?? height;
    const dimensions = w && h ? `${w} × ${h}` : w ? `${w} wide` : "";
    return [`${sizeLabel(name)} ${dimensions}`.trim()];
  });
  return made.length
    ? made.join(" · ")
    : "None. The original is smaller than every size, so it's used as is.";
}

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function uploadedText(doc: MediaDoc): string {
  const date = doc.createdAt ? new Date(doc.createdAt) : undefined;
  const day =
    date && !Number.isNaN(date.getTime())
      ? DAY.format(date).replace("Sept", "Sep")
      : undefined;
  const uploader =
    doc.uploadedBy && typeof doc.uploadedBy === "object"
      ? doc.uploadedBy.name?.trim().split(/\s+/)[0]
      : undefined;
  if (!doc.uploadedBy) return day ? `${day} · Imported` : "Imported";
  return [day, uploader && `by ${uploader}`].filter(Boolean).join(" ") || "—";
}

export type MediaUse = {
  collection: "footer" | "tenant-settings";
  path: string;
  usedAs: string;
  loses: string;
};

export const MEDIA_USES: readonly MediaUse[] = [
  {
    collection: "footer",
    path: "partOf.logo",
    usedAs: 'the footer "Part of" logo',
    loses: 'The footer will show no "Part of" logo.',
  },
  {
    collection: "tenant-settings",
    path: "brand.logoOnLight",
    usedAs: "the logo for light backgrounds",
    loses: "The header on white and the light footer will show no logo.",
  },
  {
    collection: "tenant-settings",
    path: "brand.logoOnDark",
    usedAs: "the logo for dark backgrounds",
    loses: "The transparent header over photos will show no logo.",
  },
  {
    collection: "tenant-settings",
    path: "defaultSeo.ogImage",
    usedAs: "the default social-share image",
    loses: "Links shared on social media will show no image.",
  },
];

function valueAt(doc: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined,
      doc,
    );
}

function sameId(value: unknown, id: number): boolean {
  const ref =
    value && typeof value === "object" ? (value as { id?: unknown }).id : value;
  return ref === id || (typeof ref === "string" && ref === String(id));
}

export function usesOf(
  id: number,
  docs: Partial<Record<MediaUse["collection"], unknown[]>>,
): MediaUse[] {
  return MEDIA_USES.filter(({ collection, path }) =>
    (docs[collection] ?? []).some((doc) => sameId(valueAt(doc, path), id)),
  );
}

export function usedAsText(uses: readonly MediaUse[]): string | undefined {
  if (uses.length === 0) return undefined;
  const names = uses.map(({ usedAs }) => usedAs);
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `Used as ${list}.`;
}

export function usageQuery(
  collection: MediaUse["collection"],
  id: number,
): string {
  const params = new URLSearchParams({ depth: "0", limit: "10" });
  MEDIA_USES.filter((use) => use.collection === collection).forEach(
    ({ path }, index) =>
      params.set(`where[or][${index}][${path}][equals]`, String(id)),
  );
  return params.toString();
}

const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six"];

export function mediaIntro(domain: string): string {
  const count = IMAGE_SIZES.length;
  return `Images for ${domain}. Every upload is public and gets ${COUNT_WORDS[count] ?? count} resized ${count === 1 ? "copy" : "copies"}.`;
}
