"use client";

import { useStepNav } from "@payloadcms/ui";
import { useEffect } from "react";

export function PagesStepNav({ label = "Pages" }: { label?: string }) {
  const { stepNav, setStepNav } = useStepNav();
  useEffect(() => {
    if (stepNav.at(-1)?.label === label) return;
    setStepNav([...stepNav, { label }]);
  }, [setStepNav, stepNav]);
  return null;
}
