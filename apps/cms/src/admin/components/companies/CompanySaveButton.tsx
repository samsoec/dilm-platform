"use client";

import { useDocumentDrawerContext, useForm, useModal } from "@payloadcms/ui";
import { useState } from "react";

import { ActionButton } from "../kit/ActionButton";

export function CompanySaveButton() {
  const { submit } = useForm();
  const { closeModal } = useModal();
  const { drawerSlug } = useDocumentDrawerContext() ?? {};
  const [busy, setBusy] = useState(false);

  return (
    <span className="dil-company-actions">
      {drawerSlug && (
        <ActionButton
          onClick={() => closeModal(drawerSlug)}
          type="button"
          variant="secondary"
        >
          Cancel
        </ActionButton>
      )}
      <ActionButton
        busy={busy}
        onClick={async () => {
          setBusy(true);
          await submit();
          setBusy(false);
        }}
        type="button"
      >
        Save company
      </ActionButton>
    </span>
  );
}
