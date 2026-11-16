import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

const CATEGORY_TABS_FIELD =
  "/admin/components/publication/CategoryTabsField#CategoryTabsField";

export const publicationHero = sectionBlock({
  slug: "publicationHero",
  interfaceName: "PublicationHeroBlock",
  group: "Hero",
  tableName: "pubhero",
  catalog: {
    name: "Publication hero",
    purpose:
      "The banner of the Publication page: a photo, a centred heading, a search box and a row of category tabs.",
    figma: ["section/hero"],
    summary: "Search, with the number of category tabs",
  },
  fields: [
    imageField({
      name: "backgroundImage",
      label: "Background photo",
      required: true,
      chooseLabel: "Choose a background photo",
    }),
    headingField({ align: "center" }),
    withSameAsEnTag({
      name: "searchPlaceholder",
      label: "Search placeholder",
      type: "text",
      localized: true,
    }),
    withSameAsEnTag({
      name: "searchLabel",
      label: "Button label",
      type: "text",
      localized: true,
    }),
    withSameAsEnTag({
      name: "allLabel",
      label: "First tab label",
      type: "text",
      localized: true,
    }),
    {
      name: "categories",
      label: "Category tabs",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      maxDepth: 0,
      admin: {
        components: { Field: CATEGORY_TABS_FIELD },
        description:
          "Shown after the All tab, in this order. Drag to reorder. The active tab is the category in context, otherwise All.",
      },
    },
  ],
});
