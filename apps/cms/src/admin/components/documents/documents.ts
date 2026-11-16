import { IR_MAX_UPLOAD_BYTES } from "../../../uploads/irFiles";
import type { IconName } from "../../icons";
import { fileSizeText } from "../ir/irEditor";

export const DOCUMENT_EMPTY_TEXT =
  "No data sheets yet. Upload PDS and SDS files once, then link them from product variants.";

export const DOCUMENT_LIMIT_TEXT = "PDF only · up to 50 MB";

export const MEDIA_LIBRARY_LABEL = "Media library";

export type LinkStatus = "live" | "draft" | "unused";

export const LINK_STATUS_CHIPS: Record<
  LinkStatus,
  { icon: IconName; label: string; tone: "ok" | "neutral" }
> = {
  live: { icon: "public", label: "Live", tone: "ok" },
  draft: { icon: "edit_note", label: "Draft only", tone: "neutral" },
  unused: { icon: "link_off", label: "Not used", tone: "neutral" },
};

export function usageStatus(count: number, live: number): LinkStatus {
  if (count === 0) return "unused";
  return live > 0 ? "live" : "draft";
}

export function isLinkStatus(value: unknown): value is LinkStatus {
  return value === "live" || value === "draft" || value === "unused";
}

export type DocumentCheck =
  | { ok: true }
  | {
      ok: false;
      kind: "image" | "type" | "size";
      message: string;
    };

export function megabytes(bytes: number): number {
  return Math.round(bytes / 1024 / 1024);
}

export function checkDocumentFile(file: {
  name: string;
  type: string;
  size: number;
}): DocumentCheck {
  const isImage =
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|avif|svg|heic|tiff?|bmp)$/i.test(file.name);
  if (isImage) {
    return {
      ok: false,
      kind: "image",
      message: `${file.name} is an image. Documents takes PDFs only. Add images in the`,
    };
  }
  if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name)) {
    return {
      ok: false,
      kind: "type",
      message: `${file.name} is not a PDF. Documents takes PDFs only.`,
    };
  }
  if (file.size > IR_MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      kind: "size",
      message: `${file.name} is ${megabytes(file.size)} MB. The limit is ${megabytes(IR_MAX_UPLOAD_BYTES)} MB. Compress it or split it.`,
    };
  }
  return { ok: true };
}

export function percentDone(loaded: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.floor((loaded / total) * 100));
}

export function stoppedText(percent: number): string {
  return `Upload stopped at ${percent}%: connection lost.`;
}

export function uploadingText(percent: number): string {
  return `Uploading · ${percent}%`;
}

export function usedInCountText(count: number): string {
  return count === 0 ? "—" : String(count);
}

export function documentSizeText(bytes: unknown): string {
  return fileSizeText(bytes) ?? "—";
}

export function uploadedText(value: unknown): string {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function replaceConfirmTitle(count: number): string {
  return count > 0
    ? `Replace the PDF used in ${count} ${count === 1 ? "place" : "places"}?`
    : "Replace the PDF?";
}

export function replaceConfirmBody(count: number, name: string): string {
  return count > 0
    ? `${name} replaces the current file. Every link to this document, in product variants and posts, serves the new file once it's saved.`
    : `${name} replaces the current file.`;
}

export function trashBlockedNote(live: number): string {
  return `Can't be moved to trash while ${live} published ${live === 1 ? "place links" : "places link"} it. Unlink it or replace the file instead.`;
}

export const MAX_PARALLEL_UPLOADS = 3;

export function slotsFree(
  states: string[],
  limit: number = MAX_PARALLEL_UPLOADS,
): number {
  return Math.max(0, limit - states.filter((s) => s === "uploading").length);
}

export function nextQueued<T extends { state: string }>(
  entries: T[],
  limit: number = MAX_PARALLEL_UPLOADS,
): T[] {
  return entries
    .filter((entry) => entry.state === "queued")
    .slice(
      0,
      slotsFree(
        entries.map((entry) => entry.state),
        limit,
      ),
    );
}
