import { revalidateTag } from "next/cache";

import { loadEdgeConfig, type EdgeConfig } from "@dilm/runtime-config";

import { cloudflarePurger } from "@/revalidate/cloudflare";
import {
  WARM_TIMEOUT_MS,
  handleRevalidate,
  type WarmTarget,
} from "@/revalidate/handle";
import { parseAliases, resolveTenant } from "@/tenant/resolveTenant";

export const dynamic = "force-dynamic";

let edge: Promise<EdgeConfig> | undefined;

function edgeConfig(): Promise<EdgeConfig> {
  edge ??= loadEdgeConfig(process.env).catch((error: unknown) => {
    edge = undefined;
    throw error;
  });
  return edge;
}

async function warm(request: Request, target: WarmTarget): Promise<boolean> {
  const origin =
    process.env.WEB_ORIGIN_URL?.trim() || new URL(request.url).origin;
  const response = await fetch(`${origin}${target.path}`, {
    headers: { host: target.host, "cache-control": "no-cache" },
    redirect: "manual",
    signal: AbortSignal.timeout(WARM_TIMEOUT_MS),
  });
  await response.arrayBuffer();
  return response.ok;
}

export async function POST(request: Request): Promise<Response> {
  let config: EdgeConfig = {};
  try {
    config = await edgeConfig();
  } catch (error) {
    console.error("Revalidation config could not be read", error);
  }
  const aliases = parseAliases(process.env.TENANT_HOST_ALIASES);
  const result = await handleRevalidate(request, {
    secret: config.revalidateSecret,
    knownHost: (host) => resolveTenant(host, aliases) !== null,
    expireTag: (tag) => revalidateTag(tag, { expire: 0 }),
    warm: (target) => warm(request, target),
    purge: cloudflarePurger(config.cloudflare),
    log: {
      info: (data, message) => console.info(message, data),
      error: (data, message) => console.error(message, data),
    },
  });
  return Response.json(result.body, {
    status: result.status,
    headers: { "cache-control": "no-store" },
  });
}
