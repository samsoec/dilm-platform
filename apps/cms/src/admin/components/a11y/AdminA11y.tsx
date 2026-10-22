"use client";

import { type ReactNode, useEffect } from "react";

import { applyA11yPatches } from "./a11yPatches";

export function AdminA11y({ children }: { children?: ReactNode }) {
  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      applyA11yPatches(document);
    };
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(run);
    });
    run();
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <>{children}</>;
}
