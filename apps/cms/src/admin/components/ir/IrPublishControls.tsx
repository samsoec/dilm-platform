"use client";

import {
  SaveDraftButton,
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
  useLocale,
  useModal,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useState } from "react";

import { IR_LANGUAGE_LABELS } from "../../../irDocumentTypes";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import {
  companyInitials,
  disclosureText,
  investorURL,
  publishChecklist,
  PUBLISHED_NOTICE,
  REFRESH_DELAYED,
  UPDATED_NOTICE,
} from "./irEditor";

const PUBLISH_SLUG = "dil-ir-publish";

export const PURGE_STATUS_EVENT = "dil-ir-purge-status";

export async function purgeStatus(url: string): Promise<string | undefined> {
  const response = await fetch(url, { credentials: "include" }).catch(
    () => undefined,
  );
  if (!response?.ok) return undefined;
  const doc = (await response.json().catch(() => undefined)) as
    { lastPurgeStatus?: string } | undefined;
  return doc?.lastPurgeStatus ?? undefined;
}
const UNPUBLISH_SLUG = "dil-ir-unpublish";

export function IrSaveDraftButton() {
  const { hasPublishedDoc } = useDocumentInfo();
  return hasPublishedDoc ? null : <SaveDraftButton />;
}

export function NoUnpublishButton() {
  return null;
}

export function IrPublishControls() {
  const {
    id,
    collectionSlug,
    hasPublishedDoc,
    hasSavePermission,
    incrementVersionCount,
    setHasPublishedDoc,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
  } = useDocumentInfo();
  const { getData, reset: resetForm, submit, validateForm } = useForm();
  const { openModal } = useModal();
  const { code: locale } = useLocale();
  const { company } = useUnsavedChangesGuard();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [busy, setBusy] = useState(false);
  const [title, language, publishedDate] = useFormFields(([fields]) => [
    fields.title?.value,
    fields.locale?.value,
    fields.publishedDate?.value,
  ]);
  if (hasSavePermission === false) return null;

  const name = typeof title === "string" && title ? title : "this document";
  const action = formatAdminURL({
    apiRoute: routes.api,
    serverURL,
    path: `/${collectionSlug}${id === undefined ? "" : `/${id}`}?depth=0&locale=${locale}`,
  });

  const statusURL = (fallback: string) =>
    id === undefined
      ? fallback
      : formatAdminURL({
          apiRoute: routes.api,
          serverURL,
          path: `/${collectionSlug}/${id}?depth=0`,
        });

  const publish = async (updating: boolean) => {
    const result = await submit({
      action,
      overrides: { _status: "published" },
      disableSuccessStatus: true,
    });
    if (!result?.res.ok) return;
    setHasPublishedDoc(true);
    setUnpublishedVersionCount(0);
    setMostRecentVersionIsAutosaved(false);
    const status = await purgeStatus(statusURL(result.res.url));
    window.dispatchEvent(
      new CustomEvent(PURGE_STATUS_EVENT, { detail: status }),
    );
    if (status === "failed") {
      notify({ tone: "info", icon: "sync_problem", ...REFRESH_DELAYED });
      return;
    }
    notify({
      tone: "success",
      ...(updating ? UPDATED_NOTICE : PUBLISHED_NOTICE),
    });
  };

  const startPublish = async () => {
    if (busy) return;
    const ready = publishChecklist(getData() as Record<string, unknown>).every(
      ({ done }) => done,
    );
    if (!ready || !(await validateForm())) {
      await submit({ action, overrides: { _status: "published" } });
      return;
    }
    openModal(PUBLISH_SLUG);
  };

  const saveAndUpdate = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await publish(true);
    } finally {
      setBusy(false);
    }
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
    await resetForm({ ...(getData() as object), _status: "draft" });
    incrementVersionCount();
    setUnpublishedVersionCount(1);
    setMostRecentVersionIsAutosaved(false);
    setHasPublishedDoc(false);
    notify({
      tone: "success",
      title: `Unpublished "${name}".`,
      body: `It's a draft again and leaves the ${companyInitials(company?.name)} Investor page within minutes.`,
    });
  };

  return (
    <>
      {hasPublishedDoc ? (
        <>
          <ActionButton
            className="dil-ir-unpublish"
            onClick={() => openModal(UNPUBLISH_SLUG)}
            type="button"
            variant="secondary"
          >
            Unpublish…
          </ActionButton>
          <ActionButton
            busy={busy}
            icon="public"
            id="action-save"
            onClick={() => void saveAndUpdate()}
            type="button"
          >
            Save &amp; update site
          </ActionButton>
        </>
      ) : (
        <ActionButton
          icon="public"
          id="action-save"
          onClick={() => void startPublish()}
          type="button"
        >
          Publish…
        </ActionButton>
      )}
      <ConfirmDialog
        body={
          <>
            <dl className="dil-ir-publish__facts">
              <dt>Company</dt>
              <dd>{company?.name ?? "—"}</dd>
              <dt>Language</dt>
              <dd>
                {typeof language === "string"
                  ? (IR_LANGUAGE_LABELS[language] ?? language)
                  : "—"}
              </dd>
              <dt>Disclosure</dt>
              <dd>{disclosureText(publishedDate)}</dd>
            </dl>
            <p>
              It becomes public on {investorURL(company?.domain, language)}{" "}
              within minutes. After publishing, the PDF can&apos;t be replaced.
            </p>
          </>
        }
        busyLabel="Publishing…"
        cancelLabel="Cancel"
        confirmLabel="Publish now"
        icon="public"
        onConfirm={() => publish(false)}
        slug={PUBLISH_SLUG}
        title={`Publish "${name}"?`}
        tone="go-live"
      />
      <ConfirmDialog
        body={`It returns to Draft and leaves the ${companyInitials(company?.name)} Investor page within minutes.`}
        confirmLabel="Unpublish"
        icon="unpublished"
        onConfirm={unpublish}
        slug={UNPUBLISH_SLUG}
        title={`Unpublish "${name}"?`}
        tone="go-live"
      />
    </>
  );
}
