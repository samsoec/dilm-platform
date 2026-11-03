import type { ArrayField, Field } from "payload";

import {
  readPublishedOrMembers,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { iconField } from "../blocks/factories";
import { sameCompanyDocuments } from "../catalog";
import { withTrashedBy } from "../fields/authoring";
import { bodyTextField } from "../fields/bodyText";
import { formulaField } from "../fields/formula";
import { italicHeadingField } from "../fields/italicHeading";
import { withMediaPicker } from "../fields/mediaPicker";
import { recordAddressFields } from "../fields/recordFields";
import { keepRowStructure, lockStructure } from "../fields/structure";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  beginLiveChange,
  revalidateOnDelete,
  revalidateOnLiveChange,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { removeRoutes, syncRoutes } from "../routeIndex";
import { requireBase } from "../siteRouting";
import { CATALOG_SCOPE, withTenantAccess } from "../tenancy";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const MAX_VARIANTS = 20;
export const MAX_SPEC_ROWS = 30;
export const MAX_APPLICATIONS = 8;
export const MAX_PROCESS_STEPS = 6;

function documentField(
  name: string,
  label: string,
): Extract<Field, { type: "upload" }> {
  return {
    name,
    label,
    type: "upload",
    relationTo: "documents",
    filterOptions: sameCompanyDocuments(),
  };
}

const specs: ArrayField = {
  name: "specs",
  label: "Specifications",
  type: "array",
  minRows: 1,
  maxRows: MAX_SPEC_ROWS,
  labels: { singular: "Specification", plural: "Specifications" },
  fields: [
    {
      name: "parameter",
      label: "Parameter",
      type: "text",
      localized: true,
      required: true,
    },
    { name: "method", label: "Method", type: "text" },
    {
      name: "value",
      label: "Guaranteed value",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "emphasized",
      label: "Bold row",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

const variants: ArrayField = {
  name: "variants",
  label: "Variants",
  type: "array",
  minRows: 0,
  maxRows: MAX_VARIANTS,
  labels: { singular: "Variant", plural: "Variants" },
  admin: { initCollapsed: true },
  fields: [
    { name: "name", label: "Variant name", type: "text", required: true },
    formulaField({
      name: "formula",
      label: "Formula",
      description:
        "Leave empty to use the product's formula. Subscript and superscript only.",
    }),
    {
      name: "casNumber",
      label: "CAS number",
      type: "text",
      admin: { description: "Leave empty to use the product's CAS number." },
    },
    {
      name: "classification",
      label: "Classification",
      type: "text",
      localized: true,
      admin: {
        description: "Leave empty to use the product's classification.",
      },
    },
    {
      name: "packaging",
      label: "Packaging",
      type: "text",
      localized: true,
    },
    specs,
    documentField("pdsFile", "Product data sheet (PDS)"),
    documentField("sdsFile", "Safety data sheet (SDS)"),
  ],
};

const applications: ArrayField = {
  name: "applications",
  label: "Applications",
  type: "array",
  minRows: 0,
  maxRows: MAX_APPLICATIONS,
  labels: { singular: "Application", plural: "Applications" },
  fields: [
    iconField({ name: "icon", label: "Icon" }),
    {
      name: "title",
      label: "Title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      localized: true,
    },
  ],
};

const processSteps: ArrayField = {
  name: "steps",
  label: "Steps",
  type: "array",
  minRows: 0,
  maxRows: MAX_PROCESS_STEPS,
  labels: { singular: "Step", plural: "Steps" },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      localized: true,
    },
    {
      name: "isThisProduct",
      label: "This product's step",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

export const Products = withTenantAccess(
  withTrashedBy(
    withUpdatedBy({
      slug: "products",
      labels: collectionLabels("products"),
      access: {
        read: readPublishedOrMembers,
        delete: trashByEditorsDeleteBySuperAdmins,
      },
      versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
      trash: true,
      hooks: {
        beforeChange: [
          requireBase("products"),
          keepRowStructure,
          beginLiveChange,
        ],
        afterChange: [syncRoutes, revalidateOnLiveChange(stubRevalidator)],
        afterDelete: [revalidateOnDelete(stubRevalidator)],
        beforeDelete: [removeRoutes],
      },
      admin: {
        group: navGroup("content"),
        useAsTitle: "name",
        defaultColumns: [
          "name",
          "productGroup",
          "tenant",
          "_status",
          "updatedAt",
        ],
        listSearchableFields: ["name", "productGroup", "slug"],
      },
      defaultSort: "order",
      custom: { nav: { icon: "science", order: 3 } },
      fields: [
        ...recordAddressFields(),
        {
          type: "tabs",
          tabs: [
            {
              label: "Card & hero",
              fields: lockStructure([
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                  localized: true,
                  required: true,
                },
                {
                  name: "productGroup",
                  label: "Product group",
                  type: "text",
                  localized: true,
                },
                {
                  name: "shortDescription",
                  label: "Short description",
                  type: "textarea",
                  localized: true,
                },
                withMediaPicker({
                  name: "image",
                  label: "Image",
                  type: "upload",
                  relationTo: "media",
                }),
                formulaField({ name: "formula", label: "Formula" }),
                { name: "casNumber", label: "CAS number", type: "text" },
                {
                  name: "classification",
                  label: "Classification",
                  type: "text",
                  localized: true,
                },
                documentField("pdsFile", "Product data sheet (PDS)"),
              ]),
            },
            {
              label: "Overview",
              fields: lockStructure([
                {
                  name: "overview",
                  label: "Overview",
                  type: "group",
                  fields: [
                    italicHeadingField({ name: "title", label: "Title" }),
                    bodyTextField({ name: "body", label: "Body" }),
                    withMediaPicker({
                      name: "image",
                      label: "Image",
                      type: "upload",
                      relationTo: "media",
                    }),
                  ],
                },
              ]),
            },
            { label: "Variants", fields: lockStructure([variants]) },
            { label: "Applications", fields: lockStructure([applications]) },
            {
              label: "Example process",
              fields: lockStructure([
                {
                  name: "process",
                  label: "Example process",
                  type: "group",
                  fields: [
                    italicHeadingField({ name: "title", label: "Title" }),
                    {
                      name: "description",
                      label: "Description",
                      type: "textarea",
                      localized: true,
                    },
                    {
                      name: "stat",
                      label: "Highlighted figure",
                      type: "group",
                      fields: [
                        {
                          name: "value",
                          label: "Value",
                          type: "text",
                          localized: true,
                        },
                        {
                          name: "label",
                          label: "Label",
                          type: "text",
                          localized: true,
                        },
                        {
                          name: "description",
                          label: "Description",
                          type: "textarea",
                          localized: true,
                        },
                        {
                          name: "note",
                          label: "Note",
                          type: "text",
                          localized: true,
                        },
                      ],
                    },
                    processSteps,
                  ],
                },
              ]),
            },
          ],
        },
      ],
    }),
  ),
  CATALOG_SCOPE,
);
