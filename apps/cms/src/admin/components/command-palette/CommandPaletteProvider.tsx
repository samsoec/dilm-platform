import { getVisibleEntities } from "@payloadcms/ui/shared";
import type { PayloadRequest, ServerProps } from "payload";
import type { ReactNode } from "react";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { visibleNavSections } from "../nav/visibleSections";
import { CommandPalette } from "./CommandPalette";
import { jumpEntries, searchSources } from "./search";

export function CommandPaletteProvider({
  children,
  i18n,
  payload,
  permissions,
  user,
}: ServerProps & { children: ReactNode }) {
  if (!user || !permissions) return children;

  const { config } = payload;
  const visibleEntities = getVisibleEntities({
    req: { payload, user } as PayloadRequest,
  });
  const sections = visibleNavSections({
    config,
    i18n,
    permissions,
    visibleEntities,
    superAdmin: isSuperAdmin(user as RoleHolder),
  });
  const sources = searchSources(
    config.collections.filter(({ slug }) =>
      visibleEntities.collections.includes(slug),
    ),
    (slug) => Boolean(permissions.collections?.[slug]?.read),
    i18n.language,
  );

  return (
    <CommandPalette
      jumps={jumpEntries(sections, config.routes.admin)}
      sources={sources}
    >
      {children}
    </CommandPalette>
  );
}
