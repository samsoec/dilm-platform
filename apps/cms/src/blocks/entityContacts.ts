import {
  ENTITY_CONTACT_SOURCES,
  MAX_ENTITY_ITEMS,
  type EntityContactSource,
} from "@dilm/shared-types";
import type {
  FieldHook,
  RelationshipFieldManyValidation,
  SelectField,
} from "payload";

import { entityScope, validateEntityPicks } from "../fields/recordPicks";
import { headingField, whenBlock } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const ENTITY_CONTACT_LABELS: Record<EntityContactSource, string> = {
  others: "Every other company",
  manual: "Hand-picked",
};

export const PICK_A_COMPANY = "Pick at least one company.";

type BlockData = { source?: string | null };

const isManual = (data: unknown) =>
  ((data as BlockData | undefined)?.source ?? "others") === "manual";

const clearUnlessManual: FieldHook = ({ value, siblingData }) =>
  isManual(siblingData) ? value : null;

const validateContactPicks: RelationshipFieldManyValidation = (value, args) => {
  if (!isManual(args.siblingData)) return true;
  if (!Array.isArray(value) || value.length === 0) return PICK_A_COMPANY;
  return validateEntityPicks(value, args);
};

const source: SelectField = {
  name: "source",
  type: "select",
  required: true,
  defaultValue: "others",
  options: ENTITY_CONTACT_SOURCES.map((value) => ({
    value,
    label: ENTITY_CONTACT_LABELS[value],
  })),
};

export const entityContacts = sectionBlock({
  slug: "entityContacts",
  interfaceName: "EntityContactsBlock",
  group: "Company sections",
  tableName: "eco",
  catalog: {
    name: "Other companies' contacts",
    purpose:
      "Contact cards for the group's other companies, or for hand-picked ones; logo, legal name, address and contacts come from each company's Company settings.",
    figma: ["section/other-contact"],
    summary: "The heading's title, with the source",
  },
  fields: [
    headingField({ align: "center" }),
    source,
    {
      name: "entities",
      label: "Companies",
      type: "relationship",
      relationTo: "tenants",
      hasMany: true,
      minRows: 1,
      maxRows: MAX_ENTITY_ITEMS,
      maxDepth: 0,
      filterOptions: entityScope,
      validate: validateContactPicks,
      hooks: { beforeChange: [clearUnlessManual] },
      admin: { condition: whenBlock("source", "others", "manual") },
    },
  ],
});
