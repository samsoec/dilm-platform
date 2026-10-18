import type { TextFieldServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { documentTenant, loadLayoutSources } from "../../data/layout";
import { jakartaYear } from "../../layoutEditor";
import { CopyrightPreviewClient } from "./CopyrightPreviewClient";

export async function CopyrightPreview({
  data,
  path,
  payload,
  req,
}: TextFieldServerProps) {
  const sources = await loadLayoutSources(
    payload,
    req.user,
    documentTenant(data),
  );
  return (
    <CopyrightPreviewClient
      brandHref={
        sources
          ? formatAdminURL({
              adminRoute: payload.config.routes.admin,
              path: `/collections/tenant-settings/${sources.id}?tab=brand`,
            })
          : undefined
      }
      legalName={sources?.brand?.legalName ?? undefined}
      path={path ?? "copyright"}
      year={jakartaYear()}
    />
  );
}
