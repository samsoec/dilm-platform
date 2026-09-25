import { superAdmins } from "../access";
import { withTenantAccess } from "../tenancy";
import {
  isGa4MeasurementId,
  isHttpsUrl,
  isPhoneNumber,
  isWhatsAppLink,
} from "../validation";

export const SOCIAL_PLATFORMS = [
  "facebook",
  "instagram",
  "linkedin",
  "x",
  "youtube",
  "tiktok",
] as const;

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
