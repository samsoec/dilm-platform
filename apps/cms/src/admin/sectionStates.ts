import {
  DETAIL_TYPE_LABELS,
  isBlockInContext,
  TEMPLATE_BLOCK_RECORD_TYPES,
  wrongContextMessage,
  type DetailRecordType,
} from "@dilm/shared-types";

import {
  CATEGORY_HERO_NOTE,
  CATEGORY_LISTING_NOTE,
  CATEGORY_LISTING_SOURCE_WARNING,
  highlightsCountText,
  NEIGHBOURS_NOTE,
  POST_LEFT_OUT_NOTE,
} from "./components/templates/templates";

export const COMPANY_SETTINGS_PATH = "/admin/collections/tenant-settings";
export const COMPANY_SETTINGS_LINK = "Company settings › Brand, Profile";

export const SHARED_COLLECTIONS: readonly string[] = [
  "shared-pages",
  "shared-detail-templates",
];

export const CURRENT_COMPANY_NOTE =
  "Shows the company of whichever site the page is viewed on. Nothing to pick.";

export const SHARED_CURRENT_COMPANY_NOTE =
  "This page is shared by every website, so each site shows its own company here. Nothing to pick.";

export const GROUP_PICK_NOTE =
  "Logos, names and cover images come from each company's settings.";

export const CONSENT_LINKS_HINT =
  "Links only. The text must link to the company's Privacy Policy (UU PDP).";

export const FORM_FIELDS_NOTE =
  "The fields are fixed under UU PDP (data minimisation). You can change their wording only.";

export type SectionContext = {
  collection?: string | null;
  recordType?: string | null;
  highlights?: unknown;
  source?: unknown;
};

export type SectionNote = {
  tone: "info" | "warning";
  text: string;
  setCurrentCategory?: boolean;
  link?: { href: string; label: string };
};

export function templateOnlyWarning(
  slug: string,
  context: SectionContext,
): string | undefined {
  const types = Object.hasOwn(TEMPLATE_BLOCK_RECORD_TYPES, slug)
    ? TEMPLATE_BLOCK_RECORD_TYPES[slug]
    : undefined;
  if (!types) return undefined;
  const recordType = Object.hasOwn(DETAIL_TYPE_LABELS, context.recordType ?? "")
    ? (context.recordType as DetailRecordType)
    : null;
  if (isBlockInContext(slug, { recordType })) return undefined;
  return wrongContextMessage(types);
}

export function sectionNotes(
  slug: string,
  group: string,
  context: SectionContext,
): SectionNote[] {
  const notes: SectionNote[] = [];
  const warning = templateOnlyWarning(slug, context);
  if (warning) {
    notes.push({
      tone: "warning",
      text: `${warning} You can still save and publish; it renders nothing on the site and a warning in Preview.`,
    });
  }
  if (slug === "postArticle" && context.recordType === "post") {
    notes.push({
      tone: "info",
      text: `Highlighted updates: ${highlightsCountText(context.highlights)}. ${POST_LEFT_OUT_NOTE}`,
    });
    notes.push({ tone: "info", text: NEIGHBOURS_NOTE });
  }
  if (context.recordType === "category") {
    if (slug === "publicationHero") {
      notes.push({ tone: "info", text: CATEGORY_HERO_NOTE });
    }
    if (slug === "postListing") {
      notes.push(
        context.source === "currentCategory"
          ? { tone: "info", text: CATEGORY_LISTING_NOTE }
          : {
              tone: "warning",
              text: CATEGORY_LISTING_SOURCE_WARNING,
              setCurrentCategory: true,
            },
      );
    }
  }
  if (group === "Current company") {
    const shared = SHARED_COLLECTIONS.includes(context.collection ?? "");
    notes.push({
      tone: "info",
      text: shared ? SHARED_CURRENT_COMPANY_NOTE : CURRENT_COMPANY_NOTE,
    });
  }
  if (slug === "groupShowcase" || slug === "entityContacts") {
    notes.push({
      tone: "info",
      text: GROUP_PICK_NOTE,
      link: { href: COMPANY_SETTINGS_PATH, label: COMPANY_SETTINGS_LINK },
    });
  }
  return notes;
}

export function pickedCount(value: unknown, max: number): string {
  const count = Array.isArray(value) ? value.length : 0;
  return `${count} of ${max}`;
}

export function formFieldRows(
  names: readonly string[],
  labels: Record<string, string>,
  values: Record<string, { label?: unknown; placeholder?: unknown }>,
) {
  return names.map((name) => ({
    name,
    field: labels[name] ?? name,
    label: typeof values[name]?.label === "string" ? values[name].label : "",
    placeholder:
      typeof values[name]?.placeholder === "string"
        ? values[name].placeholder
        : "",
  }));
}
