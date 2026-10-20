import type { Payload, TypedUser } from "payload";
import { cache } from "react";

import type { RoleHolder } from "../../access";
import { selectedTenantID, TENANT_COOKIE } from "./sidebar";

export type DashboardScope = {
  tenant: number | string;
  name: string;
  domain: string;
};

export const dashboardScope = cache(
  async (
    payload: Payload,
    user: TypedUser,
    cookies: Map<string, string>,
  ): Promise<DashboardScope | undefined> => {
    const tenant = selectedTenantID(
      user as RoleHolder,
      cookies.get(TENANT_COOKIE),
    );
    if (tenant === undefined) return undefined;
    const {
      docs: [company],
    } = await payload.find({
      collection: "tenants",
      where: { id: { equals: tenant } },
      select: { name: true, domain: true },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return company
      ? { tenant, name: company.name, domain: company.domain }
      : undefined;
  },
);

export type LayoutDocs = {
  header?: Record<string, unknown> & { id: number };
  footer?: Record<string, unknown> & { id: number };
  settings?: Record<string, unknown> & { id: number };
};

export const layoutDocs = cache(
  async (
    payload: Payload,
    user: TypedUser,
    tenant: number | string,
  ): Promise<LayoutDocs> => {
    const one = (collection: "header" | "footer" | "tenant-settings") =>
      payload
        .find({
          collection,
          where: { tenant: { equals: tenant } },
          locale: "all",
          limit: 1,
          depth: 0,
          overrideAccess: false,
          user,
        })
        .then(({ docs }) => docs[0] as unknown as LayoutDocs["header"]);
    const [header, footer, settings] = await Promise.all([
      one("header"),
      one("footer"),
      one("tenant-settings"),
    ]);
    return { header, footer, settings };
  },
);

export function englishOnly(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(englishOnly);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length > 0 && keys.every((key) => key === "en" || key === "id")) {
      return englishOnly(record.en);
    }
    return Object.fromEntries(
      Object.entries(record).map(([key, inner]) => [key, englishOnly(inner)]),
    );
  }
  return value;
}
