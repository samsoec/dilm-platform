"use client";

import {
  SaveDraftButton,
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
  useLocale,
  useModal,
  useStepNav,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { VersionsDrawer } from "../document/VersionsDrawer";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { notify } from "../kit/Toast";
import { PURGE_NOTICE, refreshingSites } from "../../../publish/confirmations";
import { refreshStatusOf } from "../publish/refreshStatus";
import {
  PublishConfirm,
  TrashConfirm,
  UnpublishConfirm,
  ValidationSummary,
} from "../publish/PublishConfirmations";
import {
  fieldProblems,
  type FieldProblem,
  type Impact,
} from "../../../publish/confirmations";
import { withAncestorCrumbs, type AncestorCrumb } from "./crumbs";
import {
  DOCUMENT_ACTIONS_ID,
  PREVIEW_UNAVAILABLE,
  PUBLISH_FOLLOW_UP,
  viewerNotice,
} from "./editor";
import { UrlChangeGuard } from "./UrlChangeGuard";
import type { UrlSeed } from "./useEditorUrls";

const PUBLISH_SLUG = "dil-editor-publish";
const UNPUBLISH_SLUG = "dil-editor-unpublish";
const TRASH_SLUG = "dil-editor-trash";
const PREVIEW_REASON_ID = "dil-editor-preview-reason";

export function NoControl() {
  return null;
}

export function EditorCrumbs({
  ancestors,
}: {
  ancestors: { id: string; title: string }[];
}) {
  const { stepNav, setStepNav } = useStepNav();
  const {
    config: { routes },
  } = useConfig();
  const { collectionSlug } = useDocumentInfo();
  const crumbs: AncestorCrumb[] = useMemo(
    () =>
      ancestors.map(({ id, title }) => ({
        label: title,
        url: formatAdminURL({
          adminRoute: routes.admin,
          path: `/collections/${collectionSlug}/${id}`,
        }),
      })),
    [ancestors, collectionSlug, routes.admin],
  );
  useEffect(() => {
    const next = withAncestorCrumbs(stepNav, crumbs);
    if (next !== stepNav) setStepNav(next);
  }, [crumbs, setStepNav, stepNav]);
  return null;
}

export function ReadOnlyNotice({ initials }: { initials: string }) {
  const { hasSavePermission } = useDocumentInfo();
  if (hasSavePermission !== false) return null;
  return (
    <Banner className="dil-editor-readonly" tone="readonly">
      {viewerNotice(initials)}
    </Banner>
  );
}

export function EditorActions({
  seed,
  ancestors,
  initials,
}: {
  seed: UrlSeed;
  ancestors: { id: string; title: string }[];
  initials: string;
}) {
  const router = useRouter();
  const {
    id,
    collectionSlug,
    hasSavePermission,
    hasPublishedDoc,
    setHasPublishedDoc,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
  } = useDocumentInfo();
  const { getFields, getData, reset, submit, validateForm } = useForm();
  const { openModal } = useModal();
  const { code: locale } = useLocale();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<FieldProblem[]>([]);

  useEffect(() => {
    setHost(document.getElementById(DOCUMENT_ACTIONS_ID));
  }, []);

  const name = title?.trim() ? title.trim() : "this page";
  const action = formatAdminURL({
    apiRoute: routes.api,
    serverURL,
    path: `/${collectionSlug}${id === undefined ? "" : `/${id}`}?depth=0&locale=${locale}`,
  });
  const canEdit = hasSavePermission !== false;

  const startPublish = async () => {
    if (busy) return;
    if (!(await validateForm())) {
      await submit({ action, overrides: { _status: "published" } });
      setProblems(
        fieldProblems(
          getFields() as Record<
            string,
            { valid?: boolean; errorMessage?: string }
          >,
        ),
      );
      return;
    }
    setProblems([]);
    openModal(PUBLISH_SLUG);
  };

  const publish = async (impactNow?: Impact) => {
    const result = await submit({
      action,
      overrides: { _status: "published" },
      disableSuccessStatus: true,
    });
    if (!result?.res.ok) return;
    setHasPublishedDoc(true);
    setUnpublishedVersionCount(0);
    setMostRecentVersionIsAutosaved(false);
    const status = await refreshStatusOf(
      routes.api,
      serverURL,
      collectionSlug,
      id,
    );
    if (status === "failed") {
      notify({ tone: "info", icon: "sync_problem", ...PURGE_NOTICE });
    } else {
      notify({
        tone: "success",
        title: `Published "${name}".`,
        body: refreshingSites(impactNow) ?? PUBLISH_FOLLOW_UP,
      });
    }
    router.refresh();
  };

  const unpublish = async () => {
    const response = await fetch(action, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _status: "draft" }),
    }).catch(() => undefined);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't unpublish "${name}".`,
        body: "Try again.",
      });
      return;
    }
    await reset({ ...(getData() as object), _status: "draft" });
    setHasPublishedDoc(false);
    setUnpublishedVersionCount(1);
    notify({ tone: "success", title: `Unpublished "${name}".` });
    router.refresh();
  };

  const trash = async () => {
    const response = await fetch(action, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deletedAt: new Date().toISOString() }),
    }).catch(() => undefined);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't move "${name}" to the trash.`,
        body: "Try again.",
      });
      return;
    }
    notify({ tone: "success", title: `Moved "${name}" to the trash.` });
    router.push(
      formatAdminURL({
        adminRoute: routes.admin,
        path: `/collections/${collectionSlug}`,
      }),
    );
  };

  const controls = (
    <>
      <ActionButton
        className="dil-editor-preview"
        icon="visibility"
        type="button"
        unavailableReasonId={PREVIEW_REASON_ID}
        variant="secondary"
      >
        Preview
        <span className="dil-editor-soon">Soon</span>
      </ActionButton>
      <span className="dil-sr-only" id={PREVIEW_REASON_ID}>
        {PREVIEW_UNAVAILABLE}
      </span>
      {canEdit && (
        <>
          <SaveDraftButton />
          {hasPublishedDoc && (
            <ActionButton
              onClick={() => openModal(UNPUBLISH_SLUG)}
              type="button"
              variant="secondary"
            >
              Unpublish…
            </ActionButton>
          )}
          {id !== undefined && (
            <ActionButton
              onClick={() => openModal(TRASH_SLUG)}
              type="button"
              variant="secondary"
            >
              Move to trash…
            </ActionButton>
          )}
          <ActionButton
            busy={busy}
            icon="public"
            onClick={() => void startPublish()}
            type="button"
          >
            Publish…
          </ActionButton>
        </>
      )}
    </>
  );

  return (
    <>
      <EditorCrumbs ancestors={ancestors} />
      <ReadOnlyNotice initials={initials} />
      <VersionsDrawer />
      <UrlChangeGuard domain={seed.domain} />
      {host && createPortal(controls, host)}
      <ValidationSummary problems={problems} />
      <PublishConfirm
        collection={collectionSlug}
        id={id}
        name={name}
        onConfirm={async (impact) => {
          setBusy(true);
          try {
            await publish(impact);
          } finally {
            setBusy(false);
          }
        }}
        slug={PUBLISH_SLUG}
      />
      <UnpublishConfirm
        collection={collectionSlug}
        id={id}
        name={name}
        onConfirm={unpublish}
        slug={UNPUBLISH_SLUG}
      />
      <TrashConfirm
        collection={collectionSlug}
        id={id}
        messagesHref={formatAdminURL({
          adminRoute: routes.admin,
          path: "/globals/site-messages",
        })}
        name={name}
        onConfirm={trash}
        settingsHref={formatAdminURL({
          adminRoute: routes.admin,
          path: "/globals/tenant-settings",
        })}
        slug={TRASH_SLUG}
      />
    </>
  );
}
