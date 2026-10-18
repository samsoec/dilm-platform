"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useConfig, useStepNav } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import {
  entityFromPath,
  entityGroup,
  isAdministration,
  withShellCrumbs,
} from "./topbar";

export function ShellCrumbs({ children }: { children: ReactNode }) {
  const { stepNav, setStepNav } = useStepNav();
  const { options, selectedTenantID } = useTenantSelection();
  const { config } = useConfig();
  const pathname = usePathname();

  const tenant = options.find(({ value }) => value === selectedTenantID)
    ?.label as string | undefined;
  const group = entityGroup(
    config,
    entityFromPath(pathname, config.routes.admin),
  );

  useEffect(() => {
    const labels = [isAdministration(group) ? undefined : tenant, group].filter(
      (label): label is string => typeof label === "string" && label !== "",
    );
    const next = withShellCrumbs(stepNav, labels);
    if (next !== stepNav) setStepNav(next);
  }, [group, setStepNav, stepNav, tenant]);

  return children;
}
