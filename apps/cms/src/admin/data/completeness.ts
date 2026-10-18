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

export type LaunchGap = { label: string; path: CompletenessPath };

type Rule = {
  section: SettingsSection;
  severity: SectionSeverity;
  missing: (settings: CompletenessInput) => LaunchGap[];
};

function filled(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== null && value !== undefined;
}

function gaps(...checks: [boolean, LaunchGap][]): LaunchGap[] {
  return checks.filter(([ok]) => !ok).map(([, gap]) => gap);
}

export const COMPLETENESS_RULES: readonly Rule[] = [
  {
    section: "general",
    severity: "warning",
    missing: ({ siteName }) =>
      gaps([filled(siteName), { label: "site name", path: "siteName" }]),
  },
  {
    section: "brand",
    severity: "warning",
    missing: ({ brand }) =>
      gaps(
        [
          filled(brand?.logoOnLight),
          { label: "light logo", path: "brand.logoOnLight" },
        ],
        [
          filled(brand?.logoOnDark),
          { label: "dark logo", path: "brand.logoOnDark" },
        ],
        [
          filled(brand?.legalName),
          { label: "legal name", path: "brand.legalName" },
        ],
      ),
  },
  {
    section: "contact",
    severity: "warning",
    missing: ({ contactEmail, contactPhone }) =>
      gaps([
        filled(contactEmail) || filled(contactPhone),
        { label: "email or phone", path: "contactEmail" },
      ]),
  },
  {
    section: "careers",
    severity: "error",
    missing: ({ recruiterEmail }) =>
      gaps([
        filled(recruiterEmail),
        { label: "recruiter email", path: "recruiterEmail" },
      ]),
  },
  {
    section: "seo",
    severity: "warning",
    missing: ({ defaultSeo }) =>
      gaps([
        filled(defaultSeo?.title),
        { label: "default title", path: "defaultSeo.title" },
      ]),
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
  missing: LaunchGap[];
};

export function settingsCompleteness(
  settings: CompletenessInput | null | undefined,
): SectionStatus[] {
  return COMPLETENESS_RULES.map(({ section, severity, missing }) => {
    const gaps = missing(settings ?? {});
    return { section, severity, complete: gaps.length === 0, missing: gaps };
  });
}

export type LaunchItem = LaunchGap & {
  section: SettingsSection;
  severity: SectionSeverity;
};

export function launchItems(statuses: SectionStatus[]): LaunchItem[] {
  return statuses
    .flatMap(({ section, severity, missing }) =>
      missing.map((gap) => ({
        ...gap,
        section,
        severity,
        label: `${settingsTabLabel(section)} · ${gap.label}`,
      })),
    )
    .sort(
      (a, b) => Number(b.severity === "error") - Number(a.severity === "error"),
    );
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
