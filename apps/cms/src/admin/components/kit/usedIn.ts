import { joinNames } from "../../../paths";
import type { PublishStatus } from "./publication";
import type { Reach } from "./reach";

export type UsedInRow = {
  key: string;
  href: string;
  label: string;
  type: string;
  reach: Reach;
  owner: string;
  status?: PublishStatus;
};

export type UsedInData = {
  rows: UsedInRow[];
  hidden: number;
  unit: "places" | "variants";
};

export const USED_IN_EMPTY = "Not used anywhere yet";

export function usedInTitle(count: number, unit: UsedInData["unit"]): string {
  if (unit === "variants") {
    return `Used in · ${count} ${count === 1 ? "variant" : "variants"}`;
  }
  return `Used in · ${count}`;
}

export function replaceAllText(count: number): string {
  return `Replace PDF · updates all ${count}`;
}

export function hiddenText(count: number): string {
  return `And ${count} more in other companies' pages that you can't open.`;
}

export function sectionLabel(title: string, sections: string[]): string {
  return sections.length > 0 ? `${title} › ${joinNames(sections)}` : title;
}

export function variantLabel(product: string, variant: string): string {
  return `${product} › ${variant}`;
}
