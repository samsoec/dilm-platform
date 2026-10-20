"use client";

import { DefaultCell } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";

import { Tag } from "../kit/Tag";
import { MaterialIcon } from "../MaterialIcon";
import { fileSize, hasAlt } from "./media";

export function AltCell({ cellData }: DefaultCellComponentProps) {
  if (hasAlt(cellData)) return <span>{String(cellData)}</span>;
  return (
    <span className="dil-status-chip dil-status-chip--warn dil-status-chip--plain">
      <MaterialIcon name="error" />
      No alt text
    </span>
  );
}

export function UploadedByCell(props: DefaultCellComponentProps) {
  if (props.cellData === null || props.cellData === undefined) {
    return (
      <Tag title="Added before uploads were stamped with a name.">Imported</Tag>
    );
  }
  return <DefaultCell {...props} />;
}

export function FileSizeCell({ cellData }: DefaultCellComponentProps) {
  return <span>{fileSize(cellData) ?? "—"}</span>;
}
