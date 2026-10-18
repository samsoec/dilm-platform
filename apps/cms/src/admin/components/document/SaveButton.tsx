"use client";

import {
  toast,
  useConfig,
  useDocumentInfo,
  useEditDepth,
  useForm,
  useFormModified,
  useHotkey,
  useLocale,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useState } from "react";

import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { ActionButton } from "../kit/ActionButton";
import { notify } from "../kit/Toast";
import { DOCUMENT_STATUS_ID } from "./DocumentStatus";
import {
  documentKey,
  type LiveCollection,
  markSaved,
  savedToast,
} from "./liveSave";

export function SaveButton() {
  const modified = useFormModified();
  const { getFields, setModified, submit, validateForm } = useForm();
  const { collectionSlug, hasSavePermission, id } = useDocumentInfo();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const { code: locale } = useLocale();
  const { company } = useUnsavedChangesGuard();
  const editDepth = useEditDepth();
  const [busy, setBusy] = useState(false);

  const versionCount = async (): Promise<number> => {
    const url = formatAdminURL({
      apiRoute: routes.api,
      serverURL,
      path: `/${collectionSlug}/versions?where[parent][equals]=${id}&limit=1&depth=0`,
    });
    const response = await fetch(url, { credentials: "include" });
    const body = (await response.json()) as { totalDocs?: number };
    return Math.max(body.totalDocs ?? 1, 1);
  };

  const save = async () => {
    if (busy || !modified) return;
    if (!(await validateForm())) {
      await submit();
      setModified(true);
      return;
    }
    setBusy(true);
    const result = await submit({ disableSuccessStatus: true });
    if (result && result.res.ok) {
      const version = await versionCount().catch(() => 1);
      markSaved(documentKey(collectionSlug, id), version);
      setBusy(false);
      const domain = company?.domain;
      notify({
        tone: "success",
        ...savedToast(collectionSlug as LiveCollection, version, domain),
        action: domain
          ? {
              label: "View site",
              onClick: () =>
                window.open(
                  `https://${domain}/${locale}/`,
                  "_blank",
                  "noopener",
                ),
            }
          : undefined,
      });
      return;
    }
    setBusy(false);
    setModified(true);
    const fieldErrors = Object.values(getFields()).some(
      (field) => field.valid === false,
    );
    if (fieldErrors) return;
    toast.dismiss();
    notify({
      tone: "error",
      title: "Couldn't save.",
      body: "Your changes are still here. Try again.",
      action: { label: "Retry", onClick: () => void save() },
    });
  };

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ["s"] }, (event) => {
    event.preventDefault();
    void save();
  });

  if (hasSavePermission === false) return null;

  if (!modified && !busy) {
    return (
      <ActionButton
        className="dil-save-button"
        type="button"
        unavailableReasonId={DOCUMENT_STATUS_ID}
        variant="secondary"
      >
        No changes
      </ActionButton>
    );
  }

  return (
    <ActionButton
      busy={busy}
      className="dil-save-button"
      icon="public"
      onClick={() => void save()}
      type="button"
    >
      Save &amp; publish
    </ActionButton>
  );
}
