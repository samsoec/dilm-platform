import {
  BlockquoteFeature,
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import type { RichTextField } from "payload";

export const RICH_TEXT_HEADING_SIZES = ["h2", "h3", "h4"] as const;

export const richTextBodyFeatures = () => [
  ParagraphFeature(),
  HeadingFeature({ enabledHeadingSizes: [...RICH_TEXT_HEADING_SIZES] }),
  UnorderedListFeature(),
  OrderedListFeature(),
  BoldFeature(),
  ItalicFeature(),
  BlockquoteFeature(),
  LinkFeature({ enabledCollections: [] }),
  UploadFeature({ collections: { media: { fields: [] } } }),
  EXPERIMENTAL_TableFeature(),
  FixedToolbarFeature(),
];

export const richTextBodyEditor = () =>
  lexicalEditor({ features: richTextBodyFeatures });

export function richTextBodyField(
  options: Pick<RichTextField, "name" | "label" | "required">,
): RichTextField {
  return {
    ...options,
    type: "richText",
    localized: true,
    editor: richTextBodyEditor(),
  };
}
