import type { TextFieldServerProps } from "payload";

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
      legalName={sources?.brand?.legalName ?? undefined}
      path={path ?? "copyright"}
      year={jakartaYear()}
    />
  );
}
