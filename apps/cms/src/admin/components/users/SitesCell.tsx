import type { DefaultServerCellComponentProps } from "payload";

import type { Role } from "../../../access";
import { tenantColors } from "../../brandColor";
import { initials } from "../../initials";
import { companies, tenantIDs } from "./viewer";

export async function SitesCell({
  payload,
  rowData,
}: DefaultServerCellComponentProps) {
  const roles = Array.isArray(rowData.roles) ? (rowData.roles as Role[]) : [];
  if (roles.includes("super-admin")) {
    return <span className="dil-user__all-sites">All sites</span>;
  }
  const known = new Map(
    (await companies(payload)).map((company) => [company.id, company]),
  );
  return (
    <span className="dil-user__sites">
      {tenantIDs(rowData).map((id, index) => {
        const company = known.get(id);
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
