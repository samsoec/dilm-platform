import { withSameAsEnTag } from "../fields/layoutEditor";
import { entityScope, validateOneEntity } from "../fields/recordPicks";
import { sectionBlock } from "./sectionBlock";

export const locationMap = sectionBlock({
  slug: "locationMap",
  interfaceName: "LocationMapBlock",
  group: "Current company",
  tableName: "lmp",
  catalog: {
    name: "Location map",
    purpose:
      "A map with the company's name and address card and an Open Google Map link. It shows the company of the site it is viewed on unless you pick another.",
    figma: ["section/contact-location"],
    summary: "The link label",
  },
  fields: [
    {
      name: "entity",
      label: "Company",
      type: "relationship",
      relationTo: "tenants",
      maxDepth: 0,
      filterOptions: entityScope,
      validate: validateOneEntity,
      admin: {
        description:
          "Leave empty to show the company of the site the page is viewed on.",
      },
    },
    withSameAsEnTag({ name: "linkLabel", type: "text", localized: true }),
  ],
});
