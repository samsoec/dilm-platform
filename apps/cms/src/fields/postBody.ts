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
import type {
  Block,
  RichTextField,
  TextFieldSingleValidation,
  UploadFieldSingleValidation,
} from "payload";
import { upload } from "payload/shared";

import { VIDEO_URL_MESSAGE, isSupportedVideoUrl } from "@dilm/shared-types";

import { sameCompanyDocuments } from "../catalog";
import { refId } from "../pageRules";

export const DOCUMENT_OTHER_COMPANY =
  "This document belongs to another company. Pick one of this company's documents.";

export const validateSameCompanyDocument: UploadFieldSingleValidation = async (
  value,
  options,
) => {
  const base = await upload(value, options);
  if (base !== true) return base;
  const id = refId(value as Parameters<typeof refId>[0]);
  if (!id) return true;
  const tenant = refId(
    (options.data as { tenant?: Parameters<typeof refId>[0] } | undefined)
      ?.tenant,
  );
  if (!tenant) return true;
  const found = (await options.req.payload.findByID({
    collection: "documents",
    id,
    depth: 0,
    trash: true,
    overrideAccess: true,
    req: options.req,
  })) as { tenant?: Parameters<typeof refId>[0] };
  return refId(found.tenant) === tenant ? true : DOCUMENT_OTHER_COMPANY;
};

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
      validate: validateSameCompanyDocument,
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
