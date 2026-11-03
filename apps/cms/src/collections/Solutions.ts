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
import { removeRoutes, syncRoutes } from "../routeIndex";
import {
  CATALOG_SCOPE,
  unscopedRelationship,
  withTenantAccess,
} from "../tenancy";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

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
  withTrashedBy(
    withUpdatedBy({
      slug: "solutions",
      labels: collectionLabels("solutions"),
      access: {
        read: readPublishedOrMembers,
        delete: trashByEditorsDeleteBySuperAdmins,
      },
      versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
      trash: true,
      hooks: {
        beforeChange: [keepRowStructure],
        afterChange: [syncRoutes],
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
      },
      defaultSort: "order",
      custom: { nav: { icon: "dashboard_customize", order: 4 } },
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
                textRows("keyApplications", "Key applications", "Application"),
                textRows("industriesServed", "Industries served", "Industry"),
                unscopedRelationship({
                  name: "supportingProducts",
                  label: "Supporting products",
                  type: "relationship",
                  relationTo: "products",
                  hasMany: true,
                  filterOptions: publishedProducts,
                  admin: {
                    description:
                      "Pick from every company's published products. The order here is the order shown.",
                  },
                }),
                unscopedRelationship({
                  name: "featuredProduct",
                  label: "Featured product",
                  type: "relationship",
                  relationTo: "products",
                  filterOptions: publishedProducts,
                  validate: validateFeaturedProduct,
                  admin: {
                    description:
                      "Optional. It has to be one of the supporting products. Empty uses the first one.",
                  },
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
  CATALOG_SCOPE,
);
