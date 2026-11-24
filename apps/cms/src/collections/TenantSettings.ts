import type {
  EmailFieldValidation,
  FieldHook,
  SelectFieldSingleValidation,
} from "payload";
import { email, select } from "payload/shared";

import { readMembersOrSite, superAdmins } from "../access";
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
import { PRIVACY_POLICY_VERSION_HINT } from "../consent/privacyPolicyVersion";
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

export const EMAIL_ERROR = "Enter a valid email address, like name@company.com";

export const trimEmail: FieldHook = ({ value }) =>
  typeof value === "string" ? value.trim() : value;

export const isValidEmail: EmailFieldValidation = (value, args) => {
  const trimmed = typeof value === "string" ? value.trim() : value;
  if (!trimmed || email(trimmed, args) === true) return true;
  return EMAIL_ERROR;
};

import {
  CAREER_PAGE_NOTE,
  PUBLICATION_PAGE_NOTE,
} from "../admin/components/routing/routing";
import { routingNote } from "../admin/components/routing/fieldConfig";

const PRIVACY_POLICY_VERSION_WARNING =
  "/admin/components/fields/PrivacyPolicyVersionWarning#PrivacyPolicyVersionWarning";
const TAB_INTRO = "/admin/components/fields/TabIntro#TabIntro";
const CHARACTER_LIMIT =
  "/admin/components/fields/CharacterCount#CharacterLimit";
const COUNTED_LABEL = "/admin/components/fields/CharacterCount#CountedLabel";

export const TenantSettings = withTenantAccess(
  withUpdatedBy({
    slug: "tenant-settings",
    labels: collectionLabels("tenant-settings"),
    access: {
      read: readMembersOrSite,
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
      nav: { icon: "tune", order: 1 },
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
                    label: "Career page \u00B7 lists your jobs",
                    type: "relationship",
                    relationTo: "pages",
                    filterOptions: publishedPagesOfCompany,
                    admin: { description: CAREER_PAGE_NOTE },
                  },
                  {
                    name: "careerPageNote",
                    type: "ui",
                    admin: { components: { Field: routingNote("careerPage") } },
                  },
                  {
                    name: "publicationPage",
                    label: "Publication page",
                    type: "relationship",
                    relationTo: "pages",
                    filterOptions: publishedPagesOfCompany,
                    admin: { description: PUBLICATION_PAGE_NOTE },
                  },
                  {
                    name: "publicationPageNote",
                    type: "ui",
                    admin: {
                      components: { Field: routingNote("publicationPage") },
                    },
                  },
                ],
              },
              {
                name: "privacyPolicyVersion",
                label: "Privacy Policy version",
                type: "text",
                required: true,
                localized: false,
                admin: {
                  className: "dil-mono-input",
                  placeholder: "2026-11",
                  description: PRIVACY_POLICY_VERSION_HINT,
                },
              },
              {
                name: "privacyPolicyVersionWarning",
                type: "ui",
                admin: {
                  components: { Field: PRIVACY_POLICY_VERSION_WARNING },
                },
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
                validate: isValidEmail,
                hooks: { beforeValidate: [trimEmail] },
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
                validate: isValidEmail,
                hooks: { beforeValidate: [trimEmail] },
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
                    admin: { hidden: true, readOnly: true },
                  },
                  {
                    name: "shortDescription",
                    label: "Short description",
                    type: "textarea",
                    localized: true,
                    admin: { hidden: true, readOnly: true },
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
                    admin: { hidden: true, readOnly: true },
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
                    admin: { hidden: true, readOnly: true },
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
                  {
                    name: "usedBy",
                    type: "ui",
                    admin: {
                      components: {
                        Field:
                          "/admin/components/profile/ProfileUsedBy#ProfileUsedBy",
                      },
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
