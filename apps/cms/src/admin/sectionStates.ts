import {
  DETAIL_TYPE_LABELS,
  entityPlaceholders,
  isBlockInContext,
  TEMPLATE_BLOCK_RECORD_TYPES,
  wrongContextMessage,
  type DetailRecordType,
  type EntityRecord,
} from "@dilm/shared-types";

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

export const PIN_HINT_EMPTY = "No pin on the profile · set x and y below.";

export const CONSENT_LINKS_HINT =
  "Links only. The text must link to the company's Privacy Policy (UU PDP).";

export const FORM_FIELDS_NOTE =
  "The fields are fixed under UU PDP (data minimisation). You can change their wording only.";

export type SectionContext = {
  collection?: string | null;
  recordType?: string | null;
};

export type SectionNote = {
  tone: "info" | "warning";
  text: string;
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

export const OVERRIDABLE = ["label", "title", "description"] as const;
export type Overridable = (typeof OVERRIDABLE)[number];

export type FieldState =
  | { kind: "none" }
  | { kind: "profile"; placeholder: string }
  | { kind: "overridden" };

export function overrideState(
  field: Overridable | "regions",
  own: unknown,
  entity: EntityRecord | null | undefined,
): FieldState {
  const filled = Array.isArray(own)
    ? own.length > 0
    : typeof own === "string" && own.trim() !== "";
  if (filled) return entity ? { kind: "overridden" } : { kind: "none" };
  const placeholders = entityPlaceholders(entity);
  const value =
    field === "regions" ? placeholders.regions.join(", ") : placeholders[field];
  return value ? { kind: "profile", placeholder: value } : { kind: "none" };
}

export function pinNote(
  own: { x?: unknown; y?: unknown } | null | undefined,
  entity: EntityRecord | null | undefined,
): { text: string; canReset: boolean } {
  if (typeof own?.x === "number" && typeof own?.y === "number") {
    return {
      text: `Overridden · x ${own.x}% y ${own.y}%`,
      canReset: Boolean(entity),
    };
  }
  const { pinX, pinY } = entityPlaceholders(entity);
  if (pinX !== null && pinY !== null) {
    return {
      text: `From profile · x ${pinX}% y ${pinY}% · Place differently below`,
      canReset: false,
    };
  }
  return { text: PIN_HINT_EMPTY, canReset: false };
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

export function pinPaths(notePath: string): { x: string; y: string } {
  const parent = notePath.slice(0, notePath.lastIndexOf("."));
  return { x: `${parent}.pin.x`, y: `${parent}.pin.y` };
}
