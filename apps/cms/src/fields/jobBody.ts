import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { RichTextField } from "payload";

export const jobBodyEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h3"] }),
      UnorderedListFeature(),
      BoldFeature(),
      LinkFeature({ enabledCollections: [] }),
      FixedToolbarFeature(),
    ],
  });

export function jobBodyField(
  options: Pick<RichTextField, "name" | "label" | "required">,
): RichTextField {
  return {
    ...options,
    type: "richText",
    localized: true,
    editor: jobBodyEditor(),
  };
}
