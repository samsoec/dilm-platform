"use client";

import { useStepNav } from "@payloadcms/ui";
import { useEffect } from "react";

import { withViewCrumb } from "./topbar";

export function ListStepNav({ label }: { label: string }) {
  const { stepNav, setStepNav } = useStepNav();
  useEffect(() => {
    const next = withViewCrumb(stepNav, label);
    if (next !== stepNav) setStepNav(next);
  }, [label, setStepNav, stepNav]);
  return null;
}
