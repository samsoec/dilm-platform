import {
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";
import type { RichTextField } from "payload";

export const bodyEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      FixedToolbarFeature(),
    ],
  });

export function bodyTextField(
  options: Pick<RichTextField, "name" | "label" | "required">,
): RichTextField {
  return {
    ...options,
    type: "richText",
    localized: true,
    editor: bodyEditor(),
  };
}
