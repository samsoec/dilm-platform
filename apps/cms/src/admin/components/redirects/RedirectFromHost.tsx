"use client";

import { useConfig, useFormFields } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useState } from "react";

export function RedirectFromHost() {
  const tenant = useFormFields(([fields]) => fields.tenant?.value);
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [domain, setDomain] = useState("");
  const id =
    typeof tenant === "number" || typeof tenant === "string"
      ? String(tenant)
      : "";

  useEffect(() => {
    if (!id) {
      setDomain("");
      return;
    }
    const controller = new AbortController();
    fetch(
      `${formatAdminURL({ apiRoute: routes.api, serverURL, path: `/tenants/${id}` })}?depth=0&select[domain]=true`,
      { credentials: "include", signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : undefined))
      .then((tenantDoc: { domain?: string } | undefined) =>
        setDomain(tenantDoc?.domain ?? ""),
      )
      .catch(() => undefined);
    return () => controller.abort();
  }, [id, routes.api, serverURL]);

  return (
    <span className="dil-redirects__host">
      {domain ? `Old URL on ${domain}` : "Old URL on all three sites"}
    </span>
  );
}
