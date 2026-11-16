"use client";

import {
  useConfig,
  useDocumentInfo,
  useFormFields,
  useLocale,
  useModal,
} from "@payloadcms/ui";
import { useMemo } from "react";

import { VERSIONS_DRAWER_SLUG } from "../document/VersionsDrawer";
import { RefreshAfterSave, useLiveStatus } from "../editor/EditorHeader";
import { publishingLines } from "../editor/editor";
import { computeUrls, relationId, type ParentPaths } from "../editor/urls";
import { ActionButton } from "../kit/ActionButton";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import type { PublishStatus } from "../kit/publication";
import { getReach } from "../kit/reach";
import { MaterialIcon } from "../MaterialIcon";
import {
  CATEGORY_HELP,
  categoryDescription,
  EXCERPT_LIMIT,
  EXCERPT_OVERFLOW,
  HAND_PICK_NOTE,
  placementsFor,
  WILL_APPEAR_NONE,
  WILL_APPEAR_TITLE,
  type LatestSection,
} from "./posts";

function useCategory(): string | undefined {
  const value = useFormFields(([fields]) => fields.primaryCategory?.value);
  return relationId(value as Parameters<typeof relationId>[0]);
}

export function PostHeader({
  status,
  domain,
  slugs,
  categoryPaths,
}: {
  status: PublishStatus;
  domain: string;
  slugs: Record<string, string>;
  categoryPaths: Record<string, ParentPaths>;
}) {
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const slug = useFormFields(([fields]) => fields.slug?.value) as
    string | undefined;
  const category = useCategory();
  const live = useLiveStatus(status);
  const { code } = useLocale();
  const {
    config: { localization },
  } = useConfig();
  const locales = useMemo(
    () => (localization ? localization.localeCodes : [code]),
    [code, localization],
  );
  const defaultLocale = localization ? localization.defaultLocale : code;
  const rows = useMemo(
    () =>
      computeUrls({
        domain,
        locales,
        defaultLocale,
        slugs: { ...slugs, [code]: slug ?? "" },
        parentPaths: category ? categoryPaths[category] : undefined,
      }),
    [
      categoryPaths,
      category,
      code,
      defaultLocale,
      domain,
      locales,
      slug,
      slugs,
    ],
  );
  return (
    <header className="dil-editor-header">
      <RefreshAfterSave />
      <div className="dil-editor-header__row">
        <h1 className="dil-editor-title">{title?.trim() || "Untitled post"}</h1>
        <PublishBadge status={live} />
        <ReachBadge
          reach={getReach(
            { tenant: domain || "own" },
            { collection: "posts", tenants: [{ id: domain || "own", domain }] },
          )}
        />
      </div>
      <ul aria-label="Post addresses" className="dil-editor-urls">
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
    </header>
  );
}

export function ExcerptOverflow({ path }: { path?: string }) {
  const length = useFormFields(([fields]) => {
    const value = path ? fields[path]?.value : "";
    return typeof value === "string" ? value.length : 0;
  });
  if (length <= EXCERPT_LIMIT) return null;
  return (
    <p className="dil-field-warning" role="alert">
      <MaterialIcon name="warning" />
      {EXCERPT_OVERFLOW}
    </p>
  );
}

export function CategoryDescription({
  descriptions,
}: {
  descriptions?: Record<string, string>;
}) {
  const category = useCategory();
  const text = categoryDescription(descriptions, category);
  return (
    <>
      <p className="dil-seo-note">{CATEGORY_HELP}</p>
      {text && <p className="dil-seo-note">{text}</p>}
    </>
  );
}

function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="dil-editor-panel">
      <h2 className="dil-editor-panel__title" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export type PostSidebarProps = {
  status: PublishStatus;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  versions: number;
  sections: LatestSection[];
  categoryNames: Record<string, string>;
  publicationSet: boolean;
};

export function PostSidebar(props: PostSidebarProps) {
  const status = useLiveStatus(props.status);
  const { id } = useDocumentInfo();
  const { openModal } = useModal();
  const category = useCategory();
  const live = status === "published" || status === "changed";
  const lines = publishingLines({
    status,
    liveSince: props.liveSince,
    savedAt: props.savedAt,
    savedBy: props.savedBy,
  });
  const placements = placementsFor({
    category,
    categoryName: category ? props.categoryNames[category] : undefined,
    sections: props.sections,
    publicationSet: props.publicationSet,
  });
  const hasSection = placements.some(
    ({ key }) => !["all", "category"].includes(key),
  );
  return (
    <aside aria-label="Post details" className="dil-editor-sidebar">
      <Panel id="dil-panel-appear" title={WILL_APPEAR_TITLE}>
        {!category && (
          <p className="dil-editor-panel__note">
            Pick a primary category to see its tab.
          </p>
        )}
        <ul className="dil-editor-publish__urls">
          {placements.map(({ key, text, note }) => (
            <li key={key}>
              <MaterialIcon name="check" /> {text}
              {note && (
                <span className="dil-editor-panel__note"> · {note}</span>
              )}
            </li>
          ))}
        </ul>
        {!hasSection && (
          <p className="dil-editor-panel__note">{WILL_APPEAR_NONE}</p>
        )}
        <p className="dil-editor-panel__note">{HAND_PICK_NOTE}</p>
      </Panel>
      <Panel id="dil-panel-publishing" title="Publishing">
        {id === undefined ? (
          <p className="dil-editor-panel__note">
            Nothing is saved yet. Save a draft to start the history, or publish
            to put the post on the website.
          </p>
        ) : (
          <>
            <p
              className={`dil-editor-fact ${live ? "dil-editor-fact--ok" : "dil-editor-fact--muted"}`}
            >
              <MaterialIcon name={live ? "check_circle" : "schedule"} />
              {lines.live}
            </p>
            <p
              className={`dil-editor-fact dil-editor-fact--${lines.state.tone}`}
            >
              <MaterialIcon
                name={lines.state.tone === "ok" ? "task_alt" : "edit_note"}
              />
              {lines.state.text}
            </p>
            {lines.saved && (
              <p className="dil-editor-panel__note">{lines.saved}</p>
            )}
            <p className="dil-editor-panel__note">Version {props.versions}</p>
            <ActionButton
              icon="history"
              onClick={() => openModal(VERSIONS_DRAWER_SLUG)}
              type="button"
              variant="secondary"
            >
              History
            </ActionButton>
          </>
        )}
      </Panel>
    </aside>
  );
}
