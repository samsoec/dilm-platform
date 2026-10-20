import { headers } from "next/headers";
import type { BasePayload } from "payload";
import { cache } from "react";

export const currentUser = cache(async (payload: BasePayload) => {
  const { user } = await payload.auth({ headers: await headers() });
  return user;
});
