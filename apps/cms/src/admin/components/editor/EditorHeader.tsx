"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { MaterialIcon } from "../MaterialIcon";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import { getPublishStatus, type PublishStatus } from "../kit/publication";
import { getReach } from "../kit/reach";
import { LEGAL_PAGE_TAG } from "../../../legal/legalText";
import { PUBLICATION_TAG } from "../publication/publication";
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
  publicationPage?: boolean;
  legalPage?: boolean;
};

export function EditorHeader({
  seed,
  collection,
  status,
  tenant,
  untitled,
  publicationPage,
  legalPage,
}: EditorHeaderProps) {
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const live = useLiveStatus(status);
  const { rows: ownRows, siteRows, parentError } = useEditorUrls(seed);
  const reach = getReach(
    { tenant: tenant?.id ?? null },
    {
      collection,
      tenants: tenant ? [{ id: tenant.id, domain: tenant.domain }] : [],
    },
  );

  const shared = collection === "shared-pages";
  const rows = shared && siteRows.length > 0 ? siteRows.flat() : ownRows;

  return (
    <header className="dil-editor-header">
      <RefreshAfterSave />
      <div className="dil-editor-header__row">
        {shared && <ReachBadge reach={reach} />}
        <h1 className="dil-editor-title">{title?.trim() || untitled}</h1>
        {publicationPage && (
          <span className="dil-editor-header__tag">{PUBLICATION_TAG}</span>
        )}
        {legalPage && (
          <span className="dil-editor-header__tag">{LEGAL_PAGE_TAG}</span>
        )}
        <PublishBadge status={live} />
        {!shared && <ReachBadge reach={reach} />}
      </div>
      <ul aria-label="Page addresses" className="dil-editor-urls">
        {rows.map((row) => (
          <li className="dil-editor-urls__item" key={row.display}>
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
