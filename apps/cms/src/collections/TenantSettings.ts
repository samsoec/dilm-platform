import type { SelectFieldSingleValidation } from "payload";
import { select } from "payload/shared";

import { superAdmins } from "../access";
import { settingsTabLabel } from "../admin/data/completeness";
import { navGroup } from "../admin/navGroups";
import { LIVE_DOCUMENT_CONTROLS } from "../admin/shell";
import { withUpdatedBy } from "../fields/updatedBy";
import { withTenantAccess } from "../tenancy";
import {
  isGa4MeasurementId,
  isHttpsUrl,
  isPhoneNumber,
  isWhatsAppLink,
} from "../validation";
import { collectionLabels } from "../admin/labels";

export const SOCIAL_PLATFORMS = [
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
] as const;

type SocialLinkRow = { platform?: string | null };

export const isUniquePlatform: SelectFieldSingleValidation = async (
  value,
  args,
) => {
  const allowed = await select(value, args);
  if (allowed !== true || !value) return allowed;
  const rows =
    (args.data as { socialLinks?: SocialLinkRow[] | null } | undefined)
      ?.socialLinks ?? [];
  const count = rows.filter((row) => row?.platform === value).length;
  return count > 1 ? "Each platform can only be listed once." : true;
};

export const TenantSettings = withTenantAccess(
  withUpdatedBy({
    slug: "tenant-settings",
    labels: collectionLabels("tenant-settings"),
    access: {
      delete: superAdmins,
    },
    admin: {
      group: navGroup("settings"),
      useAsTitle: "siteName",
      components: { edit: LIVE_DOCUMENT_CONTROLS },
    },
    versions: {
      drafts: false,
    },
    custom: {
      nav: { icon: "tune" },
    },
    fields: [
      {
        name: "completeness",
        type: "ui",
        admin: {
          position: "sidebar",
          components: {
            Field:
              "/admin/components/fields/CompletenessPanel#CompletenessPanel",
          },
        },
      },
      {
        type: "tabs",
        tabs: [
          {
            label: settingsTabLabel("general"),
            fields: [
              {
                name: "siteName",
                type: "text",
                required: true,
                localized: true,
              },
            ],
          },
          {
            label: settingsTabLabel("brand"),
            fields: [
              {
                name: "brand",
                type: "group",
                fields: [
                  {
                    type: "row",
                    fields: [
                      {
                        name: "logoOnDark",
                        label: "Logo on dark",
                        type: "upload",
                        relationTo: "media",
                        admin: {
                          description:
                            "Light-coloured logo for the transparent navbar and the footer.",
                        },
                      },
                      {
                        name: "logoOnLight",
                        label: "Logo on light",
                        type: "upload",
                        relationTo: "media",
                        admin: {
                          description:
                            "Dark-coloured logo for the white navbar.",
                        },
                      },
                    ],
                  },
                  {
                    name: "legalName",
                    type: "text",
                    admin: {
                      description: "Fills {legalName} in the footer copyright.",
                    },
                  },
                  { name: "tagline", type: "textarea", localized: true },
                  { name: "address", type: "textarea", localized: true },
                ],
              },
            ],
          },
          {
            label: settingsTabLabel("contact"),
            fields: [
              {
                type: "row",
                fields: [
                  { name: "contactEmail", type: "email" },
                  {
                    name: "contactPhone",
                    type: "text",
                    validate: isPhoneNumber,
                  },
                ],
              },
              {
                name: "waLink",
                label: "WhatsApp link",
                type: "text",
                validate: isWhatsAppLink,
              },
            ],
          },
          {
            label: settingsTabLabel("careers"),
            fields: [
              {
                name: "careersNotice",
                type: "ui",
                admin: {
                  components: {
                    Field:
                      "/admin/components/fields/CareersNotice#CareersNotice",
                  },
                },
              },
              {
                name: "recruiterEmail",
                type: "email",
                admin: {
                  description:
                    "Receives a notification for every career application to this company.",
                },
              },
            ],
          },
          {
            label: settingsTabLabel("social"),
            fields: [
              {
                name: "socialLinks",
                type: "array",
                fields: [
                  {
                    type: "row",
                    fields: [
                      {
                        name: "platform",
                        type: "select",
                        required: true,
                        options: [...SOCIAL_PLATFORMS],
                        validate: isUniquePlatform,
                      },
                      {
                        name: "url",
                        type: "text",
                        required: true,
                        validate: isHttpsUrl,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: settingsTabLabel("seo"),
            fields: [
              {
                name: "defaultSeo",
                type: "group",
                fields: [
                  { name: "title", type: "text", localized: true },
                  { name: "description", type: "textarea", localized: true },
                  { name: "ogImage", type: "upload", relationTo: "media" },
                ],
              },
              {
                name: "analyticsId",
                label: "GA4 measurement ID",
                type: "text",
                validate: isGa4MeasurementId,
              },
            ],
          },
        ],
      },
    ],
  }),
  { isGlobal: true },
);
