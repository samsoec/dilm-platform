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
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import { withAncestorCrumbs, type AncestorCrumb } from "./crumbs";
import {
  DOCUMENT_ACTIONS_ID,
  PREVIEW_UNAVAILABLE,
  PUBLISH_FOLLOW_UP,
  viewerNotice,
} from "./editor";
import { UrlChangeGuard } from "./UrlChangeGuard";
import { useEditorUrls, type UrlSeed } from "./useEditorUrls";

const PUBLISH_SLUG = "dil-editor-publish";
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
    setHasPublishedDoc,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
  } = useDocumentInfo();
  const { submit, validateForm } = useForm();
  const { openModal } = useModal();
  const { code: locale } = useLocale();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const { rows } = useEditorUrls(seed);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);

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
      return;
    }
    openModal(PUBLISH_SLUG);
  };

  const publish = async () => {
    const result = await submit({
      action,
      overrides: { _status: "published" },
      disableSuccessStatus: true,
    });
    if (!result?.res.ok) return;
    setHasPublishedDoc(true);
    setUnpublishedVersionCount(0);
    setMostRecentVersionIsAutosaved(false);
    notify({
      tone: "success",
      title: `Published "${name}".`,
      body: PUBLISH_FOLLOW_UP,
    });
    router.refresh();
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
      <ConfirmDialog
        body={
          <>
            <p>It goes live at</p>
            <ul className="dil-editor-publish__urls">
              {rows.map((row) => (
                <li key={row.locale}>
                  <code>{row.display}</code>
                </li>
              ))}
            </ul>
            <p>{PUBLISH_FOLLOW_UP}</p>
          </>
        }
        busyLabel="Publishing…"
        confirmLabel="Publish now"
        icon="public"
        onConfirm={async () => {
          setBusy(true);
          try {
            await publish();
          } finally {
            setBusy(false);
          }
        }}
        slug={PUBLISH_SLUG}
        title={`Publish "${name}"?`}
        tone="go-live"
      />
    </>
  );
}
