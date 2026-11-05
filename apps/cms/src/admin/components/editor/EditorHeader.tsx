"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { MaterialIcon } from "../MaterialIcon";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import { getPublishStatus, type PublishStatus } from "../kit/publication";
import { getReach } from "../kit/reach";
import { useEditorUrls, type UrlSeed } from "./useEditorUrls";

export function useLiveStatus(initial: PublishStatus): PublishStatus {
  const { hasPublishedDoc, unpublishedVersionCount } = useDocumentInfo();
  if (initial === "trashed") return "trashed";
  return getPublishStatus(
    {
      _status:
        hasPublishedDoc && !unpublishedVersionCount ? "published" : "draft",
    },
    { hasPublishedVersion: Boolean(hasPublishedDoc) },
  );
}

export function RefreshAfterSave() {
  const router = useRouter();
  const { lastUpdateTime } = useDocumentInfo();
  const first = useRef(lastUpdateTime);
  useEffect(() => {
    if (first.current === lastUpdateTime) return;
    first.current = lastUpdateTime;
    router.refresh();
  }, [lastUpdateTime, router]);
  return null;
}

export type EditorHeaderProps = {
  seed: UrlSeed;
  collection: string;
  status: PublishStatus;
  tenant: { id: number | string; domain?: string } | null;
  untitled: string;
};

export function EditorHeader({
  seed,
  collection,
  status,
  tenant,
  untitled,
}: EditorHeaderProps) {
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const live = useLiveStatus(status);
  const { rows, parentError } = useEditorUrls(seed);
  const reach = getReach(
    { tenant: tenant?.id ?? null },
    {
      collection,
      tenants: tenant ? [{ id: tenant.id, domain: tenant.domain }] : [],
    },
  );

  return (
    <header className="dil-editor-header">
      <RefreshAfterSave />
      <div className="dil-editor-header__row">
        <h1 className="dil-editor-title">{title?.trim() || untitled}</h1>
        <PublishBadge status={live} />
        <ReachBadge reach={reach} />
      </div>
      <ul aria-label="Page addresses" className="dil-editor-urls">
        {rows.map((row) => (
          <li className="dil-editor-urls__item" key={row.locale}>
            <abbr
              className="dil-editor-urls__lang"
              title={row.locale === "en" ? "English" : "Indonesian"}
            >
              {row.locale.toUpperCase()}
            </abbr>
            <code className="dil-editor-urls__url">{row.display}</code>
            {row.fellBack && (
              <span className="dil-editor-urls__fallback">
                <MaterialIcon name="warning" />
                uses the English slug
              </span>
            )}
          </li>
        ))}
      </ul>
      {parentError && (
        <p className="dil-editor-urls__error" role="alert">
          <MaterialIcon name="error" />
          {parentError} The addresses above leave the parent out.
        </p>
      )}
    </header>
  );
}
