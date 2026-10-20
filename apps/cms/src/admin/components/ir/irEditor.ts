const MB = 1024 * 1024;

export const IR_MAX_BYTES = 50 * MB;

export const IR_FILE_LIMIT_TEXT = "PDF only · up to 50 MB";

export const REPLACE_NOTE =
  "You can replace the PDF until the document is first published. After that, corrections go out as a new document.";

export const DRAFT_NOTE = (domain: string) =>
  `Saving a draft changes nothing on ${domain}. Publish when it's ready.`;

export function megabytes(bytes: number): string {
  return (bytes / MB).toFixed(1).replace(/\.0$/, "");
}

export function fileSizeText(bytes: unknown): string | undefined {
  if (typeof bytes !== "number" || !Number.isFinite(bytes)) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${megabytes(bytes)} MB`;
}

export type PdfCheck =
  { ok: true } | { ok: false; title: string; hint: string; retry?: string };

export function checkPdf(file: {
  name: string;
  type: string;
  size: number;
}): PdfCheck {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) {
    return {
      ok: false,
      title: `${file.name} isn't a PDF`,
      hint: "Save it as PDF first.",
    };
  }
  if (file.size > IR_MAX_BYTES) {
    return {
      ok: false,
      title: `${file.name} is ${megabytes(file.size)} MB`,
      hint: "The limit is 50 MB. Compress the PDF and try again.",
      retry: "Choose another",
    };
  }
  return { ok: true };
}

export function progressText(loaded: number, total: number): string {
  return `${megabytes(loaded)} of ${megabytes(total)} MB`;
}

export function titleFromFilename(name: string): string {
  const stem = name.replace(/\.[^.]+$/, "");
  const words = stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return words || "Untitled document";
}

const UPLOADED = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

export function uploadedAtText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const parts = Object.fromEntries(
    UPLOADED.formatToParts(date).map(({ type, value: part }) => [type, part]),
  );
  return `${parts.day} ${String(parts.month).replace("Sept", "Sep")}, ${parts.hour}:${parts.minute}`;
}

export function fileMetaText({
  filesize,
  uploadedAt,
  uploader,
}: {
  filesize: unknown;
  uploadedAt: unknown;
  uploader?: string;
}): string {
  const size = fileSizeText(filesize);
  const when = uploadedAtText(uploadedAt);
  const uploaded = when
    ? `uploaded ${when}${uploader ? ` by ${uploader}` : ""}`
    : undefined;
  return [size, uploaded].filter(Boolean).join(" · ");
}

export type ChecklistItem = { key: string; label: string; done: boolean };

const CHECKLIST: { key: string; done: string; missing: string }[] = [
  { key: "filename", done: "PDF uploaded", missing: "PDF missing" },
  { key: "title", done: "Title", missing: "Title missing" },
  {
    key: "documentType",
    done: "Document type",
    missing: "Document type missing",
  },
  { key: "locale", done: "Language", missing: "Language missing" },
  {
    key: "publishedDate",
    done: "Published date",
    missing: "Published date missing",
  },
];

export const CHECKLIST_PATHS = CHECKLIST.map(({ key }) => key);

function filled(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== null && value !== undefined;
}

export function publishChecklist(
  values: Record<string, unknown>,
): ChecklistItem[] {
  return CHECKLIST.map(({ key, done, missing }) => {
    const ok = filled(values[key]);
    return { key, label: ok ? done : missing, done: ok };
  });
}

export function requiredToPublish(message: string) {
  return (value: unknown) => (filled(value) ? true : message);
}

export const IR_EDITOR_TRANSLATIONS = {
  en: { version: { saveDraft: "Save draft", publishChanges: "Publish" } },
  id: { version: { saveDraft: "Save draft", publishChanges: "Publish" } },
};
