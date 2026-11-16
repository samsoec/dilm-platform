"use client";

import { useConfig } from "@payloadcms/ui";
import Link from "next/link";
import type { DefaultCellComponentProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { MaterialIcon } from "../MaterialIcon";
import {
  isLinkStatus,
  LINK_STATUS_CHIPS,
  uploadedText,
  usedInCountText,
} from "./documents";

export function DocumentTitleCell({
  cellData,
  rowData,
}: DefaultCellComponentProps) {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig();
  const title =
    typeof cellData === "string" && cellData ? cellData : "Untitled";
  return (
    <Link
      className="dil-pdf-title"
      href={formatAdminURL({
        adminRoute: admin,
        path: `/collections/documents/${rowData.id}`,
      })}
      prefetch={false}
    >
      <MaterialIcon name="picture_as_pdf" />
      <span>{title}</span>
    </Link>
  );
}

export function UsedInCountCell({ cellData }: DefaultCellComponentProps) {
  return (
    <span className="dil-doc-used">
      {typeof cellData === "number" ? usedInCountText(cellData) : "—"}
    </span>
  );
}

export function UploadedCell({ cellData }: DefaultCellComponentProps) {
  return <span>{uploadedText(cellData)}</span>;
}

export function LinkStatusCell({ cellData }: DefaultCellComponentProps) {
  if (!isLinkStatus(cellData)) return <span>—</span>;
  const chip = LINK_STATUS_CHIPS[cellData];
  return (
    <span className={`dil-status-chip dil-status-chip--${chip.tone}`}>
      <MaterialIcon name={chip.icon} />
      {chip.label}
    </span>
  );
}
