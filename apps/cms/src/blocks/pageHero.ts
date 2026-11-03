import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const pageHero = sectionBlock({
  slug: "pageHero",
  interfaceName: "PageHeroBlock",
  group: "Hero",
  tableName: "phero",
  catalog: {
    name: "Page hero",
    purpose:
      "The banner at the top of an inner page: a blurred photo with a centred heading.",
    figma: ["section/hero"],
    summary: "The heading's title",
  },
  fields: [
    imageField({
      name: "backgroundImage",
      label: "Background photo",
      required: true,
      chooseLabel: "Choose a background photo",
    }),
    headingField({ align: "center" }),
  ],
});
