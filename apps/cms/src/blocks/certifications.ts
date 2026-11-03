import { withSameAsEnTag } from "../fields/layoutEditor";
import {
  appearanceField,
  buttonsField,
  headingField,
  imageField,
  tableNamed,
  whenBlock,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_CERTIFICATIONS = 24;

export const MAX_CERTIFICATE_IMAGES = 10;

export const CERTIFICATION_VARIANTS = ["logos", "cards"] as const;

export const CERTIFICATION_LAYOUTS = ["grid", "carousel"] as const;

const cardsOnly = whenBlock("variant", "logos", "cards");

export const certifications = sectionBlock({
  slug: "certifications",
  interfaceName: "CertificationsBlock",
  group: "Content",
  tableName: "cf",
  catalog: {
    name: "Certifications",
    purpose:
      "Certification marks as a logo row or as cards with a code, title and description, in a grid or a carousel; a card with certificate pages opens a gallery.",
    figma: [
      "section/certifications",
      "section/about-awards-certifications",
      "section/certifications-list",
    ],
    summary: "The heading's title, with the variant and the item count",
  },
  fields: [
    headingField({ align: "center" }),
    buttonsField(),
    {
      name: "variant",
      type: "select",
      required: true,
      defaultValue: "logos",
      options: [
        { value: "logos", label: "Logos only" },
        { value: "cards", label: "Cards" },
      ],
    },
    {
      name: "layout",
      type: "select",
      required: true,
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "carousel", label: "Carousel" },
      ],
    },
    {
      name: "items",
      type: "array",
      dbName: tableNamed("c"),
      required: true,
      minRows: 1,
      maxRows: MAX_CERTIFICATIONS,
      labels: { singular: "Certification", plural: "Certifications" },
      fields: [
        imageField({ name: "logo", required: true }),
        {
          name: "code",
          type: "text",
          admin: { condition: cardsOnly },
        },
        withSameAsEnTag({
          name: "title",
          type: "text",
          localized: true,
          admin: { condition: cardsOnly },
        }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
          admin: { condition: cardsOnly },
        }),
        {
          name: "certificateImages",
          type: "array",
          dbName: tableNamed("p"),
          minRows: 0,
          maxRows: MAX_CERTIFICATE_IMAGES,
          labels: { singular: "Certificate page", plural: "Certificate pages" },
          fields: [imageField({ name: "image", required: true })],
        },
      ],
    },
    appearanceField(),
  ],
});
