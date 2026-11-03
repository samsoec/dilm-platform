import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_GALLERY_ITEMS = 20;

export const certificateGallery = sectionBlock({
  slug: "certificateGallery",
  interfaceName: "CertificateGalleryBlock",
  group: "Content",
  tableName: "cgal",
  catalog: {
    name: "Certificate gallery",
    purpose:
      "A row of certificate thumbnails beside a heading and a badge; each opens in a popup.",
    figma: ["section/sni"],
    summary: "The heading's title, with the certificate count",
  },
  fields: [
    headingField({ align: "left" }),
    imageField({ name: "badge", label: "Badge beside the heading" }),
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_GALLERY_ITEMS,
      labels: { singular: "Certificate", plural: "Certificates" },
      fields: [
        imageField({ name: "image", required: true }),
        withSameAsEnTag({ name: "caption", type: "text", localized: true }),
      ],
    },
  ],
});
