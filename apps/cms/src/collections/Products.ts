import { publishImpactEndpoint } from "../publish/impact";
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
import { formulaField, formulaPlainText } from "../fields/formula";
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
import { EDITOR_TAB_CLASS } from "../admin/components/editor/editor";
import { withEditorShell } from "../fields/pageEditor";
import { localizedSeoFields } from "../pageModel";
import {
  FORMULA_HINT,
  MAX_SPEC_ROWS,
  MAX_VARIANTS,
  SHORT_DESCRIPTION_LIMIT,
} from "../admin/components/products/productEditor";

const PARTS = "/admin/components/products/ProductEditorParts";
const SERVER = "/admin/components/products/server";

function ui(name: string, Field: string, position?: "sidebar"): Field {
  return {
    name,
    type: "ui",
    admin: { ...(position ? { position } : {}), components: { Field } },
  };
}

function hideSystemField(field: Field): Field {
  return "name" in field &&
    (field.name === "path" || field.name === "slugFallback")
    ? ({ ...field, admin: { ...field.admin, hidden: true } } as Field)
    : field;
}

function inherited(): { Description: string } {
  return { Description: `${PARTS}#InheritedNote` };
}

export { MAX_VARIANTS, MAX_SPEC_ROWS };
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
    admin: { components: { Description: `${PARTS}#DocumentUsage` } },
  };
}

const specs: ArrayField = {
  name: "specs",
  label: "Specifications",
  type: "array",
  minRows: 1,
  maxRows: MAX_SPEC_ROWS,
  labels: { singular: "Row", plural: "Rows" },
  admin: {
    components: {
      Label: `${PARTS}#SpecsLabel`,
      afterInput: [`${PARTS}#SpecsPaste`],
    },
  },
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
  admin: {
    initCollapsed: true,
    components: {
      Label: `${PARTS}#VariantsLabel`,
      RowLabel: `${PARTS}#VariantRowLabel`,
    },
  },
  fields: [
    { name: "name", label: "Variant name", type: "text", required: true },
    {
      ...formulaField({ name: "formula", label: "Formula" }),
      admin: {
        components: inherited(),
      },
    },
    {
      name: "casNumber",
      label: "CAS number",
      type: "text",
      admin: { components: inherited() },
    },
    {
      name: "classification",
      label: "Classification",
      type: "text",
      localized: true,
      admin: { components: inherited() },
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

function seoGroup(): Field {
  const [title, description, image] = localizedSeoFields({
    defaultFields: [
      { name: "title", label: "Search title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "image",
        label: "Share image",
        type: "upload",
        relationTo: "media",
      },
    ],
  });
  return {
    name: "meta",
    label: false,
    type: "group",
    admin: { hideGutter: true },
    fields: [title!, description!, image!],
  };
}

export const Products = withTenantAccess(
  withEditorShell(
    withTrashedBy(
      withUpdatedBy({
        slug: "products",
        endpoints: [publishImpactEndpoint("products")],
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
            ({ data }) => ({
              ...data,
              formulaText: formulaPlainText(data?.formula),
            }),
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
          components: {
            views: {
              list: {
                Component:
                  "/admin/components/products/ProductsView#ProductsView",
              },
            },
          },
        },
        defaultSort: "order",
        custom: { nav: { icon: "science", order: 4 } },
        fields: [
          {
            name: "formulaText",
            type: "text",
            index: true,
            admin: { hidden: true, readOnly: true },
            access: { create: () => false, update: () => false },
          },
          {
            name: "ownerBanner",
            type: "ui",
            admin: {
              components: {
                Field:
                  "/admin/components/products/ProductOwnerBanner#ProductOwnerBanner",
              },
            },
          },
          ui("productHeader", `${SERVER}#ProductHeaderField`),
          ui("productActions", `${SERVER}#ProductActionsField`),
          ui("productTabMarks", `${SERVER}#ProductTabMarksField`),
          ui("productSidebar", `${SERVER}#ProductSidebarField`, "sidebar"),
          ...recordAddressFields().map(hideSystemField),
          {
            type: "tabs",
            admin: { className: EDITOR_TAB_CLASS },
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
                    admin: {
                      components: {
                        Label: {
                          path: `${PARTS}#ShortDescriptionLabel`,
                          clientProps: { limit: SHORT_DESCRIPTION_LIMIT },
                        },
                      },
                    },
                  },
                  withMediaPicker({
                    name: "image",
                    label: "Image",
                    type: "upload",
                    relationTo: "media",
                  }),
                  formulaField({
                    name: "formula",
                    label: "Formula",
                    description: FORMULA_HINT,
                  }),
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
              { label: "SEO", fields: [seoGroup()] },
            ],
          },
        ],
      }),
    ),
  ),
  CATALOG_SCOPE,
);
