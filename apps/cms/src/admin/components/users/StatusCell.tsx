import type { BasePayload, DefaultServerCellComponentProps } from "payload";
import { cache } from "react";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { StatusActions } from "./StatusActions";
import { userStatus } from "./users";
import { currentUser } from "./viewer";

const lockTimes = cache(
  async (payload: BasePayload): Promise<Map<string, string | null>> => {
    const user = await currentUser(payload);
    if (!user || !isSuperAdmin(user as RoleHolder)) return new Map();
    const { docs } = await payload.find({
      collection: "users",
      select: { lockUntil: true },
      showHiddenFields: true,
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return new Map(
      docs.map((doc) => [
        String(doc.id),
        (doc as { lockUntil?: string | null }).lockUntil ?? null,
      ]),
    );
  },
);

export async function StatusCell({
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  const lockUntil = (await lockTimes(payload)).get(String(rowData.id));
  const status = userStatus(
    {
      lastLoginAt: rowData.lastLoginAt as string | null | undefined,
      lockUntil,
    },
    new Date(),
  );
  return (
    <StatusActions
      email={String(rowData.email ?? "")}
      id={rowData.id as number}
      name={String(rowData.name || rowData.email || "")}
      status={status}
    />
  );
}
