import { linkedPageIds } from "../siteMessages";

export const NOT_FOUND_RESPONSE = "Returns HTTP 404 and isn't indexed.";

export const POLICY_VERSION_HINT =
  "Change the version only when the Cookie Policy changes: every visitor sees the banner again.";

export const NOT_FOUND_PROBE_PATH = "page-not-found";

export const CONSENT_NOTES = [
  "Visitors choose Accept or Reject. Analytics stay off until they accept.",
  "The choice is remembered per browser and saved to the consent log.",
  "Changing the policy version asks every visitor to choose again.",
  "The banner text must link to your Cookie Policy page.",
];

export function siteMessagesSubtitle(domain: string | undefined): string {
  return `The 404 page and the cookie banner on ${domain ?? "this site"}. Saving updates the live site.`;
}

export function siteMessagesViewerNotice(company: string | undefined): string {
  return `You can view site messages. Editors of ${company ?? "this company"} and Super Admins can change them.`;
}

export function policyVersionWarning(
  was: string | undefined,
  domain: string | undefined,
): string {
  return `Was ${was?.trim() ? was.trim() : "not set"}. After you save, every visitor to ${domain ?? "this site"} sees the banner again and analytics pause until they choose.`;
}

export function policyVersionChanged(
  was: unknown,
  now: unknown,
): { was: string; changed: boolean } {
  const before = typeof was === "string" ? was.trim() : "";
  const after = typeof now === "string" ? now.trim() : "";
  return { was: before, changed: before !== after };
}

export function cookiePolicyCheckLine(path: string): string {
  return path ? `Links to Cookie Policy (${path})` : "Links to Cookie Policy";
}

export function firstLinkedPageId(body: unknown): string | undefined {
  return linkedPageIds(body)[0];
}

export function plainText(node: unknown): string {
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (!node || typeof node !== "object") return "";
  const record = node as Record<string, unknown>;
  if (typeof record.text === "string") return record.text;
  const inner = Array.isArray(record.children)
    ? plainText(record.children)
    : "";
  return record.type === "paragraph" || record.type === "root"
    ? `${inner} `
    : inner;
}

export function bannerText(body: unknown): string {
  const root = (body as { root?: unknown } | null | undefined)?.root;
  return plainText(root ?? body)
    .replace(/\s+/g, " ")
    .trim();
}

export function notFoundUrl(domain: string, locale: string): string {
  return `https://${domain}/${locale}/${NOT_FOUND_PROBE_PATH}`;
}
