import type { IconName } from "../icons";
import { SETTINGS_TABS, type SectionStatus } from "./completeness";

export type TabState = "complete" | "warning" | "error" | "optional";

export const TAB_STATE_ICON: Record<TabState, IconName> = {
  complete: "check_circle",
  warning: "error",
  error: "cancel",
  optional: "radio_button_unchecked",
};

export const TAB_STATE_TEXT: Record<TabState, string> = {
  complete: "complete",
  warning: "missing information",
  error: "blocks launch",
  optional: "optional",
};

export const SETTINGS_USED_BY =
  "Header, Footer, every page's SEO and career emails.";

export function settingsTabStates(statuses: SectionStatus[]): TabState[] {
  return SETTINGS_TABS.map(({ section }) => {
    const status = statuses.find((candidate) => candidate.section === section);
    if (!status) return "optional";
    return status.complete ? "complete" : status.severity;
  });
}
