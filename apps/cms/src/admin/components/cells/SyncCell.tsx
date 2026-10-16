"use client";

import type { DefaultCellComponentProps } from "payload";

import { Badge } from "./Badge";
import { syncBadge } from "./cv";

export function SyncCell({ cellData, rowData }: DefaultCellComponentProps) {
  return (
    <Badge
      badge={syncBadge(cellData, rowData.externalSyncAttempts)}
      srText=" on the job platform"
    />
  );
}
