import { cookies } from "next/headers";

import type { RoleHolder } from "../../../access";
import { localization } from "../../../localization";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { openEntity, type TopBarProps } from "./entity";
import { entityGroup, isAdministration, siteURL } from "./topbar";

export async function ViewSiteLink(props: TopBarProps) {
  const { locale, payload, user } = props;
  if (!user) return null;
  if (isAdministration(entityGroup(payload.config, openEntity(props)))) {
    return null;
  }

  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  if (tenant === undefined) return null;

  const {
    docs: [found],
  } = await payload.find({
    collection: "tenants",
    where: { id: { equals: tenant } },
    limit: 1,
    pagination: false,
    depth: 0,
    select: { domain: true },
    overrideAccess: false,
    user,
  });
  if (!found?.domain) return null;

  return (
    <a
      className="dil-view-site"
      href={siteURL(found.domain, locale?.code ?? localization.defaultLocale)}
      rel="noopener noreferrer"
      target="_blank"
    >
      View site
      <MaterialIcon name="open_in_new" />
      <span className="dil-sr-only"> (opens in a new tab)</span>
    </a>
  );
}
