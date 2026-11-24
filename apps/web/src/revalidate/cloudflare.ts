import type { CloudflareConfig, RevalidationPurge } from "@dilm/runtime-config";

export type PurgeOutcome =
  | { status: "skipped"; reason: string }
  | { status: "done"; requests: number }
  | { status: "failed"; requests: number; failures: string[] };

export type Purger = (entries: RevalidationPurge[]) => Promise<PurgeOutcome>;

export type CloudflareFetch = (
  url: string,
  init: { method: "POST"; headers: Record<string, string>; body: string },
) => Promise<{ ok: boolean; status: number }>;

export const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";
export const PURGE_BATCH = 30;

export const disabledPurger: Purger = async () => ({
  status: "skipped",
  reason: "Cloudflare credentials or zone ids are not configured.",
});

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function cloudflarePurger(
  config: CloudflareConfig | undefined,
  send: CloudflareFetch = (url, init) => fetch(url, init),
): Purger {
  if (!config) return disabledPurger;
  return async (entries) => {
    const perZone = new Map<string, { files: string[]; prefixes: string[] }>();
    const failures: string[] = [];
    for (const entry of entries) {
      const host = entry.host.toLowerCase();
      const zone = config.zones[host];
      if (!zone) {
        failures.push(`No Cloudflare zone is configured for ${host}.`);
        continue;
      }
      const bucket = perZone.get(zone) ?? { files: [], prefixes: [] };
      if (entry.exact) bucket.files.push(`https://${host}${entry.pathPrefix}`);
      else bucket.prefixes.push(`${host}${entry.pathPrefix}`);
      perZone.set(zone, bucket);
    }
    let requests = 0;
    for (const [zone, { files, prefixes }] of perZone) {
      const bodies = [
        ...chunks(files, PURGE_BATCH).map((part) => ({ files: part })),
        ...chunks(prefixes, PURGE_BATCH).map((part) => ({ prefixes: part })),
      ];
      for (const body of bodies) {
        requests += 1;
        try {
          const response = await send(
            `${CLOUDFLARE_API}/zones/${zone}/purge_cache`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${config.apiToken}`,
                "content-type": "application/json",
              },
              body: JSON.stringify(body),
            },
          );
          if (!response.ok) {
            failures.push(`Zone ${zone} answered ${response.status}.`);
          }
        } catch (error) {
          failures.push(
            `Zone ${zone} could not be reached: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
    return failures.length > 0
      ? { status: "failed", requests, failures }
      : { status: "done", requests };
  };
}
