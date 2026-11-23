import {
  MAP_CARD_POSITIONS,
  MAX_ENTITY_ITEMS,
  MAX_MAP_CARD_BADGES,
  PROVINCES,
} from "@dilm/shared-types";

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

const POSITION_LABELS = { left: "Left", right: "Right", bottom: "Bottom" };

const legacy = { hidden: true, readOnly: true };

export const entityMap = sectionBlock({
  slug: "entityMap",
  interfaceName: "EntityMapBlock",
  group: "Company sections",
  tableName: "emp",
  catalog: {
    name: "Company map",
    purpose:
      "Free region cards on the dot map. Each card highlights a set of provinces and places its info card next to that area; a card with no areas leaves the map zoomed out.",
    figma: ["section/entities"],
    summary: "The heading's title, with the card count",
  },
  fields: [
    headingField({ align: "center" }),
    {
      name: "cards",
      type: "array",
      dbName: tableNamed("cd"),
      required: true,
      minRows: 1,
      maxRows: MAX_ENTITY_ITEMS,
      labels: { singular: "Card", plural: "Cards" },
      fields: [
        withSameAsEnTag({
          name: "eyebrow",
          type: "text",
          localized: true,
        }),
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
        {
          name: "badges",
          type: "array",
          dbName: tableNamed("bg"),
          maxRows: MAX_MAP_CARD_BADGES,
          labels: { singular: "Badge", plural: "Badges" },
          fields: [
            withSameAsEnTag({
              name: "text",
              type: "text",
              required: true,
              localized: true,
            }),
          ],
        },
        imageField({ name: "image", label: "Photo" }),
        buttonsField({ tableName: "cbt" }),
        {
          name: "position",
          type: "select",
          required: true,
          defaultValue: "left",
          options: MAP_CARD_POSITIONS.map((value) => ({
            value,
            label: POSITION_LABELS[value],
          })),
        },
        {
          name: "areas",
          type: "select",
          hasMany: true,
          options: PROVINCES.map((p) => ({ value: p.code, label: p.name })),
          admin: {
            description:
              "Provinces highlighted on the map. Leave empty for the Other areas case: nothing highlighted and the map stays zoomed out.",
          },
        },
      ],
    },
    {
      name: "items",
      type: "array",
      dbName: tableNamed("it"),
      admin: { ...legacy },
      labels: { singular: "Card", plural: "Cards" },
      fields: [
        {
          name: "entity",
          type: "relationship",
          relationTo: "tenants",
          maxDepth: 0,
          filterOptions: entityScope,
          validate: validateOneEntity,
        },
        imageField({ name: "image" }),
        { name: "label", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        {
          name: "regions",
          type: "array",
          dbName: tableNamed("rg"),
          maxRows: PROFILE_MAX_REGIONS,
          fields: [
            { name: "name", type: "text", required: true, localized: true },
          ],
        },
        {
          name: "pin",
          type: "group",
          fields: [
            { name: "x", type: "number" },
            { name: "y", type: "number" },
          ],
        },
        buttonsField({ tableName: "btn" }),
      ],
    },
  ],
});
