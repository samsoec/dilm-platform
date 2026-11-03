import { IR_DOCUMENT_TYPE_OPTIONS } from "../irDocumentTypes";
import { link } from "../fields/link";
import { headingField, tableNamed } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_IR_SIDE_NAV = 12;

export const DEFAULT_IR_PAGE_SIZE = 5;

export const MAX_IR_PAGE_SIZE = 50;

export const irDocuments = sectionBlock({
  slug: "irDocuments",
  interfaceName: "IrDocumentsBlock",
  group: "Records",
  tableName: "ird",
  catalog: {
    name: "Investor documents",
    purpose:
      "A side menu and the company's published investor documents, newest first, a page at a time.",
    figma: ["section/investor-content"],
    summary: "The heading's title, with the document types shown",
  },
  fields: [
    {
      name: "sideNav",
      type: "array",
      dbName: tableNamed("nav"),
      minRows: 0,
      maxRows: MAX_IR_SIDE_NAV,
      labels: { singular: "Menu link", plural: "Menu links" },
      fields: [link({ name: "link", required: true })],
    },
    headingField({ align: "left" }),
    {
      name: "documentTypes",
      type: "select",
      hasMany: true,
      options: IR_DOCUMENT_TYPE_OPTIONS.map(({ value, label }) => ({
        value,
        label,
      })),
      admin: { description: "Leave empty to show every type." },
    },
    {
      name: "pageSize",
      type: "number",
      required: true,
      defaultValue: DEFAULT_IR_PAGE_SIZE,
      min: 1,
      max: MAX_IR_PAGE_SIZE,
      admin: { step: 1, description: "How many documents show per page." },
    },
  ],
});
