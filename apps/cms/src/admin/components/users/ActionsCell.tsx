import type { DefaultServerCellComponentProps } from "payload";

import { type Role, ROLES } from "../../../access";
import { RowMenu } from "./RowMenu";
import { companies, currentUser, rowStatus, tenantIDs } from "./viewer";

export async function ActionsCell({
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  const viewer = await currentUser(payload);
  const roles = Array.isArray(rowData.roles) ? (rowData.roles as Role[]) : [];
  const name = String(rowData.name || rowData.email || "");
  return (
    <RowMenu
      companies={(await companies(payload)).map(({ id, name, domain }) => ({
        id,
        name,
        domain,
      }))}
      status={await rowStatus(payload, rowData)}
      user={{
        id: rowData.id as number,
        name,
        email: String(rowData.email ?? ""),
        role: ROLES.find((role) => roles.includes(role)) ?? "tenant-viewer",
        tenants: tenantIDs(rowData),
        self: String(viewer?.id) === String(rowData.id),
      }}
    />
  );
}
