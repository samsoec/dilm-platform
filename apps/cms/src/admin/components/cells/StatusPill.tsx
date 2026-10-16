"use client";

import type { DefaultCellComponentProps } from "payload";

import { Badge } from "./Badge";
import { statusBadge } from "./cv";

export function StatusPill({ cellData }: DefaultCellComponentProps) {
  const badge = statusBadge(cellData);
  return badge ? <Badge badge={badge} srText=" status" /> : null;
}
