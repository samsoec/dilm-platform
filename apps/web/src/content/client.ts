import "server-only";

import {
  siteEndpointPath,
  type SiteEnvelope,
  type SiteScope,
  type SiteTenant,
} from "@dilm/shared-types";

import { cachedRead } from "./cache";
import { ContentError } from "./errors";
import { selectTransport, type Transport } from "./transport";

export const CONTENT_TIMEOUT_MS = 20_000;

export type ReadOptions = {
  draft?: boolean;
  transport?: Transport;
  timeoutMs?: number;
};

export function contentTags(endpoint: string, scope: SiteScope): string[] {
  return [
    `layout:${scope.tenant}`,
    `site:${scope.tenant}:${scope.locale}:${endpoint}`,
  ];
}

function assertScope(scope: SiteScope): void {
  if (!scope?.tenant || !scope?.locale) {
    throw new ContentError("contract", "A read needs a tenant and a locale.");
  }
}

async function attempt(
  transport: Transport,
  path: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await transport(path, { signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ContentError(
        "timeout",
        `No answer within ${timeoutMs} ms.`,
        error,
      );
    }
    throw new ContentError(
      "unavailable",
      "The CMS could not be reached.",
      error,
    );
  } finally {
    clearTimeout(timer);
  }
}

async function fetchEnvelope(
  transport: Transport,
  path: string,
  timeoutMs: number,
): Promise<unknown> {
  let response: Response;
  try {
    response = await attempt(transport, path, timeoutMs);
    if (response.status >= 500) {
      throw new ContentError(
        "unavailable",
        `The CMS answered ${response.status}.`,
      );
    }
  } catch (error) {
    if (!(error instanceof ContentError) || error.kind !== "unavailable") {
      throw error;
    }
    response = await attempt(transport, path, timeoutMs);
    if (response.status >= 500) {
      throw new ContentError(
        "unavailable",
        `The CMS answered ${response.status}.`,
      );
    }
  }
  if (response.status === 404) {
    throw new ContentError("not-found", "The CMS has no such content.");
  }
  if (!response.ok) {
    throw new ContentError("contract", `The CMS answered ${response.status}.`);
  }
  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new ContentError(
      "contract",
      "The CMS did not answer with JSON.",
      error,
    );
  }
  if (typeof body !== "object" || body === null || !("data" in body)) {
    throw new ContentError("contract", "The CMS answer has no data envelope.");
  }
  return (body as SiteEnvelope<unknown>).data;
}

export async function readSite<T extends SiteScope>(
  endpoint: string,
  scope: SiteScope,
  options: ReadOptions = {},
): Promise<T> {
  assertScope(scope);
  const path = siteEndpointPath(endpoint, scope);
  const draft = options.draft === true;
  return cachedRead(
    {
      key: ["site", scope.tenant, scope.locale, endpoint],
      tags: contentTags(endpoint, scope),
      draft,
    },
    async () => {
      const data = await fetchEnvelope(
        options.transport ?? selectTransport(),
        path,
        options.timeoutMs ?? CONTENT_TIMEOUT_MS,
      );
      const row = data as Partial<SiteScope> | null;
      if (row?.tenant !== scope.tenant || row?.locale !== scope.locale) {
        throw new ContentError(
          "contract",
          "The CMS answered for a different tenant or locale.",
        );
      }
      return data as T;
    },
  );
}

export function readTenant(
  scope: SiteScope,
  options?: ReadOptions,
): Promise<SiteTenant> {
  return readSite<SiteTenant>("tenant", scope, options);
}
