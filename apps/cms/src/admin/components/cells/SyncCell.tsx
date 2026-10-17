"use client";

import type { DefaultCellComponentProps } from "payload";

import { StatusChip } from "../kit/StatusChip";

export function SyncCell({ cellData, rowData }: DefaultCellComponentProps) {
  const attempts = rowData.externalSyncAttempts;
  return (
    <StatusChip
      detail={typeof attempts === "number" ? attempts : 0}
      set="sync"
      srText=" on the job platform"
      status={cellData ?? "pending"}
    />
  );
}
