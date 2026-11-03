import { linkedBodyTextField } from "../fields/bodyText";
import { withSameAsEnTag } from "../fields/layoutEditor";
import {
  appearanceField,
  buttonsField,
  headingField,
  iconField,
  imageField,
  statsField,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_MEDIA_IMAGES = 2;

export const MAX_MEDIA_POINTS = 6;

export const IMAGE_LAYOUTS = ["single", "staggered"] as const;

export const IMAGE_POSITIONS = ["right", "left"] as const;

export const POINTS_LAYOUTS = ["inline", "grid"] as const;

export const mediaText = sectionBlock({
  slug: "mediaText",
  interfaceName: "MediaTextBlock",
  group: "Content",
  tableName: "media",
  catalog: {
    name: "Media and text",
    purpose:
      "A text column beside one or two photos, with optional key numbers, feature points and buttons.",
    figma: [
      "section/why-choose-us",
      "section/banner-career",
      "section/about-overview",
      "section/our-commitment",
      "section/our-journey",
    ],
    summary: "The heading's title, with the image layout and the stats",
  },
  fields: [
    headingField({ align: "left" }),
    linkedBodyTextField({ name: "body", label: "Body" }),
    {
      name: "images",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_MEDIA_IMAGES,
      labels: { singular: "Image", plural: "Images" },
      fields: [imageField({ name: "image", required: true })],
    },
    {
      name: "imageLayout",
      type: "select",
      required: true,
      defaultValue: "single",
      options: [
        { value: "single", label: "One image" },
        { value: "staggered", label: "Two offset portraits" },
      ],
    },
    {
      name: "imagePosition",
      type: "select",
      required: true,
      defaultValue: "right",
      options: [
        { value: "right", label: "Right" },
        { value: "left", label: "Left" },
      ],
    },
    statsField(),
    {
      name: "points",
      type: "array",
      minRows: 0,
      maxRows: MAX_MEDIA_POINTS,
      labels: { singular: "Point", plural: "Points" },
      fields: [
        iconField(),
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
    {
      name: "pointsLayout",
      type: "select",
      required: true,
      defaultValue: "inline",
      options: [
        { value: "inline", label: "Under the text" },
        { value: "grid", label: "Full-width row below" },
      ],
    },
    buttonsField(),
    appearanceField(),
  ],
});
