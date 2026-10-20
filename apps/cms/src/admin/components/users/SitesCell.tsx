import type { BasePayload, DefaultServerCellComponentProps } from "payload";
import { cache } from "react";

import type { Role } from "../../../access";
import { tenantColors } from "../../brandColor";
import { initials } from "../../initials";
import { currentUser } from "./viewer";

type Company = { name: string; brandColor?: string | null };

const companies = cache(
  async (payload: BasePayload): Promise<Map<string, Company>> => {
    const user = await currentUser(payload);
    if (!user) return new Map();
    const { docs } = await payload.find({
      collection: "tenants",
      select: { name: true, brandColor: true },
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return new Map(docs.map((doc) => [String(doc.id), doc]));
  },
);

type TenantRef = { tenant?: number | string | { id: number | string } };

export async function SitesCell({
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  const roles = Array.isArray(rowData.roles) ? (rowData.roles as Role[]) : [];
  if (roles.includes("super-admin")) {
    return <span className="dil-user__all-sites">All sites</span>;
  }
  const known = await companies(payload);
  const rows = Array.isArray(rowData.tenants)
    ? (rowData.tenants as TenantRef[])
    : [];
  return (
    <span className="dil-user__sites">
      {rows.map(({ tenant }, index) => {
        const id = typeof tenant === "object" ? tenant.id : tenant;
        const company = known.get(String(id));
        const name = company?.name ?? "Company";
        return (
          <span
            className="dil-site-chip"
            key={`${id}-${index}`}
            style={{ background: tenantColors(company?.brandColor).light }}
            title={name}
          >
            <span aria-hidden>{initials({ name })}</span>
            <span className="dil-sr-only">{name}</span>
          </span>
        );
      })}
    </span>
  );
}
