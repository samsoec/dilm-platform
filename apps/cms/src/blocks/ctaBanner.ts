import type { Field, NamedGroupField } from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { buttonsField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export function ctaBannerFields({
  buttonsTableName,
}: { buttonsTableName?: string } = {}): Field[] {
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
    buttonsField(buttonsTableName ? { tableName: buttonsTableName } : {}),
  ];
}

export function bottomCtaField({
  name = "bottomCta",
  buttonsTableName,
}: { name?: string; buttonsTableName?: string } = {}): NamedGroupField {
  return {
    name,
    type: "group",
    fields: ctaBannerFields({ buttonsTableName }),
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
