import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_CLIENT_LOGOS = 30;

export const MAX_TESTIMONIALS = 20;

export const testimonials = sectionBlock({
  slug: "testimonials",
  interfaceName: "TestimonialsBlock",
  group: "Content",
  tableName: "testi",
  catalog: {
    name: "Testimonials",
    purpose:
      "A wall of client logos above a carousel of customer quotes; a quote without a photo shows initials.",
    figma: ["section/testimonials"],
    summary: "The heading's title, with the logo and quote counts",
  },
  fields: [
    headingField({ align: "center" }),
    {
      name: "logos",
      type: "array",
      minRows: 0,
      maxRows: MAX_CLIENT_LOGOS,
      labels: { singular: "Client logo", plural: "Client logos" },
      fields: [
        imageField({ name: "image", required: true }),
        {
          name: "name",
          type: "text",
          required: true,
          admin: { description: "Read aloud as the logo's alt text." },
        },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 0,
      maxRows: MAX_TESTIMONIALS,
      labels: { singular: "Quote", plural: "Quotes" },
      fields: [
        withSameAsEnTag({
          name: "quote",
          type: "textarea",
          required: true,
          localized: true,
        }),
        { name: "name", type: "text", required: true },
        withSameAsEnTag({ name: "role", type: "text", localized: true }),
        imageField({ name: "avatar", label: "Photo (optional)" }),
      ],
    },
  ],
});
