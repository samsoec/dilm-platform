import type { Field, NamedGroupField } from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { link } from "../fields/link";
import { BUTTON_STYLES } from "@dilm/shared-types";
import { BUTTON_STYLE_LABELS, buttonsField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export function ctaBannerFields(): Field[] {
  return [
    withSameAsEnTag({
      name: "title",
      type: "text",
      localized: true,
    }),
    withSameAsEnTag({
      name: "description",
      type: "textarea",
      localized: true,
    }),
    buttonsField(),
  ];
}

function bottomCtaButton(name: "first" | "second"): Field[] {
  return [
    link({ name }),
    {
      name: `${name}Style`,
      type: "select",
      required: true,
      defaultValue: "primary",
      options: BUTTON_STYLES.map((value) => ({
        value,
        label: BUTTON_STYLE_LABELS[value],
      })),
    },
  ];
}

export function bottomCtaField({
  name = "bottomCta",
}: { name?: string } = {}): NamedGroupField {
  return {
    name,
    type: "group",
    fields: [
      withSameAsEnTag({
        name: "title",
        type: "text",
        localized: true,
      }),
      withSameAsEnTag({
        name: "description",
        type: "textarea",
        localized: true,
      }),
      ...bottomCtaButton("first"),
      ...bottomCtaButton("second"),
    ],
  };
}

export const ctaBanner = sectionBlock({
  slug: "ctaBanner",
  interfaceName: "CtaBannerBlock",
  group: "Content",
  tableName: "cta",
  catalog: {
    name: "Call-to-action banner",
    purpose:
      "A white bar with a short title, a line of text and up to two buttons, for the foot of a page or a record grid.",
    figma: ["section/products-solutions", "section/solutions-industries"],
    summary: "The banner title, with the button count",
  },
  fields: ctaBannerFields(),
});
