import type { StepNavItem } from "@payloadcms/ui";

const ancestorCrumbs = new WeakSet<StepNavItem>();

export type AncestorCrumb = { label: string; url: string };

export function withAncestorCrumbs(
  stepNav: StepNavItem[],
  ancestors: readonly AncestorCrumb[],
): StepNavItem[] {
  const current = stepNav.filter((item) => ancestorCrumbs.has(item));
  const unchanged =
    current.length === ancestors.length &&
    current.every(
      (item, index) =>
        item.label === ancestors[index].label &&
        item.url === ancestors[index].url,
    );
  if (unchanged) return stepNav;
  const rest = stepNav.filter((item) => !ancestorCrumbs.has(item));
  if (rest.length === 0) return stepNav;
  const added = ancestors.map((ancestor) => {
    const item: StepNavItem = { label: ancestor.label, url: ancestor.url };
    ancestorCrumbs.add(item);
    return item;
  });
  return [...rest.slice(0, -1), ...added, rest[rest.length - 1]];
}
