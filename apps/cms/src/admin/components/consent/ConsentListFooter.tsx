"use client";

import { useListQuery } from "@payloadcms/ui";

import { rangeText } from "../lists/cvFilters";

export function ConsentListFooter() {
  const { data } = useListQuery();
  if (!data || data.totalDocs === 0) return null;
  return (
    <p className="dil-list-footer">
      Showing {rangeText(data.page ?? 1, data.limit, data.totalDocs)} · times in
      WIB (Asia/Jakarta)
    </p>
  );
}
