import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { legacyRedirect } from "./tenant/legacy";
import { DEFAULT_LOCALE, isLocale } from "./tenant/locales";
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

export function proxy(request: NextRequest) {
  const aliases = aliasesFromEnv();
  const tenant = resolveTenant(request.headers.get("host"), aliases);
  if (tenant === null) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  if (pathname === "/") {
    url.pathname = `/${DEFAULT_LOCALE}`;
    return NextResponse.redirect(url, 307);
  }
  if (!isLocale(pathname.split("/")[1] ?? "")) {
    const target = legacyRedirect(pathname);
    if (target === null) {
      return new NextResponse("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }
  url.pathname = internalPath(tenant, pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
