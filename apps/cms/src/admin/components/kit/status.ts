import type { IconName } from "../../icons";

export type ChipTone = "brand" | "neutral" | "ok" | "warn" | "danger";

export type Chip = {
  icon: IconName;
  label: string;
  tone: ChipTone;
  plain?: boolean;
};

export const STATUS_SETS = {
  application: {
    received: { icon: "inbox", label: "Received", tone: "brand" },
    reviewed: { icon: "visibility", label: "Reviewed", tone: "neutral" },
    shortlisted: { icon: "star", label: "Shortlisted", tone: "ok" },
    rejected: { icon: "block", label: "Rejected", tone: "danger" },
  },
  document: {
    draft: { icon: "edit_note", label: "Draft", tone: "neutral" },
    published: { icon: "public", label: "Published", tone: "ok" },
    trashed: { icon: "delete", label: "Trashed", tone: "warn" },
  },
  sync: {
    synced: { icon: "check_circle", label: "Synced", tone: "ok", plain: true },
    pending: { icon: "schedule", label: "Pending", tone: "warn", plain: true },
    failed: {
      icon: "sync_problem",
      label: "Failed",
      tone: "danger",
      plain: true,
    },
  },
  user: {
    active: { icon: "check", label: "Active", tone: "ok" },
    invited: { icon: "mail", label: "Invited", tone: "brand" },
    locked: { icon: "lock", label: "Locked", tone: "danger" },
  },
} as const satisfies Record<string, Record<string, Chip>>;

export type StatusSet = keyof typeof STATUS_SETS;
export type StatusOf<S extends StatusSet> = keyof (typeof STATUS_SETS)[S];

function tries(count: number): string {
  return `${count} ${count === 1 ? "try" : "tries"}`;
}

function detailFor(set: StatusSet, status: string, detail?: number) {
  if (detail === undefined) return undefined;
  if (set === "sync" && status === "failed") return tries(detail);
  if (set === "user" && status === "locked") return `${detail} min`;
  return undefined;
}

export function statusChip(
  set: StatusSet,
  status: unknown,
  detail?: number,
): Chip | undefined {
  if (typeof status !== "string") return undefined;
  const chip = (STATUS_SETS[set] as Record<string, Chip>)[status];
  if (!chip) return undefined;
  const extra = detailFor(set, status, detail);
  return extra ? { ...chip, label: `${chip.label} · ${extra}` } : chip;
}
