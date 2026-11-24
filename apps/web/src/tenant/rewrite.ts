import type { TenantSlug } from "@dilm/shared-types";

export function internalPath(tenant: TenantSlug, pathname: string): string {
  const path = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  return `/${tenant}${path}`;
}
