import type { DefaultServerCellComponentProps } from "payload";

import { StatusActions } from "./StatusActions";
import { rowStatus } from "./viewer";

export async function StatusCell({
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  return (
    <StatusActions
      email={String(rowData.email ?? "")}
      id={rowData.id as number}
      name={String(rowData.name || rowData.email || "")}
      status={await rowStatus(payload, rowData)}
    />
  );
}
