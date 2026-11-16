import type { Payload } from "payload";

import { asId } from "./routeIndex";

export type LivePage = { path: string; locale: string; name: string };

type Localized = Record<string, string | null | undefined> | string | null;

function pick(value: Localized | undefined, locale: string): string {
  if (typeof value === "string") return value;
  return value?.[locale] || value?.en || "";
}

type RouteDoc = {
  path: string;
  locale: string;
  doc?: {
    value?: {
      title?: Localized;
      name?: Localized;
      slug?: Localized;
    } | null;
  } | null;
};

export function liveKey(locale: string, path: string): string {
  return `${locale}:${path}`;
}

export async function livePagesAt(
  payload: Payload,
  tenant: number | string,
  paths: readonly string[],
): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  if (paths.length === 0) return found;
  const { docs } = await payload.find({
    collection: "routes",
    where: {
      and: [
        { path: { in: [...paths] } },
        {
          or: [
            { tenant: { equals: asId(String(tenant)) } },
            { tenant: { exists: false } },
          ],
        },
      ],
    },
    locale: "all",
    fallbackLocale: false,
    depth: 1,
    limit: 0,
    pagination: false,
    overrideAccess: true,
  });
  for (const row of docs as unknown as RouteDoc[]) {
    const value = row.doc?.value;
    const name =
      pick(value?.title, row.locale) ||
      pick(value?.name, row.locale) ||
      pick(value?.slug, row.locale) ||
      row.path;
    found.set(liveKey(row.locale, row.path), name);
  }
  return found;
}
