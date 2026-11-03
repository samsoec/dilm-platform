import {
  MAX_SHOWCASE_ITEMS,
  PRODUCT_CARD_STYLES,
  type ProductCardStyle,
} from "@dilm/shared-types";

import {
  ctaCardField,
  pickerScope,
  validateManyPicks,
} from "../fields/recordPicks";
import { bottomCtaField } from "./ctaBanner";
import {
  appearanceField,
  buttonsField,
  headingField,
  recordPickerFields,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const PRODUCT_CARD_STYLE_LABELS: Record<ProductCardStyle, string> = {
  imageOverlay: "Photo with the name over it",
  imageCard: "Photo, group, name, description, formula and variants",
  textCard: "Same as above, without the photo",
};

export const productShowcase = sectionBlock({
  slug: "productShowcase",
  interfaceName: "ProductShowcaseBlock",
  group: "Records",
  tableName: "ps",
  catalog: {
    name: "Product showcase",
    purpose:
      "A grid of product cards, hand-picked or every published product, with an optional last card and bottom bar.",
    figma: [
      "section/highlight-product",
      "section/products-list",
      "section/solution-related-products",
    ],
    summary: "The heading's title, with the source and card count",
  },
  fields: [
    headingField({ align: "center" }),
    buttonsField({ tableName: "btn" }),
    ...recordPickerFields({
      collection: "products",
      sources: ["manual", "all"],
      minItems: 1,
      maxItems: MAX_SHOWCASE_ITEMS,
      filterOptions: pickerScope,
      validate: validateManyPicks,
    }),
    {
      name: "cardStyle",
      type: "select",
      required: true,
      defaultValue: "imageCard",
      options: PRODUCT_CARD_STYLES.map((value) => ({
        value,
        label: PRODUCT_CARD_STYLE_LABELS[value],
      })),
    },
    ctaCardField(),
    bottomCtaField(),
    appearanceField(),
  ],
});
