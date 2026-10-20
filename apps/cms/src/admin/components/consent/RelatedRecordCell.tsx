import type { DefaultServerCellComponentProps } from "payload";

import { relatedApplicationURL } from "./related";

export async function RelatedRecordCell({
  cellData,
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  const value = typeof cellData === "string" ? cellData : "";
  const href = await relatedApplicationURL(payload, rowData.consentType, value);
  return href ? (
    <a className="dil-consent__mono dil-consent__related" href={href}>
      {value}
    </a>
  ) : (
    <code className="dil-consent__mono">{value}</code>
  );
}
