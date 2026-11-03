import { BUTTON_STYLES } from "@dilm/shared-types";
import type { Field, NamedGroupField } from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { link } from "../fields/link";
import { BUTTON_STYLE_LABELS, headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const COLUMN_LABELS = ["parameter", "method", "value"] as const;

export const SIDE_LABELS = [
  "formula",
  "casNumber",
  "classification",
  "packaging",
] as const;

const COLUMN_TITLES: Record<(typeof COLUMN_LABELS)[number], string> = {
  parameter: "Parameter",
  method: "Method",
  value: "Guaranteed value",
};

const SIDE_TITLES: Record<(typeof SIDE_LABELS)[number], string> = {
  formula: "Formula",
  casNumber: "CAS number",
  classification: "Classification",
  packaging: "Packaging",
};

export function labelGroup<Name extends string>(
  name: string,
  label: string,
  names: readonly Name[],
  titles: Record<Name, string>,
): NamedGroupField {
  return {
    name,
    label,
    type: "group",
    fields: names.map((key): Field =>
      withSameAsEnTag({
        name: key,
        label: titles[key],
        type: "text",
        localized: true,
      }),
    ),
  };
}

export const productSpecifications = sectionBlock({
  slug: "productSpecifications",
  interfaceName: "ProductSpecificationsBlock",
  group: "Template",
  tableName: "pspec",
  recordTypes: ["product"],
  catalog: {
    name: "Product specifications",
    purpose:
      "The product's variant tabs, specification table and side card. The values come from the product; you set the heading and the labels.",
    figma: ["section/technical-specifications"],
    summary: "The heading's title",
  },
  fields: [
    headingField({ align: "center" }),
    labelGroup(
      "columnLabels",
      "Table column labels",
      COLUMN_LABELS,
      COLUMN_TITLES,
    ),
    labelGroup("sideLabels", "Side card labels", SIDE_LABELS, SIDE_TITLES),
    {
      name: "contact",
      label: "Contact button",
      type: "group",
      admin: {
        description: "Leave the link empty to hide the button.",
      },
      fields: [
        link({ name: "link" }),
        {
          name: "style",
          type: "select",
          required: true,
          defaultValue: "primary",
          options: BUTTON_STYLES.map((value) => ({
            value,
            label: BUTTON_STYLE_LABELS[value],
          })),
        },
      ],
    },
    withSameAsEnTag({
      name: "pdsLabel",
      label: "Download PDS button",
      type: "text",
      localized: true,
    }),
    withSameAsEnTag({
      name: "sdsLabel",
      label: "Download SDS button",
      type: "text",
      localized: true,
    }),
  ],
});
