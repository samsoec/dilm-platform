import type {
  ArrayField,
  CollectionSlug,
  Condition,
  Field,
  FieldHook,
  GroupField,
  NumberField,
  RelationshipField,
  RelationshipFieldManyValidation,
  SelectField,
  TextFieldSingleValidation,
  UploadField,
  UploadFieldSingleValidation,
} from "payload";
import {
  ANCHOR_ID_PATTERN,
  BUTTON_STYLES,
  HEADING_ALIGNMENTS,
  ICON_MIME_TYPES,
  RECORD_SOURCES,
  SECTION_BACKGROUNDS,
  type ButtonStyle,
  type HeadingAlignment,
  type RecordSource,
} from "@dilm/shared-types";

import { italicHeadingField } from "../fields/italicHeading";
import { withSameAsEnTag } from "../fields/layoutEditor";
import { link } from "../fields/link";
import { withMediaPicker } from "../fields/mediaPicker";
import { unscopedRelationship } from "../tenancy";

export const MAX_BUTTONS = 2;

export const ICON_PREVIEW_SIZE = 48;

export const BUTTON_STYLE_LABELS: Record<ButtonStyle, string> = {
  primary: "Filled",
  light: "White, for dark backgrounds",
  text: "Text link",
};

export const BACKGROUND_LABELS: Record<
  (typeof SECTION_BACKGROUNDS)[number],
  string
> = {
  default: "Default",
  muted: "Light grey",
  dark: "Dark navy",
  image: "Image",
};

export const ALIGNMENT_LABELS: Record<HeadingAlignment, string> = {
  center: "Centered",
  left: "Left",
  split: "Title left, description right",
};

export const SOURCE_LABELS: Record<RecordSource, string> = {
  manual: "Hand-picked",
  latest: "Latest",
  all: "All",
};

function options<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
) {
  return values.map((value) => ({ value, label: labels[value] }));
}

export function headingTextFields(): Field[] {
  return [
    withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
    italicHeadingField({ name: "title", label: "Title" }),
    withSameAsEnTag({
      name: "description",
      type: "textarea",
      localized: true,
    }),
  ];
}

export function headingField({
  name = "heading",
  align = "center",
}: { name?: string; align?: HeadingAlignment } = {}): GroupField {
  return {
    name,
    type: "group",
    fields: [
      ...headingTextFields(),
      {
        name: "align",
        type: "select",
        required: true,
        defaultValue: align,
        options: options(HEADING_ALIGNMENTS, ALIGNMENT_LABELS),
      },
    ],
  };
}

export const tableNamed =
  (suffix: string): NonNullable<ArrayField["dbName"]> =>
  ({ tableName }) =>
    `${tableName}_${suffix}`;

export function buttonsField({
  name = "buttons",
  maxRows = MAX_BUTTONS,
  tableName,
}: {
  name?: string;
  maxRows?: number;
  tableName?: string;
} = {}): ArrayField {
  return {
    name,
    type: "array",
    ...(tableName ? { dbName: tableNamed(tableName) } : {}),
    minRows: 0,
    maxRows,
    labels: { singular: "Button", plural: "Buttons" },
    fields: [
      link({ name: "link", required: true }),
      {
        name: "style",
        type: "select",
        required: true,
        defaultValue: "primary",
        options: options(BUTTON_STYLES, BUTTON_STYLE_LABELS),
      },
    ],
  };
}

type AppearanceData = { background?: string | null };

const isImageBackground: Condition = (_, siblingData) =>
  (siblingData as AppearanceData | undefined)?.background === "image";

const requireBackgroundImage: UploadFieldSingleValidation = (
  value,
  { siblingData },
) =>
  (siblingData as AppearanceData | undefined)?.background === "image" && !value
    ? "Choose the background image."
    : true;

const clearUnlessImageBackground: FieldHook = ({ value, siblingData }) =>
  (siblingData as AppearanceData | undefined)?.background === "image"
    ? value
    : null;

export const isAnchorId: TextFieldSingleValidation = (value) =>
  !value || ANCHOR_ID_PATTERN.test(value)
    ? true
    : "Use lowercase letters, numbers and hyphens only.";

export function appearanceField({
  name = "appearance",
}: { name?: string } = {}): GroupField {
  return {
    name,
    type: "group",
    fields: [
      {
        name: "background",
        type: "select",
        required: true,
        defaultValue: "default",
        options: options(SECTION_BACKGROUNDS, BACKGROUND_LABELS),
      },
      withMediaPicker(
        {
          name: "backgroundImage",
          type: "upload",
          relationTo: "media",
          validate: requireBackgroundImage,
          hooks: { beforeChange: [clearUnlessImageBackground] },
          admin: { condition: isImageBackground },
        },
        { chooseLabel: "Choose a background image" },
      ),
      {
        name: "anchorId",
        type: "text",
        validate: isAnchorId,
        admin: {
          description:
            "Optional in-page anchor: lowercase letters, numbers and hyphens.",
        },
      },
    ],
  };
}

type PickerData = { source?: RecordSource | null };

const sourceIs =
  (source: RecordSource): Condition =>
  (_, siblingData) =>
    ((siblingData as PickerData | undefined)?.source ?? "manual") === source;

const clearUnlessSource =
  (source: RecordSource): FieldHook =>
  ({ value, siblingData }) =>
    ((siblingData as PickerData | undefined)?.source ?? "manual") === source
      ? value
      : null;

export type RecordPickerOptions = {
  collection: CollectionSlug;
  sources?: readonly RecordSource[];
  defaultSource?: RecordSource;
  label?: string;
  minItems?: number;
  maxItems?: number;
  limit?: { default?: number; max?: number };
  filterOptions?: RelationshipField["filterOptions"];
  validate?: RelationshipFieldManyValidation;
};

export function recordPickerFields({
  collection,
  sources = RECORD_SOURCES,
  defaultSource = sources[0],
  label,
  minItems,
  maxItems,
  limit: limitOptions,
  filterOptions,
  validate,
}: RecordPickerOptions): Field[] {
  const source: SelectField = {
    name: "source",
    type: "select",
    required: true,
    defaultValue: defaultSource,
    options: options(sources, SOURCE_LABELS),
  };
  const fields: Field[] = [source];
  if (sources.includes("manual")) {
    const items: RelationshipField = {
      name: "items",
      ...(label ? { label } : {}),
      type: "relationship",
      relationTo: collection,
      hasMany: true,
      ...(minItems ? { required: true, minRows: minItems } : {}),
      ...(maxItems ? { maxRows: maxItems } : {}),
      ...(filterOptions ? { maxDepth: 1, filterOptions } : {}),
      ...(validate ? { validate } : {}),
      hooks: { beforeChange: [clearUnlessSource("manual")] },
      admin: { condition: sourceIs("manual") },
    };
    fields.push(filterOptions ? unscopedRelationship(items) : items);
  }
  if (sources.includes("latest")) {
    const limit: NumberField = {
      name: "limit",
      type: "number",
      min: 1,
      ...(limitOptions?.max ? { max: limitOptions.max } : {}),
      ...(limitOptions?.default
        ? { required: true, defaultValue: limitOptions.default }
        : {}),
      hooks: { beforeChange: [clearUnlessSource("latest")] },
      admin: { condition: sourceIs("latest"), step: 1 },
    };
    fields.push(limit);
  }
  return fields;
}

export function iconField({
  name = "icon",
  label,
  required = false,
  condition,
}: {
  name?: string;
  label?: string;
  required?: boolean;
  condition?: Condition;
} = {}): UploadField {
  return withMediaPicker(
    {
      name,
      ...(label ? { label } : {}),
      type: "upload",
      relationTo: "media",
      required,
      filterOptions: { mimeType: { in: [...ICON_MIME_TYPES] } },
      admin: {
        description: "SVG or PNG.",
        ...(condition ? { condition } : {}),
      },
    },
    {
      preview: "light",
      previewSize: ICON_PREVIEW_SIZE,
      chooseLabel: "Choose an icon",
      mimeTypes: ICON_MIME_TYPES,
    },
  );
}

export function imageField({
  name,
  label,
  required = false,
  chooseLabel = "Choose an image",
}: {
  name: string;
  label?: string;
  required?: boolean;
  chooseLabel?: string;
}): UploadField {
  return withMediaPicker(
    {
      name,
      ...(label ? { label } : {}),
      type: "upload",
      relationTo: "media",
      required,
    },
    { chooseLabel },
  );
}

export const MAX_STATS = 4;

export function statsField({
  name = "stats",
  maxRows = MAX_STATS,
}: { name?: string; maxRows?: number } = {}): ArrayField {
  return {
    name,
    type: "array",
    minRows: 0,
    maxRows,
    labels: { singular: "Stat", plural: "Stats" },
    fields: [
      { name: "value", type: "text", required: true },
      withSameAsEnTag({
        name: "label",
        type: "text",
        required: true,
        localized: true,
      }),
    ],
  };
}

type BlockData = Record<string, unknown>;

export const whenBlock =
  (field: string, fallback: string, ...values: readonly string[]): Condition =>
  (_, siblingData, options) => {
    const data = (options?.blockData ?? siblingData) as BlockData | undefined;
    return values.includes(String(data?.[field] ?? fallback));
  };
