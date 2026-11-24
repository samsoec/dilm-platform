import config from "@payload-config";
import { getPayload } from "payload";

import {
  parseSiteScope,
  readSiteTenant,
  siteError,
  siteOk,
} from "../../../../../siteApi";

export async function GET(request: Request) {
  const scope = parseSiteScope(new URL(request.url));
  if (scope instanceof Response) return scope;
  try {
    const payload = await getPayload({ config });
    const tenant = await readSiteTenant(payload, scope);
    if (tenant === null) return siteError("not-found", "Unknown tenant.");
    return siteOk(tenant);
  } catch {
    return siteError("unavailable", "The CMS could not answer.");
  }
}
