import type { Where } from "payload";

import type { IconName } from "../../icons";
import { JAKARTA_TIME_ZONE } from "../application/application";

export const CONSENT_TYPE_LABELS: Record<string, string> = {
  "career-application": "Career application",
  "contact-form": "Contact form",
};

export const CONSENT_TYPE_ICONS: Record<string, IconName> = {
  "career-application": "badge",
  "contact-form": "mail",
};

const STAMP = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: JAKARTA_TIME_ZONE,
});

const ISO_DAY = new Intl.DateTimeFormat("en-CA", {
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

function asDate(value: unknown): Date | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function timestampText(value: unknown): string {
  const date = asDate(value);
  return date ? STAMP.format(date).replace("Sept", "Sep") : "";
}

export function jakartaDay(value: Date): string {
  return ISO_DAY.format(value);
}

export type DayRange = { from?: string; to?: string };

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type Bounds = { greater_than_equal?: unknown; less_than_equal?: unknown };

export function rangeFromWhere(where: Where | undefined): DayRange {
  const bounds = where?.timestamp as Bounds | undefined;
  const from = asDate(bounds?.greater_than_equal);
  const to = asDate(bounds?.less_than_equal);
  return {
    ...(from && { from: jakartaDay(from) }),
    ...(to && { to: jakartaDay(to) }),
  };
}

export function withRange(where: Where | undefined, range: DayRange): Where {
  const next: Where = { ...(where ?? {}) };
  const from = range.from && DAY_PATTERN.test(range.from) ? range.from : "";
  const to = range.to && DAY_PATTERN.test(range.to) ? range.to : "";
  if (!from && !to) {
    delete next.timestamp;
    return next;
  }
  next.timestamp = {
    ...(from && { greater_than_equal: `${from}T00:00:00.000+07:00` }),
    ...(to && { less_than_equal: `${to}T23:59:59.999+07:00` }),
  };
  return next;
}

function shiftDay(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export const RANGE_PRESETS = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "year", label: "This year" },
] as const;

export type RangePreset = (typeof RANGE_PRESETS)[number]["key"];

export function presetRange(preset: RangePreset, now: Date): DayRange {
  const today = jakartaDay(now);
  if (preset === "7d") return { from: shiftDay(today, -6), to: today };
  if (preset === "30d") return { from: shiftDay(today, -29), to: today };
  return { from: `${today.slice(0, 4)}-01-01`, to: today };
}

export function matchingPreset(
  range: DayRange,
  now: Date,
): RangePreset | undefined {
  return RANGE_PRESETS.find(({ key }) => {
    const preset = presetRange(key, now);
    return preset.from === range.from && preset.to === range.to;
  })?.key;
}

function dayMonth(day: string): string {
  return `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`;
}

export function dayText(day: string): string {
  return `${dayMonth(day)} ${day.slice(0, 4)}`;
}

export function rangeText({ from, to }: DayRange): string {
  if (from && to) {
    const start =
      from.slice(0, 4) === to.slice(0, 4) ? dayMonth(from) : dayText(from);
    return `${start} – ${dayText(to)}`;
  }
  if (from) return `From ${dayText(from)}`;
  if (to) return `Until ${dayText(to)}`;
  return "";
}

export function recordCount(total: number): string {
  return `${total} ${total === 1 ? "record" : "records"}`;
}
