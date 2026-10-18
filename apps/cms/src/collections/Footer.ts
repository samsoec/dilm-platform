import {
  FixedToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";
import type {
  Condition,
  FieldHook,
  RichTextFieldValidation,
  TextFieldSingleValidation,
} from "payload";
import { richText } from "payload/shared";

import { superAdmins } from "../access";
import { isPlainOrItalic, plainOrItalic } from "../admin/footerSections";
import { navGroup } from "../admin/navGroups";
import { LIVE_DOCUMENT_CONTROLS } from "../admin/shell";
import {
  countedArray,
  localeBanner,
  ROW_LABELS,
  SAME_AS_EN_TAG,
  section,
  sectionJump,
  sourcedFrom,
  versionInfo,
  withSameAsEnTag,
} from "../fields/layoutEditor";
import { link } from "../fields/link";
import { keepRowStructure, lockStructure } from "../fields/structure";
import { withUpdatedBy } from "../fields/updatedBy";
import { withTenantAccess } from "../tenancy";
import { collectionLabels } from "../admin/labels";
import { withMediaPicker } from "../fields/mediaPicker";

export const MAX_LINK_COLUMNS = 4;

export const MAX_COLUMN_LINKS = 8;

export const COPYRIGHT_TOKENS = ["year", "legalName"] as const;

export const isItalicOnlyHeading: RichTextFieldValidation = async (
  value,
  args,
) => richText(value, args);

const cleanHeading: FieldHook = ({ value }) => {
  const root = (value as { root?: Parameters<typeof plainOrItalic>[0] } | null)
    ?.root;
  return root && !isPlainOrItalic(root)
    ? { ...(value as object), root: plainOrItalic(root) }
    : value;
};

const KNOWN_TOKENS = new Set<string>(COPYRIGHT_TOKENS);

export const isCopyrightTemplate: TextFieldSingleValidation = (value) => {
  if (!value) return true;
  const unknown = [...value.matchAll(/\{([^{}]*)\}/g)]
    .filter(([, token]) => !KNOWN_TOKENS.has(token ?? ""))
    .map(([placeholder]) => placeholder);
  if (unknown.length > 0) {
    return `${unknown[0]} isn't a placeholder. Use {year} or {legalName}.`;
  }
  return /[{}]/.test(value.replace(/\{[^{}]*\}/g, ""))
    ? "Close every placeholder: {year} or {legalName}."
    : true;
};

const ARRAY_NOTE = "/admin/components/fields/ArrayLimitNote#ArrayLimitNote";

const partOfEnabled: Condition = (_, siblingData) =>
  Boolean((siblingData as { enabled?: boolean } | undefined)?.enabled);

export const Footer = withTenantAccess(
  withUpdatedBy({
    slug: "footer",
    labels: collectionLabels("footer"),
    admin: {
      group: navGroup("layout"),
      components: { edit: LIVE_DOCUMENT_CONTROLS },
    },
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
      sectionJump,
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
                hooks: { beforeValidate: [cleanHeading] },
                editor: lexicalEditor({
                  features: () => [
                    ParagraphFeature(),
                    ItalicFeature(),
                    FixedToolbarFeature(),
                  ],
                }),
                admin: {
                  description:
                    "Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.",
                },
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
              className: "dil-column-cards",
              initCollapsed: true,
              components: {
                afterInput: [ARRAY_NOTE],
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
                  className: "dil-switch",
                  description:
                    "Hidden on the site. Turn on to show a parent-company logo.",
                },
              },
              withSameAsEnTag({
                name: "label",
                type: "text",
                localized: true,
                admin: { condition: partOfEnabled },
              }),
              withMediaPicker(
                {
                  name: "logo",
                  type: "upload",
                  relationTo: "media",
                  admin: { condition: partOfEnabled },
                },
                { chooseLabel: "Choose from Media…" },
              ),
              {
                ...link({ label: "Link · optional" }),
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
                "Use {year} for the current year and {legalName} for the company's legal name from Company settings, e.g. Copyright © {year} {legalName}. All Rights Reserved.",
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
