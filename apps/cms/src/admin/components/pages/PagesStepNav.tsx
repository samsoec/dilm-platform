"use client";

import { useStepNav } from "@payloadcms/ui";
import { useEffect } from "react";

export function PagesStepNav() {
  const { stepNav, setStepNav } = useStepNav();
  useEffect(() => {
    if (stepNav.at(-1)?.label === "Pages") return;
    setStepNav([...stepNav, { label: "Pages" }]);
  }, [setStepNav, stepNav]);
  return null;
}
