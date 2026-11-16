import { createHmac, timingSafeEqual } from "node:crypto";

export const PREVIEW_PATH = "/api/preview";
export const PREVIEW_TOKEN_MINUTES = 10;

export type PreviewTokenCheck =
  | { ok: true }
  | {
      ok: false;
      reason: "malformed" | "expired" | "tampered" | "unconfigured";
    };

function digest(path: string, expires: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${path}\n${expires}`)
    .digest("hex");
}

export function signPreviewToken(
  path: string,
  secret: string,
  now: number = Date.now(),
): string {
  if (!secret) throw new Error("PREVIEW_SECRET is not configured.");
  const expires = now + PREVIEW_TOKEN_MINUTES * 60_000;
  return `${expires}.${digest(path, expires, secret)}`;
}

export function verifyPreviewToken(
  token: string,
  path: string,
  secret: string,
  now: number = Date.now(),
): PreviewTokenCheck {
  if (!secret) return { ok: false, reason: "unconfigured" };
  const [expiry, signature, ...rest] = token.split(".");
  const expires = Number(expiry);
  if (!signature || rest.length > 0 || !/^\d+$/.test(expiry ?? "")) {
    return { ok: false, reason: "malformed" };
  }
  const wanted = Buffer.from(digest(path, expires, secret));
  const given = Buffer.from(signature);
  if (wanted.length !== given.length || !timingSafeEqual(wanted, given)) {
    return { ok: false, reason: "tampered" };
  }
  if (now > expires) return { ok: false, reason: "expired" };
  return { ok: true };
}
