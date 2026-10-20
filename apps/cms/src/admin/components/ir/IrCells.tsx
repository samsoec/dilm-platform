"use client";

import { useConfig, useListQuery } from "@payloadcms/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DefaultCellComponentProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { irTypeLabel } from "../../../irDocumentTypes";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { LocaleTag } from "../kit/Tag";
import { MaterialIcon } from "../MaterialIcon";
import { irFooterText } from "./irList";

export function PdfTitleCell({ cellData, rowData }: DefaultCellComponentProps) {
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
        path: `/collections/ir-documents/${rowData.id}`,
      })}
      prefetch={false}
    >
      <MaterialIcon name="picture_as_pdf" />
      <span>{title}</span>
    </Link>
  );
}

export function TypeLabelCell({ cellData }: DefaultCellComponentProps) {
  return <span>{irTypeLabel(cellData)}</span>;
}

export function LocaleTagCell({ cellData }: DefaultCellComponentProps) {
  return typeof cellData === "string" ? <LocaleTag locale={cellData} /> : null;
}

export function IrListFooter() {
  const { data } = useListQuery();
  const { company } = useUnsavedChangesGuard();
  const pathname = usePathname();
  if (!data || pathname.endsWith("/trash")) return null;
  return (
    <p className="dil-list-footer">
      {irFooterText(data.totalDocs, company?.name)}
    </p>
  );
}
