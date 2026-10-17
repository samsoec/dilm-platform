import type { ReactNode } from "react";

import { MaterialIcon } from "../MaterialIcon";

export function ReadOnlyHint({ children }: { children: ReactNode }) {
  return (
    <p className="dil-readonly-hint">
      <MaterialIcon name="lock" />
      <span className="dil-sr-only">Read-only. </span>
      {children}
    </p>
  );
}
