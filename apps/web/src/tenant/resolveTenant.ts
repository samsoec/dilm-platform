import { TENANT_DOMAINS, TENANT_SLUGS } from "@dilm/shared-types";
import type { TenantSlug } from "@dilm/shared-types";

export const LOCAL_HOST_SUFFIX = ".localhost";

export function parseAliases(raw: string | undefined): Map<string, TenantSlug> {
  const aliases = new Map<string, TenantSlug>();
  for (const entry of (raw ?? "").split(",")) {
    const [host, slug] = entry.split("=").map((part) => part.trim());
    if (!host || !slug) continue;
    const tenant = TENANT_SLUGS.find((candidate) => candidate === slug);
    if (tenant === undefined) {
      throw new Error(
        `TENANT_HOST_ALIASES maps "${host}" to unknown tenant "${slug}".`,
      );
    }
    aliases.set(host.toLowerCase(), tenant);
  }
  return aliases;
}

function bareHost(host: string): string {
  return host.trim().toLowerCase().replace(/\.$/, "");
}

export function resolveTenant(
  hostHeader: string | null | undefined,
  aliases: ReadonlyMap<string, TenantSlug> = new Map(),
): TenantSlug | null {
  if (!hostHeader) return null;
  const host = bareHost(hostHeader);
  const withoutPort = host.replace(/:\d+$/, "");

  if (withoutPort.endsWith(LOCAL_HOST_SUFFIX)) {
    const label = withoutPort.slice(0, -LOCAL_HOST_SUFFIX.length);
    return TENANT_SLUGS.find((slug) => slug === label) ?? null;
  }

  const alias = aliases.get(host) ?? aliases.get(withoutPort);
  if (alias !== undefined) return alias;

  for (const slug of TENANT_SLUGS) {
    const domain = TENANT_DOMAINS[slug];
    if (withoutPort === domain || withoutPort === `www.${domain}`) return slug;
  }
  return null;
}
