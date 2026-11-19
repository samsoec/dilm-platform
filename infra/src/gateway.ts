import { isIPv4 } from "node:net";

export const ADMIN_ALLOWED_IPS_ENV = "ADMIN_ALLOWED_IPS";
export const ADMIN_ALLOWED_IP_COUNT = 4;
export const ADMIN_OPEN_TO_EVERYONE = "*";

type Env = Record<string, string | undefined>;

function normalise(entry: string): string {
  const [address, prefix, ...rest] = entry.split("/");
  const valid =
    rest.length === 0 &&
    isIPv4(address ?? "") &&
    (prefix === undefined || prefix === "32");
  if (!valid) {
    throw new Error(
      `${ADMIN_ALLOWED_IPS_ENV}: "${entry}" is not a single IPv4 address. Use the four static IPs (maintainer plus 3 PICs), optionally as a /32.`,
    );
  }
  return `${address}/32`;
}

export function adminAllowedIps(
  stage: string,
  env: Env = process.env,
): string[] {
  const entries = (env[ADMIN_ALLOWED_IPS_ENV] ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (entries.length === 0) {
    throw new Error(
      `${ADMIN_ALLOWED_IPS_ENV} is empty. Set the comma-separated static IPs allowed to reach the ${stage} CMS admin; the API stays closed to everyone else.`,
    );
  }
  if (entries.includes(ADMIN_OPEN_TO_EVERYONE)) {
    if (entries.length > 1) {
      throw new Error(
        `${ADMIN_ALLOWED_IPS_ENV}: "${ADMIN_OPEN_TO_EVERYONE}" opens the admin to every IP and cannot be combined with addresses.`,
      );
    }
    if (stage === "production") {
      throw new Error(
        `${ADMIN_ALLOWED_IPS_ENV}="${ADMIN_OPEN_TO_EVERYONE}" is refused on production: the production admin stays behind the IP allowlist.`,
      );
    }
    return [ADMIN_OPEN_TO_EVERYONE];
  }
  const cidrs = [...new Set(entries.map(normalise))];
  if (cidrs.length > ADMIN_ALLOWED_IP_COUNT) {
    throw new Error(
      `${ADMIN_ALLOWED_IPS_ENV} lists ${cidrs.length} addresses; the allowlist is the maintainer plus 3 PICs (${ADMIN_ALLOWED_IP_COUNT}).`,
    );
  }
  return cidrs;
}
