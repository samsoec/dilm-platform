import type { Field } from "payload";

import type { IconName } from "../../icons";
import { JAKARTA_TIME_ZONE } from "../application/application";

const HOUR = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  hourCycle: "h23",
  timeZone: JAKARTA_TIME_ZONE,
});

const DAY = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: JAKARTA_TIME_ZONE,
});

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function greeting(name: string | null | undefined, now: Date): string {
  const hour = Number(HOUR.format(now));
  const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const first = name?.trim().split(/\s+/)[0];
  return first ? `Good ${part}, ${first}` : `Good ${part}`;
}

function dayNumber(date: Date): number {
  return Date.parse(`${DAY.format(date)}T00:00:00Z`) / 86_400_000;
}

export function daysBetween(then: Date, now: Date): number {
  return dayNumber(now) - dayNumber(then);
}

export function relativeDay(value: unknown, now: Date): string | undefined {
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const days = daysBetween(date, now);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  const day = DAY.format(date);
  return `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`;
}

export type TranslationCount = { translated: number; total: number };

type Localized = { en?: unknown; id?: unknown };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function countLeaf(value: unknown, sum: TranslationCount) {
  const { en, id } = (value ?? {}) as Localized;
  if (!text(en)) return;
  sum.total += 1;
  if (text(id) && text(id) !== text(en)) sum.translated += 1;
}

function walk(fields: readonly Field[], data: unknown, sum: TranslationCount) {
  const value = (data ?? {}) as Record<string, unknown>;
  for (const field of fields) {
    switch (field.type) {
      case "text":
      case "textarea":
        if (field.localized) countLeaf(value[field.name], sum);
        break;
      case "group":
        if ("name" in field && field.name)
          walk(field.fields, value[field.name], sum);
        else walk(field.fields, value, sum);
        break;
      case "row":
      case "collapsible":
        walk(field.fields, value, sum);
        break;
      case "tabs":
        for (const tab of field.tabs) {
          walk(
            tab.fields,
            "name" in tab && tab.name ? value[tab.name] : value,
            sum,
          );
        }
        break;
      case "array": {
        const rows = value[field.name];
        if (Array.isArray(rows))
          for (const row of rows) walk(field.fields, row, sum);
        break;
      }
      case "blocks": {
        const rows = value[field.name];
        if (!Array.isArray(rows)) break;
        for (const row of rows as { blockType?: string }[]) {
          const block = field.blocks.find(({ slug }) => slug === row.blockType);
          if (block) walk(block.fields, row, sum);
        }
        break;
      }
    }
  }
}

export function countTranslations(
  fields: readonly Field[],
  doc: unknown,
): TranslationCount {
  const sum = { translated: 0, total: 0 };
  walk(fields, doc, sum);
  return sum;
}

export function percent({ translated, total }: TranslationCount): number {
  return total === 0 ? 100 : Math.floor((translated / total) * 100);
}

export type AttentionItem = {
  key: string;
  icon: IconName;
  tone: "warn" | "brand" | "danger" | "neutral";
  title: string;
  body: string;
  action: string;
  href: string;
  primary?: boolean;
};

export type AttentionInput = {
  canEdit: boolean;
  recruiterEmailMissing: boolean;
  otherLaunchGaps: number;
  settingsHref?: string;
  received: { count: number; oldest?: string };
  syncFailed: { count: number; attempts?: number };
  untranslated: { label: string; count: number; href: string }[];
  links: { received: string; syncFailed: string };
};

function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

export const ATTENTION_LIMIT = 5;

export function attentionItems(
  input: AttentionInput,
  now: Date,
): AttentionItem[] {
  const { canEdit } = input;
  const items: AttentionItem[] = [];
  if (input.recruiterEmailMissing && input.settingsHref) {
    items.push({
      key: "recruiter",
      icon: "mail",
      tone: "warn",
      title: "Recruiter email is missing",
      body: canEdit
        ? "New applications can't notify a recruiter until it's set."
        : "New applications can't notify anyone.",
      action: canEdit ? "Open Company settings" : "View",
      href: `${input.settingsHref}?tab=careers`,
      primary: canEdit,
    });
  }
  if (input.otherLaunchGaps > 0 && input.settingsHref) {
    items.push({
      key: "launch",
      icon: "tune",
      tone: "warn",
      title: `${plural(input.otherLaunchGaps, "launch detail")} missing in Company settings`,
      body: "The site can't go live until they're filled in.",
      action: canEdit ? "Fix" : "View",
      href: input.settingsHref,
    });
  }
  if (input.received.count > 0) {
    const age = input.received.oldest
      ? relativeDay(input.received.oldest, now)
      : undefined;
    const arrived = !age
      ? undefined
      : /^\d/.test(age) && !age.endsWith("ago")
        ? `arrived on ${age}`
        : `arrived ${age}`;
    items.push({
      key: "received",
      icon: "badge",
      tone: "brand",
      title: canEdit
        ? `${input.received.count} new Career ${input.received.count === 1 ? "application" : "applications"}`
        : `${plural(input.received.count, "application")} still Received`,
      body: canEdit
        ? `Status "Received"${arrived ? ` — oldest ${arrived}` : ""}.`
        : arrived
          ? `Oldest ${arrived}.`
          : "Waiting for review.",
      action: canEdit ? "Review" : "View",
      href: input.links.received,
    });
  }
  if (input.syncFailed.count > 0) {
    items.push({
      key: "sync",
      icon: "sync_problem",
      tone: "danger",
      title: `${plural(input.syncFailed.count, "application")} didn't reach the job platform`,
      body: `Sync failed${input.syncFailed.attempts ? ` after ${plural(input.syncFailed.attempts, "attempt")}` : ""}. The applicant was still notified.`,
      action: "View",
      href: input.links.syncFailed,
    });
  }
  for (const { label, count, href } of input.untranslated) {
    if (count === 0) continue;
    items.push({
      key: `translate-${label}`,
      icon: "translate",
      tone: "neutral",
      title: `${count} ${label} ${count === 1 ? "label is" : "labels are"} still in English on the ID site`,
      body: "Seeded copies waiting to be translated.",
      action: canEdit ? "Translate" : "View",
      href,
    });
  }
  return items.slice(0, ATTENTION_LIMIT);
}

type NavItem = { type?: string };

export function headerSummary(header: {
  navItems?: NavItem[] | null;
  cta?: { enabled?: boolean | null } | null;
}): string {
  const items = header.navItems?.length ?? 0;
  return `${plural(items, "menu item")} · CTA ${header.cta?.enabled ? "on" : "off"}`;
}

export function footerSummary(footer: {
  linkColumns?: unknown[] | null;
  partOf?: { enabled?: boolean | null } | null;
}): string {
  const columns = footer.linkColumns?.length ?? 0;
  return `${plural(columns, "link column")} · "Part of" ${footer.partOf?.enabled ? "on" : "off"}`;
}

export function savedLine(
  updatedAt: unknown,
  by: string | undefined,
  now: Date,
): string | undefined {
  const when = relativeDay(updatedAt, now);
  if (!when) return undefined;
  return `Saved ${when}${by ? ` by ${by.split(/\s+/)[0]}` : ""}`;
}
