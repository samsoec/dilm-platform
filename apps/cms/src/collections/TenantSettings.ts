import type {
  EmailFieldValidation,
  SelectFieldSingleValidation,
} from "payload";
import { email, select } from "payload/shared";

import { superAdmins } from "../access";
import { settingsTabLabel } from "../admin/data/completeness";
import {
  SEO_LIMITS,
  SOCIAL_PLATFORM_OPTIONS,
  SOCIAL_PLATFORMS,
} from "../admin/data/socialPlatforms";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { LIVE_DOCUMENT_CONTROLS } from "../admin/shell";
import { withMediaPicker } from "../fields/mediaPicker";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  cascadeCompanyRouting,
  checkCompanyRouting,
  publishedPagesOfCompany,
} from "../siteRouting";
import { revalidateEntityReferrers } from "../publishRevalidation";
import { revalidateTenantLayout, stubRevalidator } from "../revalidation";
import { withTenantAccess } from "../tenancy";
import {
  isGa4MeasurementId,
  isHttpsUrl,
  isPhoneNumber,
  isWhatsAppLink,
} from "../validation";

export { SOCIAL_PLATFORMS };

export const PROFILE_MAX_REGIONS = 10;

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

async function tenantDomain(
  args: Parameters<EmailFieldValidation>[1],
): Promise<string | undefined> {
  const tenant = (args.data as { tenant?: unknown } | undefined)?.tenant;
  const id =
    tenant && typeof tenant === "object" && "id" in tenant
      ? (tenant as { id: number | string }).id
      : tenant;
  const payload = args.req?.payload;
  if (
    (typeof id !== "number" && typeof id !== "string") ||
    typeof payload?.findByID !== "function"
  ) {
    return undefined;
  }
  try {
    const doc = await payload.findByID({
      collection: "tenants",
      id,
      depth: 0,
      select: { domain: true },
    });
    return doc.domain ?? undefined;
  } catch {
    return undefined;
  }
}

export function isFullEmail(mailbox: string): EmailFieldValidation {
  return async (value, args) => {
    if (!value || email(value, args) === true) return true;
    const domain = (await tenantDomain(args)) ?? "example.com";
    return `Enter a full email, like ${mailbox}@${domain}`;
  };
}

const TAB_INTRO = "/admin/components/fields/TabIntro#TabIntro";
const CHARACTER_LIMIT =
  "/admin/components/fields/CharacterCount#CharacterLimit";
const COUNTED_LABEL = "/admin/components/fields/CharacterCount#CountedLabel";

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
    hooks: {
      beforeChange: [checkCompanyRouting],
      afterChange: [
        cascadeCompanyRouting,
        revalidateTenantLayout(stubRevalidator),
        revalidateEntityReferrers(stubRevalidator),
      ],
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
              {
                name: "routing",
                type: "group",
                label: false,
                admin: { hideGutter: true, className: "dil-flat-group" },
                fields: [
                  {
                    name: "careerPage",
                    label: "Career page",
                    type: "relationship",
                    relationTo: "pages",
                    filterOptions: publishedPagesOfCompany,
                    admin: {
                      description:
                        "Every job's URL is this page's URL plus the job's slug.",
                    },
                  },
                  {
                    name: "publicationPage",
                    label: "Publication page",
                    type: "relationship",
                    relationTo: "pages",
                    filterOptions: publishedPagesOfCompany,
                    admin: {
                      description:
                        "Used by the navbar search, the All tab on the post listing and the post breadcrumb. It can't be trashed or unpublished while it is set here.",
                    },
                  },
                ],
              },
            ],
          },
          {
            label: settingsTabLabel("brand"),
            fields: [
              {
                name: "brand",
                type: "group",
                label: false,
                admin: { hideGutter: true, className: "dil-flat-group" },
                fields: [
                  {
                    type: "row",
                    fields: [
                      withMediaPicker(
                        {
                          name: "logoOnLight",
                          label: "Logo for light backgrounds",
                          type: "upload",
                          relationTo: "media",
                          admin: {
                            description: "Header on white, footer on light.",
                            width: "50%",
                          },
                        },
                        { preview: "light", launchRequired: true },
                      ),
                      withMediaPicker(
                        {
                          name: "logoOnDark",
                          label: "Logo for dark backgrounds",
                          type: "upload",
                          relationTo: "media",
                          admin: {
                            description: "Transparent header over photos.",
                            width: "50%",
                          },
                        },
                        { preview: "dark", launchRequired: true },
                      ),
                    ],
                  },
                  {
                    name: "legalName",
                    label: "Legal name",
                    type: "text",
                    admin: {
                      description: "Fills {legalName} in the footer copyright.",
                    },
                  },
                  {
                    type: "row",
                    fields: [
                      {
                        name: "tagline",
                        type: "textarea",
                        localized: true,
                        admin: {
                          description: "Under the footer logo.",
                          rows: 2,
                        },
                      },
                      {
                        name: "address",
                        type: "textarea",
                        localized: true,
                        admin: {
                          description: "Footer contact block.",
                          placeholder: "Street, city, postcode",
                          rows: 2,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: settingsTabLabel("contact"),
            fields: [
              {
                name: "contactIntro",
                type: "ui",
                admin: {
                  components: {
                    Field: {
                      path: TAB_INTRO,
                      clientProps: {
                        text: "These appear in the footer. Email or phone is needed for launch.",
                      },
                    },
                  },
                },
              },
              {
                name: "contactEmail",
                label: "Contact email",
                type: "email",
                validate: isFullEmail("info"),
              },
              {
                name: "contactPhone",
                label: "Contact phone",
                type: "text",
                validate: isPhoneNumber,
              },
              {
                name: "waLink",
                label: "WhatsApp link",
                type: "text",
                validate: isWhatsAppLink,
                admin: { className: "dil-mono-input" },
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
                label: "Recruiter notification email",
                type: "email",
                validate: isFullEmail("hr"),
                admin: {
                  className: "dil-launch-required",
                  description:
                    "Changes apply to applications received after you save.",
                  components: {
                    Label:
                      "/admin/components/fields/LaunchRequiredLabel#LaunchRequiredLabel",
                  },
                },
              },
            ],
          },
          {
            label: `${settingsTabLabel("profile")} · optional`,
            fields: [
              {
                name: "profile",
                type: "group",
                label: false,
                admin: { hideGutter: true, className: "dil-flat-group" },
                fields: [
                  {
                    name: "hubLabel",
                    label: "Hub label",
                    type: "text",
                    localized: true,
                    admin: {
                      description:
                        "Small heading above the company on the map, like Chemical hub in Sumatra.",
                    },
                  },
                  {
                    name: "shortDescription",
                    label: "Short description",
                    type: "textarea",
                    localized: true,
                    admin: { rows: 3 },
                  },
                  withMediaPicker({
                    name: "coverImage",
                    label: "Cover image",
                    type: "upload",
                    relationTo: "media",
                  }),
                  {
                    name: "regions",
                    label: "Regions served",
                    type: "array",
                    maxRows: PROFILE_MAX_REGIONS,
                    labels: { singular: "Region", plural: "Regions" },
                    fields: [
                      {
                        name: "name",
                        type: "text",
                        required: true,
                        localized: true,
                        admin: { placeholder: "All Sumatra" },
                      },
                    ],
                  },
                  {
                    name: "mapPin",
                    label: "Map pin",
                    type: "group",
                    admin: {
                      description:
                        "Position of the company dot on the site's dot map, as a percentage from the top-left corner.",
                    },
                    fields: [
                      {
                        type: "row",
                        fields: [
                          {
                            name: "x",
                            type: "number",
                            min: 0,
                            max: 100,
                            admin: { width: "50%" },
                          },
                          {
                            name: "y",
                            type: "number",
                            min: 0,
                            max: 100,
                            admin: { width: "50%" },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: "mapLocation",
                    label: "Map location",
                    type: "group",
                    admin: {
                      description: "Real-world position for the location map.",
                    },
                    fields: [
                      {
                        type: "row",
                        fields: [
                          {
                            name: "latitude",
                            type: "number",
                            min: -90,
                            max: 90,
                            admin: { width: "50%" },
                          },
                          {
                            name: "longitude",
                            type: "number",
                            min: -180,
                            max: 180,
                            admin: { width: "50%" },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: "googleMapsUrl",
                    label: "Google Maps link",
                    type: "text",
                    validate: isHttpsUrl,
                    admin: {
                      className: "dil-mono-input",
                      placeholder: "https://",
                      description: 'Opened by the "Open Google Map" button.',
                    },
                  },
                ],
              },
            ],
          },
          {
            label: `${settingsTabLabel("social")} · optional`,
            fields: [
              {
                name: "socialLinks",
                label: "Social links",
                type: "array",
                labels: { singular: "Social link", plural: "Social links" },
                admin: {
                  className: "dil-social-links",
                  description:
                    "Each platform once per company. Used platforms stay listed but can't be picked.",
                  components: {
                    RowLabel:
                      "/admin/components/fields/RowLabels#SocialRowLabel",
                  },
                },
                fields: [
                  {
                    type: "row",
                    fields: [
                      {
                        name: "platform",
                        type: "select",
                        required: true,
                        options: SOCIAL_PLATFORM_OPTIONS,
                        validate: isUniquePlatform,
                        admin: {
                          placeholder: "Platform",
                          width: "35%",
                          components: {
                            Field:
                              "/admin/components/fields/PlatformSelect#PlatformSelect",
                          },
                        },
                      },
                      {
                        name: "url",
                        label: "Profile link",
                        type: "text",
                        required: true,
                        validate: isHttpsUrl,
                        admin: {
                          className: "dil-mono-input",
                          placeholder: "https://",
                        },
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
                label: false,
                admin: { hideGutter: true, className: "dil-flat-group" },
                fields: [
                  {
                    name: "title",
                    label: "Default page title",
                    type: "text",
                    localized: true,
                    admin: {
                      className: "dil-counted",
                      components: {
                        Label: {
                          path: COUNTED_LABEL,
                          clientProps: { limit: SEO_LIMITS.title },
                        },
                        afterInput: [
                          {
                            path: CHARACTER_LIMIT,
                            clientProps: { limit: SEO_LIMITS.title, bar: true },
                          },
                        ],
                      },
                    },
                  },
                  {
                    name: "description",
                    label: "Default description",
                    type: "textarea",
                    localized: true,
                    admin: {
                      className: "dil-counted",
                      rows: 3,
                      components: {
                        Label: {
                          path: COUNTED_LABEL,
                          clientProps: { limit: SEO_LIMITS.description },
                        },
                        afterInput: [
                          {
                            path: CHARACTER_LIMIT,
                            clientProps: { limit: SEO_LIMITS.description },
                          },
                        ],
                      },
                    },
                  },
                  withMediaPicker({
                    name: "ogImage",
                    label: "Social-share image",
                    type: "upload",
                    relationTo: "media",
                  }),
                ],
              },
              {
                name: "analyticsId",
                label: "Google Analytics 4 ID",
                type: "text",
                validate: isGa4MeasurementId,
                admin: {
                  className: "dil-mono-input",
                  placeholder: "G-XXXXXXXXXX",
                },
              },
            ],
          },
        ],
      },
    ],
  }),
  { isGlobal: true },
);
