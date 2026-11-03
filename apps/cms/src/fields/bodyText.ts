import {
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
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

export const linkedBodyEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      LinkFeature({ enabledCollections: [] }),
      FixedToolbarFeature(),
    ],
  });

export function linkedBodyTextField(
  options: Pick<RichTextField, "name" | "label" | "required">,
): RichTextField {
  return {
    ...options,
    type: "richText",
    localized: true,
    editor: linkedBodyEditor(),
  };
}
