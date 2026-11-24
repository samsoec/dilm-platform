import "server-only";

import {
  siteEndpointPath,
  type SiteEnvelope,
  type SiteScope,
  type SiteTenant,
} from "@dilm/shared-types";

import { cmsFetch } from "../cms/signedFetch";

import { fixtureModeEnabled } from "./fixtureMode";

export type Transport = (
  path: string,
  init: { signal: AbortSignal },
) => Promise<Response>;

export type Fixtures = Record<string, unknown>;

export function fixtureKey(endpoint: string, scope: SiteScope): string {
  return siteEndpointPath(endpoint, scope);
}

export function fixtureTransport(fixtures: Fixtures): Transport {
  return async (path) => {
    if (!(path in fixtures)) {
      return Response.json(
        { error: { code: "not-found", message: "No fixture." } },
        { status: 404 },
      );
    }
    const body: SiteEnvelope<unknown> = { data: fixtures[path] };
    return Response.json(body);
  };
}

export const defaultFixtures = (): Fixtures => {
  const tenants: SiteTenant[] = (
    [
      ["indoacid", "Indonesian Acids Industry"],
      ["duniakimia", "Dunia Kimia Utama"],
      ["likutelaga", "Liku Telaga"],
    ] as const
  ).flatMap(([tenant, name]) =>
    (["en", "id"] as const).map((locale) => ({
      tenant,
      locale,
      seo: { title: name, description: null, ogImageUrl: null },
      analyticsId: null,
    })),
  );
  return Object.fromEntries(
    tenants.map((row) => [fixtureKey("tenant", row), row]),
  );
};

export function selectTransport(
  env: Record<string, string | undefined> = process.env,
  fetcher: typeof fetch = fetch,
): Transport {
  if (fixtureModeEnabled(env)) {
    return fixtureTransport(defaultFixtures());
  }
  return (path, init) => cmsFetch(path, env, fetcher, init);
}
