import {
  FixedToolbarFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";

import { superAdmins } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { LIVE_DOCUMENT_CONTROLS } from "../admin/shell";
import {
  countedArray,
  localeBanner,
  ROW_LABELS,
  versionInfo,
  withSameAsEnTag,
} from "../fields/layoutEditor";
import { link } from "../fields/link";
import { withUpdatedBy } from "../fields/updatedBy";
import { revalidateTenantLayout, stubRevalidator } from "../revalidation";
import { requireCookiePolicyLink } from "../siteMessages";
import { withTenantAccess } from "../tenancy";

export const MAX_NOT_FOUND_BUTTONS = 2;

export const cookieBodyEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      LinkFeature({ enabledCollections: ["pages"] }),
      FixedToolbarFeature(),
    ],
  });

export const SiteMessages = withTenantAccess(
  withUpdatedBy({
    slug: "site-messages",
    labels: collectionLabels("site-messages"),
    admin: {
      group: navGroup("layout"),
      components: { edit: LIVE_DOCUMENT_CONTROLS },
    },
    custom: { nav: { icon: "notifications", order: 3 } },
    access: {
      delete: superAdmins,
    },
    versions: {
      drafts: false,
    },
    hooks: {
      afterChange: [revalidateTenantLayout(stubRevalidator)],
    },
    fields: [
      localeBanner,
      versionInfo,
      {
        name: "notFound",
        label: "Page not found (404)",
        type: "group",
        fields: [
          {
            name: "code",
            type: "text",
            defaultValue: "404",
          },
          withSameAsEnTag({
            name: "title",
            type: "text",
            localized: true,
            required: true,
          }),
          withSameAsEnTag({
            name: "description",
            type: "textarea",
            localized: true,
          }),
          countedArray({
            name: "buttons",
            labels: { singular: "Button", plural: "Buttons" },
            type: "array",
            maxRows: MAX_NOT_FOUND_BUTTONS,
            admin: { components: { RowLabel: ROW_LABELS.link } },
            fields: [link({ required: true })],
          }),
        ],
      },
      {
        name: "cookieBanner",
        label: "Cookie banner",
        type: "group",
        fields: [
          withSameAsEnTag({
            name: "title",
            type: "text",
            localized: true,
            required: true,
          }),
          {
            name: "body",
            type: "richText",
            localized: true,
            validate: requireCookiePolicyLink,
            editor: cookieBodyEditor(),
            admin: {
              description:
                "Link this text to your Cookie Policy page. It can't be saved without that link.",
            },
          },
          withSameAsEnTag({
            name: "acceptLabel",
            type: "text",
            localized: true,
            required: true,
          }),
          withSameAsEnTag({
            name: "rejectLabel",
            type: "text",
            localized: true,
            required: true,
          }),
          {
            name: "policyVersion",
            type: "text",
          },
        ],
      },
    ],
  }),
  { isGlobal: true },
);
