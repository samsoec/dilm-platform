"use client";

import { useLocale } from "@payloadcms/ui";

import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";

export function PathPrefix() {
  const { company } = useUnsavedChangesGuard();
  const { code } = useLocale();
  if (!company?.domain) return null;
  return (
    <span aria-hidden="true" className="dil-path-prefix">
      {company.domain}/{code}
    </span>
  );
}
