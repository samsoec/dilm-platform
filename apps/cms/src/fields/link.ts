import type {
  FieldHook,
  NamedGroupField,
  TextField,
  TextFieldSingleValidation,
} from "payload";

import { isHttpsUrl, isInternalPath } from "../validation";
import { withSameAsEnTag } from "./layoutEditor";

export const LINK_TYPES = ["internal", "external"] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  internal: "This site",
  external: "Other site",
};

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

const PATH_PREFIX = "/admin/components/fields/PathPrefix#PathPrefix";

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
    label: type === "internal" ? "Page path" : "Web address",
    type: "text",
    validate,
    hooks: { beforeChange: [clearWhenInactive] },
    admin: {
      condition: (_, siblingData) => isActive(siblingData as LinkData),
      description:
        type === "internal"
          ? "Start with /. The site adds the language."
          : "A full address starting with https://",
      ...(type === "internal"
        ? {
            className: "dil-path-field",
            components: { beforeInput: [PATH_PREFIX] },
          }
        : {}),
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
            label: "Goes to",
            type: "radio",
            required: true,
            defaultValue: "internal",
            options: LINK_TYPES.map((value) => ({
              value,
              label: LINK_TYPE_LABELS[value],
            })),
            admin: { layout: "horizontal", className: "dil-segmented" },
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
            withSameAsEnTag({
              name: "label",
              type: "text",
              localized: true,
              validate: validateLabel,
            } satisfies TextField),
          ]
        : []),
    ],
  };
}
