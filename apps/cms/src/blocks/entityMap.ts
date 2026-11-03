import { MAX_ENTITY_ITEMS } from "@dilm/shared-types";

import { PROFILE_MAX_REGIONS } from "../collections/TenantSettings";
import { withSameAsEnTag } from "../fields/layoutEditor";
import { entityScope, validateOneEntity } from "../fields/recordPicks";
import {
  buttonsField,
  headingField,
  imageField,
  tableNamed,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const entityMap = sectionBlock({
  slug: "entityMap",
  interfaceName: "EntityMapBlock",
  group: "Company sections",
  tableName: "emp",
  catalog: {
    name: "Company map",
    purpose:
      "A carousel of company cards, one pin each on the dot map. A card with a company picked fills what you leave empty from that company's Profile; a card without one is free.",
    figma: ["section/entities"],
    summary: "The heading's title, with the card count",
  },
  fields: [
    headingField({ align: "center" }),
    {
      name: "items",
      type: "array",
      dbName: tableNamed("it"),
      required: true,
      minRows: 1,
      maxRows: MAX_ENTITY_ITEMS,
      labels: { singular: "Card", plural: "Cards" },
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
              "Leave empty for a free card. With a company, anything you leave empty below is filled from that company's Profile.",
          },
        },
        imageField({ name: "image", label: "Photo" }),
        withSameAsEnTag({ name: "label", type: "text", localized: true }),
        withSameAsEnTag({ name: "title", type: "text", localized: true }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
        }),
        {
          name: "regions",
          type: "array",
          dbName: tableNamed("rg"),
          maxRows: PROFILE_MAX_REGIONS,
          labels: { singular: "Region", plural: "Regions" },
          fields: [
            withSameAsEnTag({
              name: "name",
              type: "text",
              required: true,
              localized: true,
            }),
          ],
        },
        {
          name: "pin",
          label: "Map pin",
          type: "group",
          admin: {
            description:
              "Position on the dot map as a percentage from the top-left corner.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "x",
                  type: "number",
                  min: 0,
                  max: 100,
                  admin: { width: "50%" },
                },
                {
                  name: "y",
                  type: "number",
                  min: 0,
                  max: 100,
                  admin: { width: "50%" },
                },
              ],
            },
          ],
        },
        buttonsField({ tableName: "btn" }),
      ],
    },
  ],
});
