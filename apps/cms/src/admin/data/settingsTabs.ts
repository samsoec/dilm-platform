import {
  SETTINGS_TABS,
  type SectionStatus,
  type SettingsTab,
} from "./completeness";

export type TabState = "complete" | "warning" | "error" | "optional";

export const SECTION_HINTS: Record<SettingsTab, string> = {
  general: "Site name",
  brand: "Both logos and the legal name",
  contact: "An email or a phone number",
  careers: "Recruiter email, or applications notify no one",
  social: "Profiles shown in the footer",
  seo: "Default SEO title",
};

export const SETTINGS_USED_BY = [
  "Header",
  "Footer",
  "Every page's SEO",
  "Career emails",
] as const;

export function settingsTabStates(statuses: SectionStatus[]): TabState[] {
  return SETTINGS_TABS.map(({ section }) => {
    const status = statuses.find((candidate) => candidate.section === section);
    if (!status) return "optional";
    return status.complete ? "complete" : status.severity;
  });
}
