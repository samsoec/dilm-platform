import type { Payload, PayloadRequest, RichTextFieldValidation } from "payload";
import { richText } from "payload/shared";

import { localization } from "./localization";

export const SITE_MESSAGES = "site-messages";

export const COOKIE_POLICY_REQUIRED =
  "Link to your Cookie Policy page so visitors can read it before choosing. Can't save without it.";

export const COOKIE_POLICY_LOCKED =
  'Can\'t trash or unpublish "Cookie Policy". The cookie banner links to it, and must.';

type Ref = number | string | { id: number | string } | null | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function idOf(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const id = isRecord(value) ? value.id : value;
  return id === null || id === undefined || id === "" ? undefined : String(id);
}

function collectPageLinks(node: unknown, found: Set<string>): void {
  if (Array.isArray(node)) {
    for (const entry of node) collectPageLinks(entry, found);
    return;
  }
  if (!isRecord(node)) return;
  const fields = node.fields;
  if (
    node.type === "link" &&
    isRecord(fields) &&
    fields.linkType === "internal" &&
    isRecord(fields.doc) &&
    fields.doc.relationTo === "pages"
  ) {
    const id = idOf(fields.doc.value);
    if (id) found.add(id);
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") collectPageLinks(value, found);
  }
}

export function linkedPageIds(body: unknown): string[] {
  const found = new Set<string>();
  collectPageLinks(body, found);
  return [...found];
}

type PageRow = {
  tenant?: Ref;
  _status?: string | null;
  deletedAt?: string | null;
};

async function ownerOf(
  data: { tenant?: Ref } | undefined,
  id: Ref,
  req: PayloadRequest,
): Promise<string | undefined> {
  const given = idOf(data?.tenant);
  if (given || idOf(id) === undefined) return given;
  const stored = await req.payload
    .findByID({
      collection: SITE_MESSAGES,
      id: id as number | string,
      depth: 0,
      overrideAccess: true,
      req,
    })
    .catch(() => undefined);
  return idOf((stored as { tenant?: Ref } | undefined)?.tenant);
}

async function isLivePageOf(
  pageId: string,
  tenant: string,
  req: PayloadRequest,
): Promise<boolean> {
  const page = (await req.payload
    .findByID({
      collection: "pages",
      id: pageId,
      depth: 0,
      draft: false,
      trash: true,
      overrideAccess: true,
      req,
    })
    .catch(() => undefined)) as PageRow | undefined;
  return (
    Boolean(page) &&
    idOf(page!.tenant) === tenant &&
    page!._status === "published" &&
    !page!.deletedAt
  );
}

async function checkBody(
  value: unknown,
  locale: string,
  data: { tenant?: Ref } | undefined,
  id: Ref,
  req: PayloadRequest,
): Promise<true | string> {
  const ids = linkedPageIds(value);
  if (ids.length === 0) {
    const untranslated =
      locale !== localization.defaultLocale && !hasText(value);
    return untranslated ? true : COOKIE_POLICY_REQUIRED;
  }
  const tenant = await ownerOf(data, id, req);
  if (!tenant) return COOKIE_POLICY_REQUIRED;
  for (const pageId of ids) {
    if (await isLivePageOf(pageId, tenant, req)) return true;
  }
  return COOKIE_POLICY_REQUIRED;
}

function hasOnlyLocaleKeys(value: Record<string, unknown>): boolean {
  return Object.keys(value).every((key) =>
    (localization.locales as readonly string[]).includes(key),
  );
}

export const requireCookiePolicyLink: RichTextFieldValidation = async (
  value,
  args,
) => {
  const invalid = await richText(value, args);
  if (invalid !== true) return invalid;
  const { req, data, id } = args as unknown as {
    req: PayloadRequest;
    data?: { tenant?: Ref };
    id?: Ref;
  };
  const requested = req?.locale ?? localization.defaultLocale;
  if (requested === "all" && isRecord(value) && !("root" in value)) {
    if (!hasOnlyLocaleKeys(value)) return COOKIE_POLICY_REQUIRED;
    for (const [locale, body] of Object.entries(value)) {
      const result = await checkBody(body, locale, data, id, req);
      if (result !== true) return result;
    }
    const hasDefault = localization.defaultLocale in value;
    if (!hasDefault && idOf(id) === undefined) return COOKIE_POLICY_REQUIRED;
    return true;
  }
  const locale = requested === "all" ? localization.defaultLocale : requested;
  return checkBody(value, locale, data, id, req);
};

function hasText(node: unknown): boolean {
  if (Array.isArray(node)) return node.some(hasText);
  if (!isRecord(node)) return false;
  if (typeof node.text === "string" && node.text.trim()) return true;
  return Object.values(node).some(
    (value) => Boolean(value) && typeof value === "object" && hasText(value),
  );
}

export type CookiePolicyLink = {
  id: number | string;
  tenant: string | undefined;
  locales: string[];
};

export async function findCookiePolicyLinks(
  pageId: Ref,
  { payload, req }: { payload: Payload; req?: PayloadRequest },
): Promise<CookiePolicyLink[]> {
  const target = idOf(pageId);
  if (target === undefined) return [];
  const result = await payload.find({
    collection: SITE_MESSAGES,
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    ...(req ? { req } : {}),
  });
  return result.docs.flatMap((doc) => {
    const body = (
      doc as { cookieBanner?: { body?: Record<string, unknown> | null } }
    ).cookieBanner?.body;
    if (!isRecord(body)) return [];
    const locales = Object.entries(body)
      .filter(([, value]) => linkedPageIds(value).includes(target))
      .map(([locale]) => locale);
    return locales.length === 0
      ? []
      : [
          {
            id: (doc as { id: number | string }).id,
            tenant: idOf((doc as { tenant?: Ref }).tenant),
            locales,
          },
        ];
  });
}
