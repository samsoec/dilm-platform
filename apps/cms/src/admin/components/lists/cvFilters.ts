import type { Where } from "payload";

export const FACET_FIELDS = {
  position: "Position",
  externalSyncStatus: "Sync",
} as const;

export type FacetField = keyof typeof FACET_FIELDS;

export const SYNC_LABELS: Record<string, string> = {
  pending: "Pending",
  synced: "Synced",
  failed: "Failed",
};

export type FacetCount = { value: string; count: number };

type Condition = { in?: unknown; equals?: unknown };

export function flatWhere(where: Where | undefined): Where {
  if (!where) return {};
  const groups = where.or;
  if (Array.isArray(groups) && groups.length === 1) {
    const only = groups[0] as Where;
    const conditions = Array.isArray(only.and) ? (only.and as Where[]) : [only];
    const rest: Where = { ...where };
    delete rest.or;
    return Object.assign(
      rest,
      ...conditions.map((condition) => flatWhere(condition)),
    );
  }
  if (Array.isArray(where.and) && Object.keys(where).length === 1) {
    return Object.assign(
      {},
      ...(where.and as Where[]).map((condition) => flatWhere(condition)),
    );
  }
  return where;
}

export function selectedValues(
  where: Where | undefined,
  field: FacetField,
): string[] {
  const condition = where?.[field] as Condition | undefined;
  if (!condition) return [];
  if (Array.isArray(condition.in)) return condition.in.map(String);
  if (typeof condition.in === "string") return condition.in.split(",");
  if (condition.equals !== undefined) return [String(condition.equals)];
  return [];
}

export function withValues(
  where: Where | undefined,
  field: FacetField,
  values: string[],
): Where {
  const next: Where = { ...(where ?? {}) };
  if (values.length === 0) delete next[field];
  else next[field] = { in: values };
  return next;
}

export function toggleValue(
  where: Where | undefined,
  field: FacetField,
  value: string,
): Where {
  const current = selectedValues(where, field);
  const values = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  return withValues(where, field, values);
}

export function clearFilters(where: Where | undefined): Where {
  const next: Where = { ...(where ?? {}) };
  for (const field of Object.keys(FACET_FIELDS)) delete next[field];
  return next;
}

export type FilterChip = { field: FacetField; value: string; label: string };

export function filterChips(where: Where | undefined): FilterChip[] {
  return (Object.keys(FACET_FIELDS) as FacetField[]).flatMap((field) =>
    selectedValues(where, field).map((value) => ({
      field,
      value,
      label: `${FACET_FIELDS[field]}: ${
        field === "externalSyncStatus" ? (SYNC_LABELS[value] ?? value) : value
      }`,
    })),
  );
}

export function countValues(
  rows: Record<string, unknown>[],
  field: string,
): FacetCount[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = row[field];
    if (typeof value !== "string" || value === "") continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

export function rangeText(page: number, limit: number, total: number): string {
  if (total === 0) return "0 of 0";
  const start = (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);
  return `${start}–${end} of ${total}`;
}
