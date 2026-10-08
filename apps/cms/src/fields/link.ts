import type {
  FieldHook,
  NamedGroupField,
  TextField,
  TextFieldSingleValidation,
} from "payload";

import { isHttpsUrl, isInternalPath } from "../validation";

export const LINK_TYPES = ["internal", "external"] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export type LinkFieldOptions = {
  name?: string;
  label?: string;
  required?: boolean;
  withLabel?: boolean;
};

type LinkData = {
  type?: LinkType | null;
  internalPath?: string | null;
  externalUrl?: string | null;
};

const TARGET_FIELD: Record<LinkType, "internalPath" | "externalUrl"> = {
  internal: "internalPath",
  external: "externalUrl",
};

function hasTarget(link: LinkData | undefined) {
  const type = link?.type ?? "internal";
  return Boolean(link?.[TARGET_FIELD[type]]);
}

function target(
  type: LinkType,
  format: TextFieldSingleValidation,
  required: boolean,
): TextField {
  const isActive = (link: LinkData | undefined) =>
    (link?.type ?? "internal") === type;

  const validate: TextFieldSingleValidation = (value, args) => {
    if (!isActive(args.siblingData as LinkData)) return true;
    if (!value) return required ? "Add where this link goes." : true;
    return format(value, args);
  };

  const clearWhenInactive: FieldHook = ({ value, siblingData }) =>
    isActive(siblingData as LinkData) ? value : null;

  return {
    name: TARGET_FIELD[type],
    type: "text",
    validate,
    hooks: { beforeChange: [clearWhenInactive] },
    admin: {
      condition: (_, siblingData) => isActive(siblingData as LinkData),
      description:
        type === "internal"
          ? "A page on this site, e.g. /about. No /en or /id prefix."
          : "A full https:// address on another site.",
    },
  };
}

export function link({
  name = "link",
  label,
  required = false,
  withLabel = true,
}: LinkFieldOptions = {}): NamedGroupField {
  const validateLabel: TextFieldSingleValidation = (value, { siblingData }) =>
    !value && (required || hasTarget(siblingData as LinkData))
      ? "Add the link text."
      : true;

  return {
    name,
    ...(label ? { label } : {}),
    type: "group",
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "type",
            type: "radio",
            required: true,
            defaultValue: "internal",
            options: [...LINK_TYPES],
            admin: { layout: "horizontal" },
          },
          {
            name: "newTab",
            label: "Open in a new tab",
            type: "checkbox",
            defaultValue: false,
          },
        ],
      },
      target("internal", isInternalPath, required),
      target("external", isHttpsUrl, required),
      ...(withLabel
        ? [
            {
              name: "label",
              type: "text",
              localized: true,
              validate: validateLabel,
            } satisfies TextField,
          ]
        : []),
    ],
  };
}
