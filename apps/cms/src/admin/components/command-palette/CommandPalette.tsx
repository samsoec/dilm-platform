"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useConfig, useLocale } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { PaletteController } from "./PaletteController";
import type { PaletteEntry, SearchSource, TenantID } from "./search";

export function CommandPalette({
  children,
  jumps,
  sources,
}: {
  children: ReactNode;
  jumps: PaletteEntry[];
  sources: SearchSource[];
}) {
  const { selectedTenantID } = useTenantSelection();
  const locale = useLocale();
  const { config } = useConfig();
  const router = useRouter();

  return (
    <PaletteController
      adminRoute={config.routes.admin}
      apiURL={`${config.serverURL}${config.routes.api}`}
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
