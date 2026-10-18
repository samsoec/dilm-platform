import { cookies } from "next/headers";
import type { BeforeListTableServerProps } from "payload";

import type { RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { countValues } from "./cvFilters";
import { CvToolbarClient } from "./CvToolbarClient";

export async function CvToolbar({ payload, user }: BeforeListTableServerProps) {
  if (!user) return null;
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const { docs } =
    tenant === undefined
      ? { docs: [] }
      : await payload.find({
          collection: "cv-submissions",
          where: { tenant: { equals: tenant } },
          select: { position: true, externalSyncStatus: true },
          pagination: false,
          depth: 0,
          overrideAccess: false,
          user,
        });
  const rows = docs as Record<string, unknown>[];
  return (
    <CvToolbarClient
      positions={countValues(rows, "position")}
      syncStates={countValues(rows, "externalSyncStatus")}
    />
  );
}
