import { italicHeadingField } from "../fields/italicHeading";
import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_MISSION_ITEMS = 8;

export const visionMission = sectionBlock({
  slug: "visionMission",
  interfaceName: "VisionMissionBlock",
  group: "Content",
  tableName: "vm",
  catalog: {
    name: "Vision and mission",
    purpose:
      "Two cards side by side: the company's vision statement and its numbered mission points.",
    figma: ["section/about-vision-mission"],
    summary: "The vision title, with the number of mission items",
  },
  fields: [
    headingField({ align: "center" }),
    {
      name: "vision",
      type: "group",
      fields: [
        withSameAsEnTag({ name: "title", type: "text", localized: true }),
        italicHeadingField({ name: "statement", label: "Statement" }),
      ],
    },
    {
      name: "mission",
      type: "group",
      fields: [
        withSameAsEnTag({ name: "title", type: "text", localized: true }),
        {
          name: "items",
          type: "array",
          required: true,
          minRows: 1,
          maxRows: MAX_MISSION_ITEMS,
          labels: { singular: "Mission item", plural: "Mission items" },
          fields: [
            withSameAsEnTag({
              name: "text",
              type: "textarea",
              required: true,
              localized: true,
            }),
          ],
        },
      ],
    },
  ],
});
