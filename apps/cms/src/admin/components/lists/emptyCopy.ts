import type { IconName } from "../../icons";
import { UPLOAD_LIMITS_TEXT } from "../media/uploadRules";

export type EmptyStateSlug =
  "cv-submissions" | "ir-documents" | "media" | "consent-logs";

export type EmptyStateCopy = {
  icon: IconName;
  title: string;
  lines: string[];
};

export type EmptyStateContext = { company?: string; domain?: string };

export const RECRUITER_BANNER =
  "Set a recruiter email first so someone hears about new applications.";

export function isEmptyStateSlug(slug: unknown): slug is EmptyStateSlug {
  return (
    slug === "cv-submissions" ||
    slug === "ir-documents" ||
    slug === "media" ||
    slug === "consent-logs"
  );
}

export function hasActiveQuery(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): boolean {
  return Object.entries(searchParams ?? {}).some(([key, value]) => {
    if (key.startsWith("where")) return true;
    if (key !== "search") return false;
    return (Array.isArray(value) ? value : [value]).some(
      (item) => typeof item === "string" && item.trim() !== "",
    );
  });
}

export function emptyCopy(
  slug: EmptyStateSlug,
  { company, domain }: EmptyStateContext,
): EmptyStateCopy {
  switch (slug) {
    case "cv-submissions":
      return {
        icon: "badge",
        title: "No applications yet",
        lines: [
          `They arrive here automatically when someone applies on the careers page of ${domain ?? "the company website"}.`,
        ],
      };
    case "ir-documents":
      return {
        icon: "description",
        title: "No IR documents for this site yet",
        lines: [
          "They go live on the Investor page within minutes of publishing.",
        ],
      };
    case "media":
      return {
        icon: "photo_library",
        title: `No images for ${company ?? "this company"} yet`,
        lines: [
          UPLOAD_LIMITS_TEXT,
          "Each image needs alt text, and every upload is public.",
        ],
      };
    case "consent-logs":
      return {
        icon: "verified_user",
        title: "No consent records yet",
        lines: ["They're written automatically when visitors submit forms."],
      };
  }
}

const NO_MATCH_ITEMS: Record<EmptyStateSlug, string> = {
  "cv-submissions": "applications",
  "ir-documents": "IR documents",
  media: "images",
  "consent-logs": "consent records",
};

export function noMatchesTitle(slug: EmptyStateSlug): string {
  return `No ${NO_MATCH_ITEMS[slug]} match these filters`;
}
