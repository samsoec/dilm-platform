"use client";

import { useListQuery } from "@payloadcms/ui";

import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { STATUS_SETS } from "../kit/status";
import { flatWhere, selectedValues } from "./cvFilters";

export function CvListFooter() {
  const { data, query } = useListQuery();
  const { company } = useUnsavedChangesGuard();
  if (!data) return null;
  const where = flatWhere(query.where);
  const status = (where.status as { equals?: string } | undefined)?.equals;
  const statusLabel =
    status && status in STATUS_SETS.application
      ? STATUS_SETS.application[
          status as keyof typeof STATUS_SETS.application
        ].label.toLowerCase()
      : undefined;
  const filtered =
    Boolean(query.search) ||
    selectedValues(where, "position").length > 0 ||
    selectedValues(where, "externalSyncStatus").length > 0;
  return (
    <p className="dil-list-footer">
      Showing {data.docs.length} of {data.totalDocs}
      {statusLabel && ` ${statusLabel}`}
      {filtered && " matching"}
      {company && ` · ${company.name} only`}
    </p>
  );
}
