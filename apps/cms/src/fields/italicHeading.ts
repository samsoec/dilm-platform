import {
  FixedToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";
import type {
  FieldHook,
  RichTextField,
  RichTextFieldValidation,
} from "payload";
import { richText } from "payload/shared";

import { isPlainOrItalic, plainOrItalic } from "../admin/footerSections";

export const isItalicOnlyHeading: RichTextFieldValidation = async (
  value,
  args,
) => richText(value, args);

export const cleanHeading: FieldHook = ({ value }) => {
  const root = (value as { root?: Parameters<typeof plainOrItalic>[0] } | null)
    ?.root;
  return root && !isPlainOrItalic(root)
    ? { ...(value as object), root: plainOrItalic(root) }
    : value;
};

export const italicOnlyEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      ItalicFeature(),
      FixedToolbarFeature(),
    ],
  });

export function italicHeadingField(
  options: Pick<RichTextField, "name" | "label" | "required"> &
    Pick<NonNullable<RichTextField["admin"]>, "description">,
): RichTextField {
  const { description, ...field } = options;
  return {
    ...field,
    type: "richText",
    localized: true,
    validate: isItalicOnlyHeading,
    hooks: { beforeValidate: [cleanHeading] },
    editor: italicOnlyEditor(),
    admin: {
      description:
        description ??
        "Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.",
    },
  };
}
