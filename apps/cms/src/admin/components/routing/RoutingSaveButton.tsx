"use client";

import { useDocumentInfo, useForm, useFormModified } from "@payloadcms/ui";
import { useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { notify } from "../kit/Toast";
import { useRoutingGate } from "./useRoutingGate";

export function RoutingSaveButton() {
  const modified = useFormModified();
  const { submit, validateForm } = useForm();
  const { globalSlug, hasSavePermission } = useDocumentInfo();
  const { confirm, dialog } = useRoutingGate(globalSlug);
  const [busy, setBusy] = useState(false);

  if (hasSavePermission === false) return null;

  const save = async () => {
    if (busy || !modified) return;
    if (!(await validateForm())) {
      await submit();
      return;
    }
    setBusy(true);
    if (!(await confirm())) {
      setBusy(false);
      return;
    }
    const result = await submit({ disableSuccessStatus: true });
    setBusy(false);
    if (result && result.res.ok) {
      notify({
        tone: "success",
        title: "Site routing saved.",
        body: "Moved URLs now redirect to their new address.",
      });
    }
  };

  return (
    <>
      <ActionButton
        busy={busy}
        className="dil-save-button"
        onClick={() => void save()}
        type="button"
        variant={modified ? "primary" : "secondary"}
      >
        {modified ? "Save routing" : "No changes"}
      </ActionButton>
      {dialog}
    </>
  );
}
