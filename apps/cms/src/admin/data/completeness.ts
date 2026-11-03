import type { TenantSetting } from "../../payload-types";

export const SETTINGS_TABS = [
  { section: "general", label: "General" },
  { section: "brand", label: "Brand" },
  { section: "contact", label: "Contact" },
  { section: "careers", label: "Careers" },
  { section: "profile", label: "Profile" },
  { section: "social", label: "Social" },
  { section: "seo", label: "SEO & analytics" },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["section"];

export type SettingsSection = Exclude<SettingsTab, "social">;

export function settingsTabLabel(section: SettingsTab): string {
  return SETTINGS_TABS.find((tab) => tab.section === section)!.label;
}

export type SectionSeverity = "error" | "warning" | "optional";

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
  profile?: {
    hubLabel?: string | null;
    shortDescription?: string | null;
    coverImage?: unknown;
    regions?: readonly unknown[] | null;
    mapPin?: { x?: number | null; y?: number | null } | null;
    mapLocation?: {
      latitude?: number | null;
      longitude?: number | null;
    } | null;
    googleMapsUrl?: string | null;
  } | null;
};

export type LaunchGap = { label: string; path: CompletenessPath };

type Rule = {
  section: SettingsSection;
  severity: SectionSeverity;
  total: number;
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
    total: 1,
    missing: ({ siteName }) =>
      gaps([filled(siteName), { label: "site name", path: "siteName" }]),
  },
  {
    section: "brand",
    severity: "warning",
    total: 3,
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
    total: 1,
    missing: ({ contactEmail, contactPhone }) =>
      gaps([
        filled(contactEmail) || filled(contactPhone),
        { label: "email or phone", path: "contactEmail" },
      ]),
  },
  {
    section: "careers",
    severity: "error",
    total: 1,
    missing: ({ recruiterEmail }) =>
      gaps([
        filled(recruiterEmail),
        { label: "recruiter email", path: "recruiterEmail" },
      ]),
  },
  {
    section: "profile",
    severity: "optional",
    total: 7,
    missing: ({ profile }) =>
      gaps(
        [
          filled(profile?.hubLabel),
          { label: "hub label", path: "profile.hubLabel" },
        ],
        [
          filled(profile?.shortDescription),
          { label: "short description", path: "profile.shortDescription" },
        ],
        [
          filled(profile?.coverImage),
          { label: "cover image", path: "profile.coverImage" },
        ],
        [
          (profile?.regions?.length ?? 0) > 0,
          { label: "regions", path: "profile.regions" },
        ],
        [
          filled(profile?.mapPin?.x) && filled(profile?.mapPin?.y),
          { label: "map pin", path: "profile.mapPin.x" },
        ],
        [
          filled(profile?.mapLocation?.latitude) &&
            filled(profile?.mapLocation?.longitude),
          { label: "map location", path: "profile.mapLocation.latitude" },
        ],
        [
          filled(profile?.googleMapsUrl),
          { label: "Google Maps link", path: "profile.googleMapsUrl" },
        ],
      ),
  },
  {
    section: "seo",
    severity: "warning",
    total: 1,
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
  profile: {
    hubLabel: true,
    shortDescription: true,
    coverImage: true,
    regions: true,
    mapPin: true,
    mapLocation: true,
    googleMapsUrl: true,
  },
} as const;

export type SectionStatus = {
  section: SettingsSection;
  severity: SectionSeverity;
  total: number;
  complete: boolean;
  missing: LaunchGap[];
};

export function settingsCompleteness(
  settings: CompletenessInput | null | undefined,
): SectionStatus[] {
  return COMPLETENESS_RULES.map(({ section, severity, total, missing }) => {
    const gaps = missing(settings ?? {});
    return {
      section,
      severity,
      total,
      complete: gaps.length === 0,
      missing: gaps,
    };
  });
}

export type LaunchItem = LaunchGap & {
  section: SettingsSection;
  severity: Exclude<SectionSeverity, "optional">;
};

export function requiredStatuses(statuses: SectionStatus[]): SectionStatus[] {
  return statuses.filter(({ severity }) => severity !== "optional");
}

export function optionalSummaries(statuses: SectionStatus[]) {
  return statuses
    .filter(({ severity }) => severity === "optional")
    .map(({ section, total, missing }) => ({
      section,
      label: settingsTabLabel(section),
      done: total - missing.length,
      total,
      missing: missing.map(({ label }) => label),
    }));
}

export function launchItems(statuses: SectionStatus[]): LaunchItem[] {
  return requiredStatuses(statuses)
    .flatMap(({ section, severity, missing }) =>
      missing.map((gap) => ({
        ...gap,
        section,
        severity: severity as LaunchItem["severity"],
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
  return requiredStatuses(settingsCompleteness(settings)).some(
    ({ complete }) => !complete,
  );
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
  "profile.hubLabel",
  "profile.shortDescription",
  "profile.coverImage",
  "profile.regions",
  "profile.mapPin.x",
  "profile.mapPin.y",
  "profile.mapLocation.latitude",
  "profile.mapLocation.longitude",
  "profile.googleMapsUrl",
] as const;

export type CompletenessPath = (typeof COMPLETENESS_PATHS)[number];

export const LOCALIZED_COMPLETENESS_PATHS = [
  "siteName",
  "defaultSeo.title",
  "profile.hubLabel",
  "profile.shortDescription",
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
    profile: {
      hubLabel: read("profile.hubLabel") as string | null,
      shortDescription: read("profile.shortDescription") as string | null,
      coverImage: read("profile.coverImage"),
      regions: Array.from({ length: Number(read("profile.regions")) || 0 }),
      mapPin: {
        x: read("profile.mapPin.x") as number | null,
        y: read("profile.mapPin.y") as number | null,
      },
      mapLocation: {
        latitude: read("profile.mapLocation.latitude") as number | null,
        longitude: read("profile.mapLocation.longitude") as number | null,
      },
      googleMapsUrl: read("profile.googleMapsUrl") as string | null,
    },
  };
}
