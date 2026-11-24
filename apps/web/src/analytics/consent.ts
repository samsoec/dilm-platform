export const CONSENT_COOKIE = "dilm_consent";

export type ConsentState = "allowed" | "denied";

export const DEFAULT_CONSENT: ConsentState = "allowed";

export function parseConsent(cookieHeader: string): ConsentState {
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== CONSENT_COOKIE) continue;
    const value = rest.join("=");
    if (value === "allowed" || value === "denied") return value;
  }
  return DEFAULT_CONSENT;
}

export function analyticsAllowed(cookieHeader: string): boolean {
  return parseConsent(cookieHeader) === "allowed";
}
