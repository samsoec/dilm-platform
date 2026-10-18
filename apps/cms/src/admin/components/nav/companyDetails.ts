"use client";

import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useState } from "react";

import { type TenantColors, tenantColors } from "../../brandColor";

export type CompanyDetail = {
  domain?: string;
  colors: TenantColors;
  logo?: string;
};

type TenantRow = { id: number | string; domain?: string; brandColor?: string };
type SettingsRow = {
  tenant?: number | string | { id: number | string };
  brand?: { logoOnDark?: { url?: string } | number | null };
};

function tenantID(tenant: SettingsRow["tenant"]) {
  return typeof tenant === "object" ? tenant?.id : tenant;
}

export function useCompanyDetails(
  enabled: boolean,
): Map<string, CompanyDetail> | undefined {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [details, setDetails] = useState<Map<string, CompanyDetail>>();

  useEffect(() => {
    if (!enabled || details) return;
    const request = new AbortController();
    const get = (path: `/${string}`) =>
      fetch(formatAdminURL({ apiRoute: routes.api, serverURL, path }), {
        credentials: "include",
        signal: request.signal,
      }).then((response) => (response.ok ? response.json() : { docs: [] }));

    void Promise.all([
      get(
        "/tenants?depth=0&limit=100&select[domain]=true&select[brandColor]=true",
      ),
      get(
        "/tenant-settings?depth=1&limit=100&select[tenant]=true&select[brand][logoOnDark]=true",
      ),
    ])
      .then(([tenants, settings]) => {
        const logos = new Map(
          (settings.docs as SettingsRow[]).map((row) => [
            String(tenantID(row.tenant)),
            typeof row.brand?.logoOnDark === "object"
              ? row.brand.logoOnDark?.url
              : undefined,
          ]),
        );
        setDetails(
          new Map(
            (tenants.docs as TenantRow[]).map((tenant) => [
              String(tenant.id),
              {
                domain: tenant.domain,
                colors: tenantColors(tenant.brandColor),
                logo: logos.get(String(tenant.id)),
              },
            ]),
          ),
        );
      })
      .catch(() => undefined);
    return () => request.abort();
  }, [details, enabled, routes.api, serverURL]);

  return details;
}
