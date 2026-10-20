import type { DefaultServerCellComponentProps } from "payload";

import { StatusChip } from "../kit/StatusChip";
import { liveStatus } from "./irList";

export async function IrStatusCell({
  cellData,
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  const live =
    cellData === "changed"
      ? await payload.db.findOne<{ id: number; _status?: unknown }>({
          collection: "ir-documents",
          where: { id: { equals: rowData.id } },
        })
      : undefined;
  const status = liveStatus(cellData, rowData.deletedAt, live?._status);
  return (
    <StatusChip
      set="document"
      srText={
        status.pendingDraft ? ", with unpublished draft changes" : undefined
      }
      status={status.status}
    />
  );
}
