"use client";

import {
  Modal,
  useConfig,
  useDocumentInfo,
  useLocale,
  useModal,
  useTranslation,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { authorName } from "../../authors";
import type { IconName } from "../../icons";
import { savedAtText } from "../../layoutEditor";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { LoadingBlock } from "../kit/Loading";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import { catalogEntries, type ClientBlockLike } from "../../sectionCatalog";
import { fieldDiffs, type FieldDiff, sectionsSummary } from "./sectionCompare";
import { type ChangeKind, compareLines, summarize } from "./versionSummary";

export const VERSIONS_DRAWER_SLUG = "dil-versions";
const RESTORE_SLUG = "dil-restore-version";
const PENDING_TOAST_KEY = "dil-pending-toast";

type VersionDoc = {
  id: number | string;
  updatedAt: string;
  version: Record<string, unknown> & {
    updatedBy?: unknown;
    _status?: string;
  };
};

type Entry = VersionDoc & { number: number };

const CHANGE_ICONS: Record<Exclude<ChangeKind, "same">, IconName> = {
  added: "add",
  removed: "remove",
  edited: "edit",
};

const CHANGE_LABELS: Record<Exclude<ChangeKind, "same">, string> = {
  added: "Added",
  removed: "Removed",
  edited: "Edited",
};

function labelText(label: unknown, language: string): string {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const byLanguage = label as Record<string, string>;
    return byLanguage[language] ?? byLanguage.en ?? "Document";
  }
  return "Document";
}

function shortDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function VersionsDrawer() {
  const { collectionSlug, hasSavePermission, id } = useDocumentInfo();
  const {
    config: { localization, routes, serverURL },
    getEntityConfig,
  } = useConfig();
  const { i18n } = useTranslation();
  const { code: locale } = useLocale();
  const { closeModal, isModalOpen, openModal } = useModal();
  const { company } = useUnsavedChangesGuard();
  const [entries, setEntries] = useState<Entry[]>();
  const [failed, setFailed] = useState(false);
  const [comparing, setComparing] = useState<Entry>();
  const [restoring, setRestoring] = useState<Entry>();
  const titleId = useId();
  const open = isModalOpen(VERSIONS_DRAWER_SLUG);
  const entity = collectionSlug
    ? getEntityConfig({ collectionSlug })
    : undefined;
  const name = labelText(
    (entity as { labels?: { singular?: unknown } } | undefined)?.labels
      ?.singular,
    i18n.language,
  );
  const canRestore = hasSavePermission !== false;
  const api = useCallback(
    (path: `/${string}`) =>
      formatAdminURL({ apiRoute: routes.api, serverURL, path }),
    [routes.api, serverURL],
  );
  const docPath = formatAdminURL({
    adminRoute: routes.admin,
    path: `/collections/${collectionSlug}/${id}`,
    relative: true,
  });

  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_TOAST_KEY);
    if (!pending) return;
    const timer = setTimeout(() => {
      sessionStorage.removeItem(PENDING_TOAST_KEY);
      notify({ tone: "success", ...JSON.parse(pending) });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intercept = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.dataset.dilNative !== undefined) return;
      const target = new URL(anchor.href, window.location.href).pathname;
      if (target !== `${docPath}/versions`) return;
      event.preventDefault();
      event.stopPropagation();
      setComparing(undefined);
      openModal(VERSIONS_DRAWER_SLUG);
    };
    document.addEventListener("click", intercept, true);
    return () => document.removeEventListener("click", intercept, true);
  }, [docPath, openModal]);

  useEffect(() => {
    if (!open || id === undefined) return;
    const request = new AbortController();
    setFailed(false);
    fetch(
      api(
        `/${collectionSlug}/versions?where[parent][equals]=${id}&sort=-updatedAt&limit=50&depth=1&locale=${locale}`,
      ),
      { credentials: "include", signal: request.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((body: { docs: VersionDoc[]; totalDocs: number }) =>
        setEntries(
          body.docs.map((doc, index) => ({
            ...doc,
            number: body.totalDocs - index,
          })),
        ),
      )
      .catch((error: Error) => {
        if (error.name !== "AbortError") setFailed(true);
      });
    return () => request.abort();
  }, [api, collectionSlug, id, locale, open]);

  const current = entries?.[0];
  const drafts = !!entries?.some((entry) => entry.version._status);
  const liveId = drafts
    ? entries?.find((entry) => entry.version._status === "published")?.id
    : current?.id;
  const nameOf = useMemo(() => {
    const layout = (
      entity as
        | {
            fields?: {
              name?: string;
              blocks?: ClientBlockLike[];
            }[];
          }
        | undefined
    )?.fields?.find((field) => field.name === "layout");
    const names = new Map(
      catalogEntries(layout?.blocks ?? []).map((entry) => [
        entry.slug,
        entry.name,
      ]),
    );
    return (slug?: string) => names.get(slug ?? "") ?? slug ?? "Section";
  }, [entity]);
  const locales = (
    (localization ? localization.locales : []) as (string | { code: string })[]
  ).map((entry) => (typeof entry === "string" ? entry : entry.code));

  const restore = async () => {
    if (!restoring || !current) return;
    const response = await fetch(
      api(
        `/${collectionSlug}/versions/${restoring.id}${drafts ? "?draft=true" : ""}`,
      ),
      { method: "POST", credentials: "include" },
    );
    if (!response.ok) {
      notify({
        tone: "error",
        title: "Couldn't restore.",
        body: "Nothing changed on the site. Try again.",
      });
      throw new Error("restore failed");
    }
    sessionStorage.setItem(
      PENDING_TOAST_KEY,
      JSON.stringify({
        title: `${name} v${restoring.number} restored as v${current.number + 1}.`,
        body: drafts
          ? "It is a new draft. The live site has not changed."
          : `${company?.domain ?? "The site"} will show it within minutes.`,
      }),
    );
    window.location.reload();
  };

  return (
    <>
      {open && (
        <Modal className="dil-drawer" slug={VERSIONS_DRAWER_SLUG}>
          <aside
            aria-labelledby={titleId}
            className={`dil-drawer__panel${comparing ? " dil-drawer__panel--wide" : ""}`}
            role="dialog"
          >
            <div className="dil-drawer__head">
              <h2 className="dil-drawer__title" id={titleId}>
                {comparing
                  ? `Compare v${comparing.number}`
                  : `${name} versions`}
              </h2>
              <button
                aria-label="Close"
                className="dil-drawer__close"
                onClick={() => closeModal(VERSIONS_DRAWER_SLUG)}
                type="button"
              >
                <MaterialIcon name="close" />
              </button>
            </div>
            {failed && (
              <p className="dil-drawer__empty">
                Couldn&apos;t load the versions. Close and try again.
              </p>
            )}
            {!failed && !entries && <LoadingBlock lines={3} />}
            {entries && !comparing && (
              <ul className="dil-versions">
                {entries.map((entry, index) => {
                  const author = authorName(entry.version.updatedBy, true);
                  const date = savedAtText(entry.updatedAt);
                  return (
                    <li className="dil-versions__row" key={entry.id}>
                      <div className="dil-versions__text">
                        <b>
                          v{entry.number}
                          {index === 0 && " · Current"}
                          {entry.version._status && (
                            <>
                              {" · "}
                              {entry.version._status === "published"
                                ? "Published"
                                : "Draft"}
                            </>
                          )}
                        </b>
                        <span>
                          {[date, author].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                      {entry.id === liveId && (
                        <span className="dil-versions__live">
                          <MaterialIcon name="public" />
                          Live
                        </span>
                      )}
                      {index !== 0 && (
                        <span className="dil-versions__actions">
                          <button
                            onClick={() => setComparing(entry)}
                            type="button"
                          >
                            Compare
                          </button>
                          {canRestore && (
                            <button
                              onClick={() => {
                                setRestoring(entry);
                                openModal(RESTORE_SLUG);
                              }}
                              type="button"
                            >
                              Restore…
                            </button>
                          )}
                        </span>
                      )}
                    </li>
                  );
                })}
                {entries.length === 1 && (
                  <li className="dil-drawer__empty">
                    Older versions appear here after the next save.
                  </li>
                )}
              </ul>
            )}
            {entries && comparing && current && (
              <VersionCompare
                current={current}
                fullHref={`${docPath}/versions/${comparing.id}`}
                older={comparing}
                onClose={() => setComparing(undefined)}
                onRestore={
                  canRestore
                    ? () => {
                        setRestoring(comparing);
                        openModal(RESTORE_SLUG);
                      }
                    : undefined
                }
                apiUrl={api}
                locales={locales}
                nameOf={nameOf}
                slug={collectionSlug ?? ""}
              />
            )}
            <a
              className="dil-drawer__native"
              data-dil-native=""
              href={`${docPath}/versions`}
            >
              Open the full version history
            </a>
          </aside>
        </Modal>
      )}
      {restoring && current && (
        <ConfirmDialog
          body={
            drafts ? (
              <p>
                This creates a new draft (v{current.number + 1}) from v
                {restoring.number}. Restoring never changes the live site;
                review the draft and publish it when it is ready.
              </p>
            ) : (
              <p>
                This saves v{restoring.number} as a new version (v
                {current.number + 1}) and updates{" "}
                {company?.domain ?? "the site"} within minutes. v
                {current.number} stays in history.
              </p>
            )
          }
          busyLabel="Restoring…"
          confirmLabel={drafts ? "Restore as new draft" : "Restore and go live"}
          icon="history"
          onConfirm={restore}
          slug={RESTORE_SLUG}
          title={`Restore ${name} v${restoring.number}?`}
          tone="go-live"
        />
      )}
    </>
  );
}

function VersionCompare({
  slug,
  older,
  current,
  fullHref,
  onClose,
  onRestore,
  apiUrl,
  locales,
  nameOf,
}: {
  apiUrl: (path: `/${string}`) => string;
  locales: string[];
  nameOf: (slug?: string) => string;
  slug: string;
  older: Entry;
  current: Entry;
  fullHref: string;
  onClose: () => void;
  onRestore?: () => void;
}) {
  const rows = compareLines(
    summarize(slug, older.version),
    summarize(slug, current.version),
  );
  const cell = (side?: { text: string; kind: ChangeKind }) =>
    side ? (
      <div className={`dil-compare__cell dil-compare__cell--${side.kind}`}>
        {side.kind !== "same" && (
          <>
            <MaterialIcon name={CHANGE_ICONS[side.kind]} />
            <span className="dil-sr-only">{CHANGE_LABELS[side.kind]}: </span>
          </>
        )}
        {side.text}
      </div>
    ) : (
      <div className="dil-compare__cell" />
    );

  return (
    <div className="dil-compare">
      <div className="dil-compare__grid" role="table">
        <div className="dil-compare__head" role="row">
          <span role="columnheader">
            v{older.number} · {shortDate(older.updatedAt)}
          </span>
          <span role="columnheader">v{current.number} · Current</span>
        </div>
        {rows.map((row, index) => (
          <div className="dil-compare__row" key={index} role="row">
            {cell(row.left)}
            {cell(row.right)}
          </div>
        ))}
      </div>
      {Array.isArray(current.version.layout) && (
        <SectionsCompare
          apiUrl={apiUrl}
          current={current}
          locales={locales}
          nameOf={nameOf}
          older={older}
          slug={slug}
        />
      )}
      <a className="dil-drawer__native" data-dil-native="" href={fullHref}>
        Full field-by-field comparison
      </a>
      <div className="dil-compare__foot">
        <ActionButton onClick={onClose} type="button" variant="secondary">
          Close
        </ActionButton>
        {onRestore && (
          <ActionButton onClick={onRestore} type="button">
            {current.version._status
              ? `Restore v${older.number} as new draft…`
              : `Restore v${older.number}…`}
          </ActionButton>
        )}
      </div>
    </div>
  );
}

function SectionsCompare({
  apiUrl,
  slug,
  older,
  current,
  locales,
  nameOf,
}: {
  apiUrl: (path: `/${string}`) => string;
  slug: string;
  older: Entry;
  current: Entry;
  locales: string[];
  nameOf: (slug?: string) => string;
}) {
  const [diffs, setDiffs] = useState<FieldDiff[]>();
  const summary = sectionsSummary(older.version, current.version, nameOf);
  const lines = [...summary.added, ...summary.removed, ...summary.moved];

  useEffect(() => {
    const request = new AbortController();
    const load = (id: number | string) =>
      fetch(apiUrl(`/${slug}/versions/${id}?locale=all&depth=0`), {
        credentials: "include",
        signal: request.signal,
      }).then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<VersionDoc>;
      });
    Promise.all([load(older.id), load(current.id)])
      .then(([before, after]) =>
        setDiffs(fieldDiffs(before.version, after.version, nameOf, locales)),
      )
      .catch(() => undefined);
    return () => request.abort();
  }, [apiUrl, current.id, locales, nameOf, older.id, slug]);

  return (
    <div className="dil-sections-compare">
      <h3>Sections</h3>
      {lines.length === 0 ? (
        <p>No sections added, removed or moved.</p>
      ) : (
        <ul>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <h3>Changed fields</h3>
      {!diffs && <p>Loading…</p>}
      {diffs?.length === 0 && <p>No field changes inside kept sections.</p>}
      {diffs && diffs.length > 0 && (
        <ul>
          {diffs.map((diff) => (
            <li key={diff.label}>
              <b>{diff.label}</b>
              <span>
                {diff.before} → {diff.after}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
