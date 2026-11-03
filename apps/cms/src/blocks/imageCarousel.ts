import { withSameAsEnTag } from "../fields/layoutEditor";
import { link } from "../fields/link";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_CAROUSEL_ITEMS = 20;

export const imageCarousel = sectionBlock({
  slug: "imageCarousel",
  interfaceName: "ImageCarouselBlock",
  group: "Content",
  tableName: "icar",
  catalog: {
    name: "Image carousel",
    purpose:
      "A carousel of photo cards with a label, each optionally linking to a page.",
    figma: ["section/industry-sectors"],
    summary: "The heading's title, with the card count",
  },
  fields: [
    headingField({ align: "split" }),
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_CAROUSEL_ITEMS,
      labels: { singular: "Card", plural: "Cards" },
      fields: [
        imageField({ name: "image", required: true }),
        withSameAsEnTag({
          name: "label",
          type: "text",
          required: true,
          localized: true,
        }),
        link({ name: "link", withLabel: false }),
      ],
    },
  ],
});
