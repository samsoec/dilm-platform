"use client";

import { useConfig, useDocumentInfo, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import { replaceAllText } from "../kit/usedIn";
import { uploadMedia } from "../media/uploadMedia";
import {
  checkDocumentFile,
  percentDone,
  replaceConfirmBody,
  replaceConfirmTitle,
  stoppedText,
} from "./documents";

const SLUG = "dil-replace-pdf";

export function ReplacePdf({ count }: { count: number }) {
  const { id, hasSavePermission } = useDocumentInfo();
  const { openModal } = useModal();
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [percent, setPercent] = useState<number>();
  if (id === undefined || hasSavePermission === false) return null;

  const replace = async () => {
    if (!file) return;
    let last = 0;
    setPercent(0);
    try {
      await uploadMedia({
        method: "PATCH",
        url: formatAdminURL({
          apiRoute: routes.api,
          serverURL,
          path: `/documents/${id}`,
        }),
        file,
        data: {},
        onProgress: (loaded, total) => {
          last = percentDone(loaded, total);
          setPercent(last);
        },
      });
      notify({
        tone: "success",
        title: "PDF replaced",
        body:
          count > 0
            ? `${count} ${count === 1 ? "link now serves" : "links now serve"} the new file.`
            : undefined,
      });
      router.refresh();
    } catch (error) {
      const message = (error as Error).message;
      notify({
        tone: "error",
        title: "The PDF wasn't replaced",
        body:
          !message || message === "Upload failed" ? stoppedText(last) : message,
      });
    } finally {
      setPercent(undefined);
      setFile(undefined);
    }
  };

  return (
    <div className="dil-replace-pdf">
      <ActionButton
        busy={percent !== undefined}
        icon="swap_horiz"
        onClick={() => input.current?.click()}
        type="button"
        variant="secondary"
      >
        {count > 0 ? replaceAllText(count) : "Replace PDF"}
      </ActionButton>
      {percent !== undefined && (
        <progress aria-label="Replacing the PDF" max={100} value={percent} />
      )}
      <input
        accept="application/pdf,.pdf"
        aria-label="Choose the new PDF"
        className="dil-sr-only"
        onChange={(event) => {
          const picked = event.target.files?.[0];
          event.target.value = "";
          if (!picked) return;
          const check = checkDocumentFile(picked);
          if (!check.ok) {
            notify({
              tone: "error",
              title: "The PDF wasn't replaced",
              body: check.message,
            });
            return;
          }
          setFile(picked);
          openModal(SLUG);
        }}
        ref={input}
        tabIndex={-1}
        type="file"
      />
      <ConfirmDialog
        body={replaceConfirmBody(count, file?.name ?? "The new file")}
        confirmLabel="Replace PDF"
        busyLabel="Replacing…"
        onCancel={() => setFile(undefined)}
        onConfirm={replace}
        slug={SLUG}
        title={replaceConfirmTitle(count)}
        tone="discard"
      />
    </div>
  );
}
