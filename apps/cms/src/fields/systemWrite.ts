import type { PayloadRequest, RequestContext } from "payload";

export const SYSTEM_WRITE = {
  dilSystemWrite: true,
} as const satisfies RequestContext;

export function isSystemWrite(req: Pick<PayloadRequest, "context">): boolean {
  return req.context?.dilSystemWrite === true;
}

export function stampsBy(
  req: Pick<PayloadRequest, "context" | "user">,
): number | string | undefined {
  if (isSystemWrite(req) || !req.user) return undefined;
  return req.user.id;
}
