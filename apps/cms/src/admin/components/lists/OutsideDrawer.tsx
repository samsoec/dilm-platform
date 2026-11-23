"use client";

import { useListDrawerContext } from "@payloadcms/ui";
import type { ReactNode } from "react";

export function OutsideDrawer({ children }: { children?: ReactNode }) {
  const { isInDrawer } = useListDrawerContext();
  return isInDrawer ? null : <>{children}</>;
}
