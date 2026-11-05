"use client";

import {
  useConfig,
  useDocumentInfo,
  useFormFields,
  useModal,
} from "@payloadcms/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";

import { VERSIONS_DRAWER_SLUG } from "../document/VersionsDrawer";
import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import { ReachBadge } from "../kit/ReachBadge";
import type { PublishStatus } from "../kit/publication";
import { ALL_SITES_COUNT, getReach } from "../kit/reach";
import { MaterialIcon } from "../MaterialIcon";
import { failure } from "../pages/requests";
import {
  LINKS_NOTE,
  placement,
  publishingLines,
  trashBody,
  translationLine,
  type LinkEntry,
} from "./editor";
import { useLiveStatus } from "./EditorHeader";

const UNPUBLISH_SLUG = "dil-editor-unpublish";
const TRASH_SLUG = "dil-editor-trash";

export type SidebarProps = {
  collection: string;
  status: PublishStatus;
  tenant: { id: number | string; domain?: string } | null;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  versions: number;
  inMenu: boolean;
  links: LinkEntry[];
  translation: { translated: number; total: number };
  childCount: number;
  languageName: string;
  otherLanguage: { code: string; label: string } | null;
};

function Panel({
  id,
  title,
  aside,
  children,
}: {
  id: string;
  title: string;
  aside?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="dil-editor-panel">
      <h2 className="dil-editor-panel__title" id={id}>
        {title}
        {aside && <span className="dil-editor-panel__aside"> · {aside}</span>}
      </h2>
      {children}
    </section>
  );
}

export function EditorSidebar(props: SidebarProps) {
  const router = useRouter();
  const status = useLiveStatus(props.status);
  const {
    id,
    collectionSlug,
    hasPublishedDoc,
    hasSavePermission,
    setHasPublishedDoc,
    setUnpublishedVersionCount,
  } = useDocumentInfo();
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const forwards = useFormFields(([fields]) => Boolean(fields.forwards?.value));

  if (id === undefined) {
    return (
      <aside aria-label="Page details" className="dil-editor-sidebar">
        <Panel id="dil-panel-publishing" title="Publishing">
          <p className="dil-editor-panel__note">
            Nothing is saved yet. Save a draft to start the history, or publish
            to put the page on the website.
          </p>
        </Panel>
      </aside>
    );
  }

  const name = title?.trim() ? title.trim() : "this page";
  const canEdit = hasSavePermission !== false;
  const reach = getReach(
    { tenant: props.tenant?.id ?? null },
    {
      collection: props.collection,
      tenants: props.tenant
        ? [{ id: props.tenant.id, domain: props.tenant.domain }]
        : [],
    },
  );
  const lines = publishingLines({
    status,
    liveSince: props.liveSince,
    savedAt: props.savedAt,
    savedBy: props.savedBy,
  });
  const where = placement({ inMenu: props.inMenu, forwards });
  const translation = translationLine(props.translation);
  const live = status === "published" || status === "changed";
  const site =
    reach.scope === "all" ? `all ${ALL_SITES_COUNT} websites` : "the website";
  const api = (trashed = false) =>
    formatAdminURL({
      apiRoute: routes.api,
      serverURL,
      path: `/${collectionSlug}/${id}${trashed ? "?trash=true" : ""}`,
    });
  const patch = (body: object, trashed = false) =>
    fetch(api(trashed), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  const list = formatAdminURL({
    adminRoute: routes.admin,
    path: `/collections/${collectionSlug}`,
  });

  const unpublish = async () => {
    const response = await patch({ _status: "draft" });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't unpublish "${name}".`,
        body: await failure(response),
      });
      return;
    }
    setHasPublishedDoc(false);
    setUnpublishedVersionCount(0);
    router.refresh();
    notify({
      tone: "success",
      title: `Unpublished "${name}".`,
      body: "It's a Draft again and leaves the website within minutes.",
    });
  };

  const trash = async () => {
    const response = await patch({ deletedAt: new Date().toISOString() });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't move "${name}" to trash.`,
        body: await failure(response),
      });
      return;
    }
    router.push(list);
    notify({
      tone: "undo",
      title: `Moved "${name}" to trash.`,
      body: "You can restore it from Trash.",
      action: {
        label: "Undo",
        onClick: async () => {
          const undone = await patch(
            { deletedAt: null, _status: "draft" },
            true,
          );
          if (!undone?.ok) {
            notify({
              tone: "error",
              title: `Couldn't restore "${name}".`,
              body: await failure(undone),
            });
            return;
          }
          router.refresh();
          notify({
            tone: "success",
            title: `Restored "${name}".`,
            body: "It's back as a Draft.",
          });
        },
      },
    });
  };

  return (
    <aside aria-label="Page details" className="dil-editor-sidebar">
      <Panel id="dil-panel-publishing" title="Publishing">
        <p
          className={`dil-editor-fact ${live ? "dil-editor-fact--ok" : "dil-editor-fact--muted"}`}
        >
          <MaterialIcon name={live ? "check_circle" : "schedule"} />
          {lines.live}
        </p>
        <p className={`dil-editor-fact dil-editor-fact--${lines.state.tone}`}>
          <MaterialIcon
            name={
              lines.state.tone === "changed"
                ? "edit_note"
                : lines.state.tone === "ok"
                  ? "task_alt"
                  : "edit_note"
            }
          />
          {lines.state.text}
        </p>
        {lines.saved && <p className="dil-editor-panel__note">{lines.saved}</p>}
      </Panel>

      <Panel id="dil-panel-where" title="Where it appears">
        <ReachBadge reach={reach} />
        <p className="dil-editor-panel__note">
          {reach.scope === "tenant"
            ? "Other companies each have their own pages."
            : `Shown on all ${ALL_SITES_COUNT} websites.`}{" "}
          {where.text}
        </p>
      </Panel>

      <Panel
        aside={String(props.links.length)}
        id="dil-panel-links"
        title="Links to this page"
      >
        {props.links.length > 0 ? (
          <ul className="dil-editor-links">
            {props.links.map((link) => (
              <li key={link.key}>
                <Link
                  href={formatAdminURL({
                    adminRoute: routes.admin,
                    path: `/collections/${link.collection}/${link.id}`,
                  })}
                  prefetch={false}
                >
                  <MaterialIcon
                    name={
                      link.kind === "forward"
                        ? "subdirectory_arrow_right"
                        : "link"
                    }
                  />
                  <span>
                    {link.title}
                    <span className="dil-editor-links__note"> {link.note}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dil-editor-panel__note">
            Nothing links to this page yet.
          </p>
        )}
        <p className="dil-editor-panel__note">{LINKS_NOTE}</p>
      </Panel>

      <Panel id="dil-panel-translation" title="Translation">
        <div
          aria-label={translation.text}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={translation.percent}
          className="dil-editor-progress"
          role="progressbar"
        >
          <span style={{ width: `${translation.percent}%` }} />
        </div>
        <p className="dil-editor-panel__note">{translation.text}</p>
        {props.otherLanguage && (
          <p className="dil-editor-panel__note">
            <Link href={`?locale=${props.otherLanguage.code}`} prefetch={false}>
              Edit the {props.otherLanguage.label} text
            </Link>
          </p>
        )}
      </Panel>

      <section
        aria-label="Version"
        className="dil-editor-panel dil-editor-foot"
      >
        <p className="dil-editor-foot__version">
          <MaterialIcon name="history" />
          Version {props.versions}
        </p>
        <div className="dil-editor-foot__actions">
          <ActionButton
            icon="history"
            onClick={() => openModal(VERSIONS_DRAWER_SLUG)}
            type="button"
            variant="secondary"
          >
            History
          </ActionButton>
          {canEdit && (
            <>
              <ActionButton
                icon="unpublished"
                onClick={() => openModal(UNPUBLISH_SLUG)}
                type="button"
                unavailableReason={
                  hasPublishedDoc ? undefined : "It isn't published."
                }
                variant="secondary"
              >
                Unpublish…
              </ActionButton>
              <ActionButton
                icon="delete"
                onClick={() => openModal(TRASH_SLUG)}
                type="button"
                variant="text"
              >
                Move to trash…
              </ActionButton>
            </>
          )}
        </div>
      </section>

      <ConfirmDialog
        body={`It goes back to Draft and leaves ${site} within minutes.`}
        confirmLabel="Unpublish"
        icon="unpublished"
        onConfirm={unpublish}
        slug={UNPUBLISH_SLUG}
        title={`Unpublish "${name}"?`}
        tone="go-live"
      />
      <ConfirmDialog
        body={trashBody({ live, children: props.childCount, where: site })}
        confirmLabel="Move to trash"
        onConfirm={trash}
        slug={TRASH_SLUG}
        title={`Move "${name}" to trash?`}
        tone="delete"
      />
    </aside>
  );
}
