"use client";

import { useStepNav } from "@payloadcms/ui";
import { useEffect } from "react";

export function ConsentStepNav({
  listLabel,
  listURL,
  label,
}: {
  listLabel: string;
  listURL: string;
  label: string;
}) {
  const { stepNav, setStepNav } = useStepNav();
  useEffect(() => {
    if (stepNav.at(-1)?.label === label) return;
    setStepNav([{ label: listLabel, url: listURL }, { label }]);
  }, [label, listLabel, listURL, setStepNav, stepNav]);
  return null;
}
