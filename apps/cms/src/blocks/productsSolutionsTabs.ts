import { RECORD_TABS, MAX_TAB_ITEMS } from "@dilm/shared-types";
import type { GroupField } from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import {
  ctaCardField,
  pickerScope,
  validateManyPicks,
} from "../fields/recordPicks";
import { unscopedRelationship } from "../tenancy";
import { bottomCtaField } from "./ctaBanner";
import { appearanceField, headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

const TAB_LABELS = { solutions: "Solutions", products: "Products" } as const;

function tabField(tab: (typeof RECORD_TABS)[number]): GroupField {
  return {
    name: `${tab}Tab`,
    label: `${TAB_LABELS[tab]} tab`,
    type: "group",
    fields: [
      withSameAsEnTag({
        name: "label",
        type: "text",
        localized: true,
        required: true,
      }),
      unscopedRelationship({
        name: "items",
        label: TAB_LABELS[tab],
        type: "relationship",
        relationTo: tab,
        hasMany: true,
        required: true,
        minRows: 1,
        maxRows: MAX_TAB_ITEMS,
        maxDepth: 1,
        filterOptions: pickerScope,
        validate: validateManyPicks,
        admin: {
          description: `Published ${tab} from every company. The order here is the order on the page.`,
        },
      }),
    ],
  };
}

export const productsSolutionsTabs = sectionBlock({
  slug: "productsSolutionsTabs",
  interfaceName: "ProductsSolutionsTabsBlock",
  group: "Records",
  tableName: "pt",
  catalog: {
    name: "Solutions and products tabs",
    purpose:
      "Two tabs of hand-picked solution cards and product cards, with a last card and a bar of buttons underneath.",
    figma: ["section/products-solutions"],
    summary: "The heading's title, with the solution and product counts",
  },
  fields: [
    headingField({ align: "center" }),
    tabField("solutions"),
    tabField("products"),
    {
      name: "defaultTab",
      type: "select",
      required: true,
      defaultValue: "solutions",
      options: RECORD_TABS.map((value) => ({
        value,
        label: `${TAB_LABELS[value]} tab`,
      })),
      admin: { description: "The tab that is open when the page loads." },
    },
    ctaCardField(),
    bottomCtaField(),
    appearanceField(),
  ],
});
