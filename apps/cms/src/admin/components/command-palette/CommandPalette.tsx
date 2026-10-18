"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useConfig, useLocale } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { PaletteController } from "./PaletteController";
import {
  companyCode,
  type PaletteEntry,
  type SearchSource,
  type TenantID,
} from "./search";

export function CommandPalette({
  children,
  jumps,
  sources,
}: {
  children: ReactNode;
  jumps: PaletteEntry[];
  sources: SearchSource[];
}) {
  const { options, selectedTenantID } = useTenantSelection();
  const locale = useLocale();
  const { config } = useConfig();
  const router = useRouter();
  const name = options.find(({ value }) => value === selectedTenantID)?.label;
  const company =
    typeof name === "string" && name
      ? { name, code: companyCode(name) }
      : undefined;

  return (
    <PaletteController
      adminRoute={config.routes.admin}
      apiURL={`${config.serverURL}${config.routes.api}`}
      company={company}
      jumps={jumps}
      locale={locale?.code}
      navigate={(href) => router.push(href)}
      sources={sources}
      tenant={(selectedTenantID ?? undefined) as TenantID | undefined}
    >
      {children}
    </PaletteController>
  );
}
