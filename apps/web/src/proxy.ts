import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const tenant = resolveTenant(host, aliases);
  if (tenant === null) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const url = request.nextUrl.clone();
  url.pathname = internalPath(tenant, request.nextUrl.pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
