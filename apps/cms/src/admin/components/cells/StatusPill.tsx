"use client";

import type { DefaultCellComponentProps } from "payload";

import { StatusChip } from "../kit/StatusChip";

export function StatusPill({ cellData }: DefaultCellComponentProps) {
  return <StatusChip set="application" srText=" status" status={cellData} />;
}
