import {
  FixedToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
  SubscriptFeature,
  SuperscriptFeature,
} from "@payloadcms/richtext-lexical";
import type {
  FieldHook,
  RichTextField,
  RichTextFieldValidation,
} from "payload";
import { richText } from "payload/shared";

export const SUBSCRIPT = 32;
export const SUPERSCRIPT = 64;

const SCRIPT_FORMATS = SUBSCRIPT | SUPERSCRIPT;
const KEEP = new Set(["root", "paragraph", "text", "linebreak"]);

type LexicalNode = {
  type?: string;
  format?: number | string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

function flatten(node: LexicalNode): LexicalNode[] {
  if (node.type === "text") {
    const format =
      typeof node.format === "number" ? node.format & SCRIPT_FORMATS : 0;
    return [{ ...node, format }];
  }
  if (node.type === "linebreak") return [node];
  return (node.children ?? []).flatMap(flatten);
}

export function scriptsOnly(root: LexicalNode): LexicalNode {
  const paragraphs = (root.children ?? []).flatMap((child) => {
    if (child.type === "paragraph") {
      return [{ ...child, children: (child.children ?? []).flatMap(flatten) }];
    }
    const inline = flatten(child);
    return inline.length > 0
      ? [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            direction: null,
            children: inline,
          },
        ]
      : [];
  });
  return { ...root, children: paragraphs };
}

export function isScriptsOnly(root: LexicalNode): boolean {
  const walk = (node: LexicalNode): boolean => {
    if (!node.type || !KEEP.has(node.type)) return false;
    if (
      node.type === "text" &&
      typeof node.format === "number" &&
      (node.format & ~SCRIPT_FORMATS) !== 0
    ) {
      return false;
    }
    return (node.children ?? []).every(walk);
  };
  return walk(root);
}

export const cleanFormula: FieldHook = ({ value }) => {
  const root = (value as { root?: LexicalNode } | null)?.root;
  return root && !isScriptsOnly(root)
    ? { ...(value as object), root: scriptsOnly(root) }
    : value;
};

export const isFormula: RichTextFieldValidation = async (value, args) =>
  richText(value, args);

export const formulaEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      FixedToolbarFeature(),
    ],
  });

export function formulaField(
  options: Pick<RichTextField, "name" | "label" | "required"> &
    Pick<NonNullable<RichTextField["admin"]>, "description">,
): RichTextField {
  const { description, ...field } = options;
  return {
    ...field,
    type: "richText",
    validate: isFormula,
    hooks: { beforeValidate: [cleanFormula] },
    editor: formulaEditor(),
    admin: {
      description:
        description ??
        "Subscript and superscript only, like H₂SO₄. Pasted bold, italic or links are turned into plain text.",
    },
  };
}
