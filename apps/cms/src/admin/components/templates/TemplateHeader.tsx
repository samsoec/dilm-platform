"use client";

import { MaterialIcon } from "../MaterialIcon";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import type { PublishStatus } from "../kit/publication";
import { allSitesLabel } from "../kit/reach";
import { RefreshAfterSave, useLiveStatus } from "../editor/EditorHeader";

export function TemplateHeader({
  title,
  shared,
  status,
  domain,
  children,
}: {
  title: string;
  shared: boolean;
  status: PublishStatus;
  domain?: string;
  children: React.ReactNode;
}) {
  const live = useLiveStatus(status);
  return (
    <header className="dil-editor-header">
      <RefreshAfterSave />
      <div className="dil-editor-header__row">
        <h1 className="dil-editor-title">{title}</h1>
        <PublishBadge status={live} />
        <ReachBadge
          reach={
            shared
              ? { scope: "all", sites: 3, label: allSitesLabel() }
              : { scope: "tenant", domain, label: domain ?? "This site" }
          }
        />
        <span className="dil-template-strip__hint">
          <MaterialIcon name="dashboard_customize" />
          One layout for every record of this kind
        </span>
      </div>
      {children}
    </header>
  );
}
