import {
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";
import type {
  Condition,
  RichTextFieldValidation,
  TextFieldSingleValidation,
} from "payload";
import { richText } from "payload/shared";

import { superAdmins } from "../access";
import { link } from "../fields/link";
import { withTenantAccess } from "../tenancy";

export const MAX_LINK_COLUMNS = 4;

export const MAX_COLUMN_LINKS = 8;

export const COPYRIGHT_TOKENS = ["year", "legalName"] as const;

const ITALIC = 2;

const HEADING_NODE_TYPES = new Set(["root", "paragraph", "text", "linebreak"]);

type LexicalNode = {
  type?: string;
  format?: number | string;
  children?: LexicalNode[];
};

function headingProblem(node: LexicalNode): string | undefined {
  if (!node.type || !HEADING_NODE_TYPES.has(node.type)) {
    return "The heading only takes plain or italic text.";
  }
  if (
    node.type === "text" &&
    typeof node.format === "number" &&
    (node.format & ~ITALIC) !== 0
  ) {
    return "The heading only allows italic; remove other formatting.";
  }
  for (const child of node.children ?? []) {
    const problem = headingProblem(child);
    if (problem) return problem;
  }
  return undefined;
}

export const isItalicOnlyHeading: RichTextFieldValidation = async (
  value,
  args,
) => {
  const valid = await richText(value, args);
  if (valid !== true) return valid;
  const root = (value as { root?: LexicalNode } | null | undefined)?.root;
  return root ? (headingProblem(root) ?? true) : true;
};

const KNOWN_TOKENS = new Set<string>(COPYRIGHT_TOKENS);

export const isCopyrightTemplate: TextFieldSingleValidation = (value) => {
  if (!value) return true;
  const unknown = [...value.matchAll(/\{([^{}]*)\}/g)]
    .filter(([, token]) => !KNOWN_TOKENS.has(token ?? ""))
    .map(([placeholder]) => placeholder);
  if (unknown.length > 0) {
    return `Unknown placeholder ${unknown.join(", ")}; use {year} or {legalName}.`;
  }
  return /[{}]/.test(value.replace(/\{[^{}]*\}/g, ""))
    ? "Close every placeholder: {year} or {legalName}."
    : true;
};

const partOfEnabled: Condition = (_, siblingData) =>
  Boolean((siblingData as { enabled?: boolean } | undefined)?.enabled);

export const Footer = withTenantAccess(
  {
    slug: "footer",
    access: {
      delete: superAdmins,
    },
    versions: {
      drafts: false,
    },
    fields: [
      {
        name: "ctaBand",
        label: "Contact band",
        type: "group",
        fields: [
          { name: "eyebrow", type: "text", localized: true },
          {
            name: "heading",
            type: "richText",
            localized: true,
            validate: isItalicOnlyHeading,
            editor: lexicalEditor({
              features: () => [
                ParagraphFeature(),
                ItalicFeature(),
                InlineToolbarFeature(),
              ],
            }),
          },
          link({
            name: "primaryButton",
            label: "Primary button",
            required: true,
          }),
          link({ name: "secondaryButton", label: "Secondary button" }),
        ],
      },
      {
        name: "linkColumns",
        label: "Link columns",
        type: "array",
        maxRows: MAX_LINK_COLUMNS,
        fields: [
          { name: "title", type: "text", localized: true, required: true },
          {
            name: "links",
            type: "array",
            maxRows: MAX_COLUMN_LINKS,
            fields: [link({ required: true })],
          },
        ],
      },
      {
        name: "partOf",
        label: "Part of",
        type: "group",
        fields: [
          {
            name: "enabled",
            label: "Show the “Part of” block",
            type: "checkbox",
            defaultValue: false,
          },
          {
            name: "label",
            type: "text",
            localized: true,
            admin: { condition: partOfEnabled },
          },
          {
            name: "logo",
            type: "upload",
            relationTo: "media",
            admin: { condition: partOfEnabled },
          },
          {
            ...link(),
            admin: { condition: partOfEnabled },
          },
        ],
      },
      {
        name: "copyright",
        type: "text",
        localized: true,
        validate: isCopyrightTemplate,
        admin: {
          description:
            "Use {year} for the current year and {legalName} for the company's legal name from Tenant Settings, e.g. Copyright © {year} {legalName}. All Rights Reserved.",
        },
      },
    ],
  },
  { isGlobal: true },
);
