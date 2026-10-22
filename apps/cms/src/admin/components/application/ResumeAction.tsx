"use client";

import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { RESUME_BUSY, resumeFailure } from "./application";

export function ResumeAction({
  id,
  retentionMonths,
}: {
  id: number | string;
  retentionMonths: number;
}) {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string>();

  async function open() {
    if (busy) return;
    setBusy(true);
    setFailure(undefined);
    try {
      const response = await fetch(
        formatAdminURL({
          apiRoute: routes.api,
          serverURL,
          path: `/cv-submissions/${id}/resume`,
        }),
        { credentials: "include", cache: "no-store" },
      ).catch(() => undefined);
      const body = response?.ok
        ? ((await response.json().catch(() => undefined)) as
            { url?: string } | undefined)
        : undefined;
      if (!body?.url) {
        setFailure(resumeFailure(response?.status, retentionMonths));
        return;
      }
      const link = document.createElement("a");
      link.href = body.url;
      link.rel = "noopener";
      link.download = "";
      link.click();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ActionButton
        busy={busy}
        icon="picture_as_pdf"
        onClick={open}
        type="button"
        variant="secondary"
      >
        {busy ? RESUME_BUSY : "View résumé"}
      </ActionButton>
      <span>Private file · each open is logged</span>
      {failure && (
        <span className="dil-app-card__resume-error" role="alert">
          {failure}
        </span>
      )}
    </>
  );
}
