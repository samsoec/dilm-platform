import type { SelectFieldSingleValidation } from "payload";
import { select } from "payload/shared";

import { superAdmins } from "../access";
import { withTenantAccess } from "../tenancy";
import {
  isGa4MeasurementId,
  isHttpsUrl,
  isPhoneNumber,
  isWhatsAppLink,
} from "../validation";

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
  {
    slug: "tenant-settings",
    access: {
      delete: superAdmins,
    },
    admin: {
      useAsTitle: "siteName",
    },
    fields: [
      {
        name: "siteName",
        type: "text",
        required: true,
        localized: true,
      },
      {
        type: "row",
        fields: [
          { name: "contactEmail", type: "email" },
          { name: "contactPhone", type: "text", validate: isPhoneNumber },
        ],
      },
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
                  description: "Dark-coloured logo for the white navbar.",
                },
              },
            ],
          },
          { name: "legalName", type: "text" },
          { name: "tagline", type: "textarea", localized: true },
          { name: "address", type: "textarea", localized: true },
        ],
      },
      {
        name: "recruiterEmail",
        type: "email",
        admin: {
          description:
            "Receives a notification for every career application to this tenant.",
        },
      },
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
      {
        name: "waLink",
        label: "WhatsApp link",
        type: "text",
        validate: isWhatsAppLink,
      },
    ],
  },
  { isGlobal: true },
);
