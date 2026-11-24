import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REVALIDATE_PATH } from "@dilm/runtime-config";

import { withSecurityHeaders } from "./security/headers";
import { legacyRedirect } from "./tenant/legacy";
import { DEFAULT_LOCALE, isLocale } from "./tenant/locales";
import { LOCALE_HEADER, TENANT_HEADER } from "./tenant/headers";
import { internalPath } from "./tenant/rewrite";
import { parseAliases, resolveTenant } from "./tenant/resolveTenant";

let cachedRaw: string | undefined;
let cachedAliases = parseAliases(undefined);

function aliasesFromEnv() {
  const raw = process.env.TENANT_HOST_ALIASES;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedAliases = parseAliases(raw);
  }
  return cachedAliases;
}

function notFound() {
  return withSecurityHeaders(
    new NextResponse("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    }),
  );
}

export function proxy(request: NextRequest) {
  const aliases = aliasesFromEnv();
  const tenant = resolveTenant(request.headers.get("host"), aliases);
  if (tenant === null) {
    return notFound();
  }
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  if (pathname === REVALIDATE_PATH) {
    const apiHeaders = new Headers(request.headers);
    apiHeaders.set(TENANT_HEADER, tenant);
    return NextResponse.next({ request: { headers: apiHeaders } });
  }
  if (pathname === "/") {
    url.pathname = `/${DEFAULT_LOCALE}`;
    return withSecurityHeaders(NextResponse.redirect(url, 307));
  }
  if (pathname === "/robots.txt") {
    url.pathname = internalPath(tenant, pathname);
    const robotsHeaders = new Headers(request.headers);
    robotsHeaders.set(TENANT_HEADER, tenant);
    return NextResponse.rewrite(url, { request: { headers: robotsHeaders } });
  }
  if (!isLocale(pathname.split("/")[1] ?? "")) {
    const target = legacyRedirect(pathname);
    if (target === null) {
      return notFound();
    }
    url.pathname = target;
    return withSecurityHeaders(NextResponse.redirect(url, 301));
  }
  url.pathname = internalPath(tenant, pathname);
  const headers = new Headers(request.headers);
  headers.set(TENANT_HEADER, tenant);
  headers.set(LOCALE_HEADER, pathname.split("/")[1] ?? DEFAULT_LOCALE);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
