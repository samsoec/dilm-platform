import { JAKARTA_TIME_ZONE } from "../application/application";

export type UserStatus =
  | { status: "active" }
  | { status: "invited" }
  | { status: "locked"; minutes: number };

export type StatusSource = {
  lastLoginAt?: string | null;
  lockUntil?: string | null;
};

export function userStatus(user: StatusSource, now: Date): UserStatus {
  const lockUntil = user.lockUntil ? new Date(user.lockUntil) : undefined;
  if (lockUntil && lockUntil.getTime() > now.getTime()) {
    return {
      status: "locked",
      minutes: Math.ceil((lockUntil.getTime() - now.getTime()) / 60_000),
    };
  }
  if (!user.lastLoginAt) return { status: "invited" };
  return { status: "active" };
}

const DAY = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: JAKARTA_TIME_ZONE,
});

const TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
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

function dayNumber(day: string): number {
  return Date.parse(`${day}T00:00:00Z`) / 86_400_000;
}

export function lastSignInText(value: unknown, now: Date): string {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = DAY.format(date);
  const gap = dayNumber(DAY.format(now)) - dayNumber(day);
  if (gap === 0) return `Today, ${TIME.format(date)}`;
  if (gap === 1) return "Yesterday";
  const label = `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`;
  return day.slice(0, 4) === DAY.format(now).slice(0, 4)
    ? label
    : `${label} ${day.slice(0, 4)}`;
}

export const ROLE_TABS = [
  { role: undefined, label: "All" },
  { role: "super-admin", label: "Super Admins" },
  { role: "tenant-editor", label: "Editors" },
  { role: "tenant-viewer", label: "Viewers" },
] as const;

export const ROLE_PARAM = "where[roles][equals]";
