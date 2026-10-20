import type { IconName } from "../../icons";

export type TrashSlug = "ir-documents" | "media";

export const TRASH_EMPTY = "Nothing in the trash.";

export const TRASH_TRANSLATIONS = {
  en: { general: { noTrashResults: TRASH_EMPTY } },
  id: { general: { noTrashResults: TRASH_EMPTY } },
};

export type TrashCopy = {
  allLabel: string;
  icon: IconName;
  restoreBody: string;
  restoreToast: string;
  deleteBody: (company: string) => string;
  note?: string;
};

export const TRASH_COPY: Record<TrashSlug, TrashCopy> = {
  "ir-documents": {
    allLabel: "All documents",
    icon: "picture_as_pdf",
    restoreBody:
      "It comes back as a Draft, so it isn't on the website until someone publishes it.",
    restoreToast: "It's back as a Draft.",
    deleteBody: (company) =>
      `The PDF and its history are erased from ${company}. This can't be undone.`,
    note: "Restore returns it as a Draft.",
  },
  media: {
    allLabel: "All images",
    icon: "image",
    restoreBody: "It goes back to the media library.",
    restoreToast: "It's back in the media library.",
    deleteBody: (company) =>
      `The image file is erased from ${company}. Pages that used it will show no image. This can't be undone.`,
  },
};

export function isTrashView(params: unknown): boolean {
  const segments = (params as { segments?: unknown } | undefined)?.segments;
  return Array.isArray(segments) && segments[2] === "trash";
}

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function trashedText(value: unknown): string {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : DAY.format(date).replace("Sept", "Sep");
}

export function firstName(person: unknown): string {
  if (!person || typeof person !== "object") return "—";
  const name = (person as { name?: unknown }).name;
  return typeof name === "string" && name.trim()
    ? name.trim().split(/\s+/)[0]
    : "—";
}
