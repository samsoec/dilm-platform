import type { Payload, TypedUser } from "payload";

import { localization } from "../../localization";
import { SITE_MESSAGES, linkedPageIds } from "../../siteMessages";
import {
  LINKED_BY_CONSENT,
  LINKED_BY_COOKIE_BANNER,
} from "../../legal/legalText";

type Context = { payload: Payload; user: TypedUser };

export type LegalEntry = {
  id: string;
  title: string;
  notes: string[];
};

export function hasArticleHeader(layout: unknown): boolean {
  return (
    Array.isArray(layout) &&
    layout.some(
      (row) =>
        (row as { blockType?: unknown } | null)?.blockType === "articleHeader",
    )
  );
}

function linkedIn(byLocale: unknown): Set<string> {
  const found = new Set<string>();
  if (!byLocale || typeof byLocale !== "object") return found;
  for (const body of Object.values(byLocale)) {
    for (const id of linkedPageIds(body)) found.add(id);
  }
  return found;
}

async function cookieLinked(
  { payload, user }: Context,
  tenant: string,
): Promise<Set<string>> {
  const { docs } = await payload.find({
    collection: SITE_MESSAGES,
    where: { tenant: { equals: tenant } },
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    pagination: false,
    overrideAccess: false,
    user,
  });
  const found = new Set<string>();
  for (const doc of docs as unknown as {
    cookieBanner?: { body?: unknown };
  }[]) {
    for (const id of linkedIn(doc.cookieBanner?.body)) found.add(id);
  }
  return found;
}

async function consentLinked(
  { payload, user }: Context,
  tenant: string,
): Promise<Set<string>> {
  const { docs } = await payload.find({
    collection: "pages",
    where: {
      and: [
        { tenant: { equals: tenant } },
        { "layout.blockType": { equals: "contactInquiry" } },
      ],
    },
    locale: "all",
    fallbackLocale: false,
    draft: true,
    depth: 0,
    pagination: false,
    select: { layout: true },
    overrideAccess: false,
    user,
  });
  const found = new Set<string>();
  for (const doc of docs as unknown as { layout?: unknown[] }[]) {
    for (const row of doc.layout ?? []) {
      const text = (row as { form?: { consentText?: unknown } | null } | null)
        ?.form?.consentText;
      for (const id of linkedIn(text)) found.add(id);
    }
  }
  return found;
}

export async function loadLegalPages(
  context: Context,
  tenant: string,
  locale: string,
): Promise<LegalEntry[]> {
  const { docs } = await context.payload.find({
    collection: "pages",
    where: {
      and: [
        { tenant: { equals: tenant } },
        { "layout.blockType": { equals: "articleHeader" } },
      ],
    },
    locale: locale as "en",
    fallbackLocale: localization.defaultLocale,
    draft: true,
    depth: 0,
    pagination: false,
    select: { title: true, slug: true },
    sort: "title",
    overrideAccess: false,
    user: context.user,
  });
  const [cookie, consent] = await Promise.all([
    cookieLinked(context, tenant),
    consentLinked(context, tenant),
  ]);
  return (
    docs as unknown as { id: number | string; title?: string; slug?: string }[]
  ).map((doc) => {
    const id = String(doc.id);
    return {
      id,
      title: doc.title || doc.slug || "Untitled",
      notes: [
        ...(consent.has(id) ? [LINKED_BY_CONSENT] : []),
        ...(cookie.has(id) ? [LINKED_BY_COOKIE_BANNER] : []),
      ],
    };
  });
}
