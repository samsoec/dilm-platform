import type { StepNavItem } from "@payloadcms/ui";
import type { Field } from "payload";

import { navGroup } from "../../navGroups";

export function hasLocalizedFields(fields: readonly Field[]): boolean {
  return fields.some(
    (field) =>
      ("localized" in field && field.localized === true) ||
      ("fields" in field && hasLocalizedFields(field.fields)) ||
      ("tabs" in field &&
        field.tabs.some((tab) => hasLocalizedFields(tab.fields))) ||
      ("blocks" in field &&
        field.blocks.some((block) => hasLocalizedFields(block.fields))),
  );
}

export type EntityRef = { type: "collections" | "globals"; slug: string };

export function entityFromPath(
  pathname: string,
  adminRoute: string,
): EntityRef | undefined {
  const base = adminRoute.replace(/\/+$/, "");
  if (base && !pathname.startsWith(`${base}/`)) return undefined;
  const [type, slug] = pathname.slice(base.length).split("/").filter(Boolean);
  if ((type === "collections" || type === "globals") && slug) {
    return { type, slug };
  }
  return undefined;
}

type EntityConfig = { slug: string; admin?: { group?: unknown } };

export function entityGroup(
  config: { collections: EntityConfig[]; globals: EntityConfig[] },
  entity: EntityRef | undefined,
): string | undefined {
  if (!entity) return undefined;
  const group = config[entity.type].find(({ slug }) => slug === entity.slug)
    ?.admin?.group;
  return typeof group === "string" ? group : undefined;
}

export function isAdministration(group: string | undefined): boolean {
  return group === navGroup("admin");
}

const shellCrumbs = new WeakSet<StepNavItem>();

export function withShellCrumbs(
  stepNav: StepNavItem[],
  labels: string[],
): StepNavItem[] {
  let leading = 0;
  while (leading < stepNav.length && shellCrumbs.has(stepNav[leading])) {
    leading++;
  }
  const view = stepNav.slice(leading);
  const unchanged =
    leading === labels.length &&
    labels.every((label, i) => stepNav[i].label === label) &&
    !view.some((item) => shellCrumbs.has(item));
  if (unchanged) return stepNav;

  const prefix = labels.map((label) => {
    const item: StepNavItem = { label };
    shellCrumbs.add(item);
    return item;
  });
  return [...prefix, ...view.filter((item) => !shellCrumbs.has(item))];
}

export function localeHref(
  pathname: string,
  search: string,
  locale: string,
): string {
  const params = new URLSearchParams(search);
  params.set("locale", locale);
  return `${pathname}?${params}`;
}

export function siteURL(domain: string, locale: string): string {
  const host = domain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
  return `https://${host}/${encodeURIComponent(locale)}/`;
}
