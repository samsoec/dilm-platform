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
import { navGroup } from "../admin/navGroups";
import {
  countedArray,
  localeBanner,
  ROW_LABELS,
  SAME_AS_EN_TAG,
  section,
  sectionAnchors,
  sourcedFrom,
  versionInfo,
  withSameAsEnTag,
} from "../fields/layoutEditor";
import { link } from "../fields/link";
import { keepRowStructure, lockStructure } from "../fields/structure";
import { withUpdatedBy } from "../fields/updatedBy";
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
  withUpdatedBy({
    slug: "footer",
    admin: { group: navGroup("layout") },
    custom: { nav: { icon: "call_to_action", order: 2 } },
    access: {
      delete: superAdmins,
    },
    versions: {
      drafts: false,
    },
    hooks: {
      beforeChange: [keepRowStructure],
    },
    fields: [
      localeBanner,
      sectionAnchors,
      versionInfo,
      sourcedFrom,
      ...lockStructure([
        ...section("contact-band", [
          {
            name: "ctaBand",
            label: false,
            type: "group",
            fields: [
              withSameAsEnTag({
                name: "eyebrow",
                type: "text",
                localized: true,
              }),
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
                admin: { description: "Plain or italic text only." },
              },
              link({
                name: "primaryButton",
                label: "Primary button",
                required: true,
              }),
              link({ name: "secondaryButton", label: "Secondary button" }),
            ],
          },
        ]),
        ...section("link-columns", [
          countedArray({
            name: "linkColumns",
            label: "Link columns",
            labels: { singular: "Link column", plural: "Link columns" },
            type: "array",
            maxRows: MAX_LINK_COLUMNS,
            admin: {
              description: "Drag to reorder.",
              components: {
                RowLabel: {
                  path: ROW_LABELS.column,
                  clientProps: { maxLinks: MAX_COLUMN_LINKS },
                },
              },
            },
            fields: [
              withSameAsEnTag({
                name: "title",
                type: "text",
                localized: true,
                required: true,
              }),
              countedArray({
                name: "links",
                labels: { singular: "Link", plural: "Links" },
                type: "array",
                maxRows: MAX_COLUMN_LINKS,
                admin: { components: { RowLabel: ROW_LABELS.link } },
                fields: [link({ required: true })],
              }),
            ],
          }),
        ]),
        ...section("part-of", [
          {
            name: "partOf",
            label: false,
            type: "group",
            fields: [
              {
                name: "enabled",
                label: "Show the “Part of” block",
                type: "checkbox",
                defaultValue: false,
                admin: {
                  description:
                    "Off: the footer shows no group affiliation. On: a label, the group's logo and a link to its site.",
                },
              },
              withSameAsEnTag({
                name: "label",
                type: "text",
                localized: true,
                admin: { condition: partOfEnabled },
              }),
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
        ]),
        ...section("copyright", [
          {
            name: "copyright",
            type: "text",
            localized: true,
            validate: isCopyrightTemplate,
            admin: {
              description:
                "Use {year} for the current year and {legalName} for the company's legal name from Tenant Settings, e.g. Copyright © {year} {legalName}. All Rights Reserved.",
              components: {
                afterInput: [
                  SAME_AS_EN_TAG,
                  "/admin/components/fields/CopyrightPreview#CopyrightPreview",
                ],
              },
            },
          },
        ]),
      ]),
    ],
  }),
  { isGlobal: true },
);
