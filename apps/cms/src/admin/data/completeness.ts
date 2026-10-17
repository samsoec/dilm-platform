import type { TenantSetting } from "../../payload-types";

export const SETTINGS_TABS = [
  { section: "general", label: "General" },
  { section: "brand", label: "Brand" },
  { section: "contact", label: "Contact" },
  { section: "careers", label: "Careers" },
  { section: "social", label: "Social" },
  { section: "seo", label: "SEO & analytics" },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["section"];

export type SettingsSection = Exclude<SettingsTab, "social">;

export function settingsTabLabel(section: SettingsTab): string {
  return SETTINGS_TABS.find((tab) => tab.section === section)!.label;
}

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

export const COMPLETENESS_PATHS = [
  "siteName",
  "contactEmail",
  "contactPhone",
  "recruiterEmail",
  "brand.logoOnDark",
  "brand.logoOnLight",
  "brand.legalName",
  "defaultSeo.title",
] as const;

export type CompletenessPath = (typeof COMPLETENESS_PATHS)[number];

export const LOCALIZED_COMPLETENESS_PATHS = [
  "siteName",
  "defaultSeo.title",
] as const satisfies readonly CompletenessPath[];

export type LocalizedCompletenessValues = Partial<
  Record<(typeof LOCALIZED_COMPLETENESS_PATHS)[number], string | null>
>;

type Primitive = string | number | null | undefined;

export function completenessFromValues(
  value: (path: CompletenessPath) => unknown,
  defaultLocaleValues?: LocalizedCompletenessValues,
): CompletenessInput {
  const read = (path: CompletenessPath): Primitive => {
    if (defaultLocaleValues && path in defaultLocaleValues) {
      return defaultLocaleValues[path as keyof LocalizedCompletenessValues];
    }
    const raw = value(path);
    if (raw && typeof raw === "object" && "id" in raw) {
      return (raw as { id: number | string }).id;
    }
    return typeof raw === "string" || typeof raw === "number" ? raw : null;
  };
  return {
    siteName: read("siteName") as string | null,
    contactEmail: read("contactEmail") as string | null,
    contactPhone: read("contactPhone") as string | null,
    recruiterEmail: read("recruiterEmail") as string | null,
    brand: {
      logoOnDark: read("brand.logoOnDark") as number | null,
      logoOnLight: read("brand.logoOnLight") as number | null,
      legalName: read("brand.legalName") as string | null,
    },
    defaultSeo: { title: read("defaultSeo.title") as string | null },
  };
}
