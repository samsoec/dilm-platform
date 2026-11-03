import { MAX_ENTITY_ITEMS } from "@dilm/shared-types";

import { link } from "../fields/link";
import { entityScope, validateEntityPicks } from "../fields/recordPicks";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const groupShowcase = sectionBlock({
  slug: "groupShowcase",
  interfaceName: "GroupShowcaseBlock",
  group: "Company sections",
  tableName: "gsh",
  catalog: {
    name: "Group showcase",
    purpose:
      "A large photo with the group logo and a tile for each picked company; the tiles and names come from each company's Profile and Company settings.",
    figma: ["section/about-our-group"],
    summary: "The heading's title, with the company count",
  },
  fields: [
    headingField({ align: "left" }),
    imageField({ name: "mainImage", label: "Main photo" }),
    imageField({
      name: "mainLogo",
      label: "Main logo",
      chooseLabel: "Choose a logo",
    }),
    link({ name: "mainLink", label: "Main link" }),
    {
      name: "entities",
      label: "Companies",
      type: "relationship",
      relationTo: "tenants",
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: MAX_ENTITY_ITEMS,
      maxDepth: 0,
      filterOptions: entityScope,
      validate: validateEntityPicks,
      admin: {
        description:
          "In the order shown. Each tile uses the company's cover image and light logo; names use its legal name. Edit those in Company settings.",
      },
    },
  ],
});
