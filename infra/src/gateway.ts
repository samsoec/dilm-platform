import { isIPv4 } from "node:net";

export const ADMIN_ALLOWED_IPS_ENV = "ADMIN_ALLOWED_IPS";
export const ADMIN_ALLOWED_IP_COUNT = 4;

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
  const cidrs = [...new Set(entries.map(normalise))];
  if (cidrs.length > ADMIN_ALLOWED_IP_COUNT) {
    throw new Error(
      `${ADMIN_ALLOWED_IPS_ENV} lists ${cidrs.length} addresses; the allowlist is the maintainer plus 3 PICs (${ADMIN_ALLOWED_IP_COUNT}).`,
    );
  }
  return cidrs;
}
