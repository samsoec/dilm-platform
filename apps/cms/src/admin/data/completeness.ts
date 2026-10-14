import type { TenantSetting } from "../../payload-types";

export type SettingsSection =
  "general" | "brand" | "contact" | "careers" | "seo";

export type SectionSeverity = "error" | "warning";

export type CompletenessInput = {
  siteName?: TenantSetting["siteName"] | null;
  contactEmail?: TenantSetting["contactEmail"];
  contactPhone?: TenantSetting["contactPhone"];
  recruiterEmail?: TenantSetting["recruiterEmail"];
  brand?: Partial<
    Pick<
      NonNullable<TenantSetting["brand"]>,
      "logoOnDark" | "logoOnLight" | "legalName"
    >
  > | null;
  defaultSeo?: Partial<
    Pick<NonNullable<TenantSetting["defaultSeo"]>, "title">
  > | null;
};

type Rule = {
  section: SettingsSection;
  severity: SectionSeverity;
  complete: (settings: CompletenessInput) => boolean;
};

function filled(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== null && value !== undefined;
}

export const COMPLETENESS_RULES: readonly Rule[] = [
  {
    section: "general",
    severity: "warning",
    complete: ({ siteName }) => filled(siteName),
  },
  {
    section: "brand",
    severity: "warning",
    complete: ({ brand }) =>
      filled(brand?.logoOnDark) &&
      filled(brand?.logoOnLight) &&
      filled(brand?.legalName),
  },
  {
    section: "contact",
    severity: "warning",
    complete: ({ contactEmail, contactPhone }) =>
      filled(contactEmail) || filled(contactPhone),
  },
  {
    section: "careers",
    severity: "error",
    complete: ({ recruiterEmail }) => filled(recruiterEmail),
  },
  {
    section: "seo",
    severity: "warning",
    complete: ({ defaultSeo }) => filled(defaultSeo?.title),
  },
];

export const COMPLETENESS_SELECT = {
  siteName: true,
  contactEmail: true,
  contactPhone: true,
  recruiterEmail: true,
  brand: { logoOnDark: true, logoOnLight: true, legalName: true },
  defaultSeo: { title: true },
} as const;

export type SectionStatus = {
  section: SettingsSection;
  severity: SectionSeverity;
  complete: boolean;
};

export function settingsCompleteness(
  settings: CompletenessInput | null | undefined,
): SectionStatus[] {
  return COMPLETENESS_RULES.map(({ section, severity, complete }) => ({
    section,
    severity,
    complete: settings ? complete(settings) : false,
  }));
}

export function settingsNeedAttention(
  settings: CompletenessInput | null | undefined,
): boolean {
  return settingsCompleteness(settings).some(({ complete }) => !complete);
}
