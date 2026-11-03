import {
  buttonsField,
  headingTextFields,
  imageField,
  statsField,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_HERO_SLIDES = 5;

export const heroCarousel = sectionBlock({
  slug: "heroCarousel",
  interfaceName: "HeroCarouselBlock",
  group: "Hero",
  tableName: "hero",
  catalog: {
    name: "Hero carousel",
    purpose:
      "The home page opener: up to five full-photo slides with buttons, and a row of key numbers underneath.",
    figma: ["section/hero", "section/hero-home-carousel"],
    summary: "First slide's title, and the number of slides",
  },
  fields: [
    {
      name: "slides",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_HERO_SLIDES,
      labels: { singular: "Slide", plural: "Slides" },
      fields: [
        imageField({
          name: "backgroundImage",
          label: "Photo",
          required: true,
          chooseLabel: "Choose a photo",
        }),
        ...headingTextFields(),
        buttonsField({ tableName: "btn" }),
      ],
    },
    statsField(),
    {
      name: "autoplaySeconds",
      type: "number",
      required: true,
      min: 0,
      max: 60,
      defaultValue: 6,
      admin: {
        step: 1,
        description: "Seconds each slide stays. 0 turns autoplay off.",
      },
    },
  ],
});
