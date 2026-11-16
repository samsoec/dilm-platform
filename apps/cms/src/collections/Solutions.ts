import { publishImpactEndpoint } from "../publish/impact";
import type { ArrayField } from "payload";

import {
  readPublishedOrMembers,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { iconField } from "../blocks/factories";
import { publishedProducts, validateFeaturedProduct } from "../catalog";
import { withTrashedBy } from "../fields/authoring";
import { bodyTextField } from "../fields/bodyText";
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
import {
  CATALOG_SCOPE,
  unscopedRelationship,
  withTenantAccess,
} from "../tenancy";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";
import { EDITOR_TAB_CLASS } from "../admin/components/editor/editor";
import { withEditorShell } from "../fields/pageEditor";
import { hideSystemField, ui } from "./Products";

const PARTS = "/admin/components/solutions/SolutionEditorParts";
const SERVER = "/admin/components/products/server";

export const MAX_HERO_ATTRIBUTES = 10;
export const MAX_IMPACT_POINTS = 6;
export const MAX_SOLUTION_APPLICATIONS = 8;

function textRows(name: string, label: string, singular: string): ArrayField {
  return {
    name,
    label,
    type: "array",
    minRows: 0,
    maxRows: MAX_HERO_ATTRIBUTES,
    labels: { singular, plural: label },
    admin: { components: { Field: `${PARTS}#TagListField` } },
    fields: [
      {
        name: "text",
        label: "Text",
        type: "text",
        localized: true,
        required: true,
      },
    ],
  };
}

const impactPoints: ArrayField = {
  name: "points",
  label: "Points",
  type: "array",
  minRows: 0,
  maxRows: MAX_IMPACT_POINTS,
  labels: { singular: "Point", plural: "Points" },
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

const applications: ArrayField = {
  name: "applications",
  label: "Applications",
  type: "array",
  minRows: 0,
  maxRows: MAX_SOLUTION_APPLICATIONS,
  labels: { singular: "Application", plural: "Applications" },
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
  ],
};

export const Solutions = withTenantAccess(
  withEditorShell(
    withTrashedBy(
      withUpdatedBy({
        slug: "solutions",
        endpoints: [publishImpactEndpoint("solutions")],
        labels: collectionLabels("solutions"),
        access: {
          read: readPublishedOrMembers,
          delete: trashByEditorsDeleteBySuperAdmins,
        },
        versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
        trash: true,
        hooks: {
          beforeChange: [
            requireBase("solutions"),
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
            "industryLabel",
            "tenant",
            "_status",
            "updatedAt",
          ],
          listSearchableFields: ["name", "industryLabel", "slug"],
          components: {
            views: {
              list: {
                Component:
                  "/admin/components/solutions/SolutionsView#SolutionsView",
              },
            },
          },
        },
        defaultSort: "order",
        custom: { nav: { icon: "lightbulb", order: 5 } },
        fields: [
          {
            name: "ownerBanner",
            type: "ui",
            admin: {
              components: {
                Field:
                  "/admin/components/products/ProductOwnerBanner#SolutionOwnerBanner",
              },
            },
          },
          ui("solutionHeader", `${SERVER}#SolutionHeaderField`),
          ui("solutionActions", `${SERVER}#SolutionActionsField`),
          ui("solutionTabMarks", `${SERVER}#SolutionTabMarksField`),
          ui("solutionSidebar", `${SERVER}#SolutionSidebarField`, "sidebar"),
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
                  italicHeadingField({
                    name: "heroTitle",
                    label: "Hero title",
                    description:
                      "Plain or italic only. Leave empty to use the name.",
                  }),
                  {
                    name: "industryLabel",
                    label: "Industry label",
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
                  textRows(
                    "keyApplications",
                    "Key applications",
                    "Application",
                  ),
                  textRows("industriesServed", "Industries served", "Industry"),
                ]),
              },
              {
                label: "Supporting products",
                fields: lockStructure([
                  unscopedRelationship({
                    name: "supportingProducts",
                    label: "Supporting products",
                    type: "relationship",
                    relationTo: "products",
                    hasMany: true,
                    filterOptions: publishedProducts,
                    admin: {
                      components: { Field: `${PARTS}#SupportingProductsField` },
                    },
                  }),
                  unscopedRelationship({
                    name: "featuredProduct",
                    label: "Featured product",
                    type: "relationship",
                    relationTo: "products",
                    filterOptions: publishedProducts,
                    validate: validateFeaturedProduct,
                    admin: { hidden: true },
                  }),
                ]),
              },
              {
                label: "Impact & value",
                fields: lockStructure([
                  {
                    name: "impact",
                    label: "Impact & value",
                    type: "group",
                    fields: [
                      italicHeadingField({ name: "title", label: "Title" }),
                      bodyTextField({ name: "body", label: "Body" }),
                      impactPoints,
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
              { label: "Applications", fields: lockStructure([applications]) },
            ],
          },
        ],
      }),
    ),
  ),
  CATALOG_SCOPE,
);
