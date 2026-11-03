import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_HOTSPOTS = 8;

export const HOTSPOT_TONES = ["green", "orange", "navy"] as const;

export const hotspotIllustration = sectionBlock({
  slug: "hotspotIllustration",
  interfaceName: "HotspotIllustrationBlock",
  group: "Content",
  tableName: "hot",
  catalog: {
    name: "Hotspot illustration",
    purpose:
      "An illustration with numbered markers at chosen spots, each opening a card of text.",
    figma: ["section/environmental-responsibility"],
    summary: "The heading's title, with the marker count",
  },
  fields: [
    headingField({ align: "left" }),
    imageField({ name: "image", required: true }),
    {
      name: "hotspots",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_HOTSPOTS,
      labels: { singular: "Hotspot", plural: "Hotspots" },
      fields: [
        {
          name: "tone",
          type: "select",
          required: true,
          defaultValue: "green",
          options: [
            { value: "green", label: "Green" },
            { value: "orange", label: "Orange" },
            { value: "navy", label: "Navy" },
          ],
        },
        {
          name: "x",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          admin: { description: "Distance from the left edge, 0 to 100 (%)." },
        },
        {
          name: "y",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          admin: { description: "Distance from the top edge, 0 to 100 (%)." },
        },
        withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
        withSameAsEnTag({
          name: "title",
          type: "text",
          required: true,
          localized: true,
        }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
        }),
      ],
    },
  ],
});
