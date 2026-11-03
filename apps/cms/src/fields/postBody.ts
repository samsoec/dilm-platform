import {
  BlocksFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Block, RichTextField, TextFieldSingleValidation } from "payload";

import { VIDEO_URL_MESSAGE, isSupportedVideoUrl } from "@dilm/shared-types";

import { sameCompanyDocuments } from "../catalog";

export const validateVideoUrl: TextFieldSingleValidation = (value) =>
  isSupportedVideoUrl(value) ? true : VIDEO_URL_MESSAGE;

export const imageBlock: Block = {
  slug: "image",
  labels: { singular: "Image", plural: "Images" },
  fields: [
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    { name: "caption", label: "Caption", type: "text" },
  ],
};

export const videoBlock: Block = {
  slug: "video",
  labels: { singular: "Video", plural: "Videos" },
  fields: [
    {
      name: "url",
      label: "YouTube or Vimeo link",
      type: "text",
      required: true,
      validate: validateVideoUrl,
      admin: {
        description:
          "Paste the link as it is. The site plays it in the privacy-enhanced player.",
      },
    },
  ],
};

export const attachmentBlock: Block = {
  slug: "attachment",
  labels: { singular: "Attachment", plural: "Attachments" },
  fields: [
    {
      name: "document",
      label: "PDF document",
      type: "upload",
      relationTo: "documents",
      required: true,
      filterOptions: sameCompanyDocuments(),
    },
  ],
};

export const POST_BODY_BLOCKS: Block[] = [
  imageBlock,
  videoBlock,
  attachmentBlock,
];

export const postBodyEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
      UnorderedListFeature(),
      OrderedListFeature(),
      BoldFeature(),
      ItalicFeature(),
      BlockquoteFeature(),
      LinkFeature({ enabledCollections: [] }),
      BlocksFeature({ blocks: POST_BODY_BLOCKS }),
      FixedToolbarFeature(),
    ],
  });

export function postBodyField(
  options: Pick<RichTextField, "name" | "label" | "required">,
): RichTextField {
  return {
    ...options,
    type: "richText",
    localized: true,
    editor: postBodyEditor(),
  };
}
