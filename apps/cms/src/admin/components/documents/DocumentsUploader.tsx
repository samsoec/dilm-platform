"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useAuth, useConfig, useListDrawerContext } from "@payloadcms/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useCallback, useEffect, useRef, useState } from "react";

import { titleFromFilename } from "../ir/irEditor";
import { ActionButton } from "../kit/ActionButton";
import { MaterialIcon } from "../MaterialIcon";
import { TitleTag } from "../lists/TitleTag";
import { uploadMedia } from "../media/uploadMedia";
import {
  checkDocumentFile,
  DOCUMENT_LIMIT_TEXT,
  MEDIA_LIBRARY_LABEL,
  nextQueued,
  percentDone,
  stoppedText,
  uploadingText,
} from "./documents";

type Entry = {
  key: number;
  file: File;
  percent: number;
  state: "queued" | "uploading" | "stopped" | "rejected";
  message?: string;
  image?: boolean;
  abort?: AbortController;
};

function carriesFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

function DocumentsUploaderPanel() {
  const { permissions } = useAuth();
  const { selectedTenantID } = useTenantSelection();
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const input = useRef<HTMLInputElement>(null);
  const counter = useRef(0);
  const started = useRef(new Set<number>());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragging, setDragging] = useState(false);
  const canCreate = Boolean(permissions?.collections?.documents?.create);
  const needsCompany = selectedTenantID === undefined;

  const patch = useCallback(
    (key: number, change: Partial<Entry> | null) =>
      setEntries((list) =>
        change === null
          ? list.filter((entry) => entry.key !== key)
          : list.map((entry) =>
              entry.key === key ? { ...entry, ...change } : entry,
            ),
      ),
    [],
  );

  const send = useCallback(
    async (key: number, file: File) => {
      const abort = new AbortController();
      let last = 0;
      started.current.add(key);
      patch(key, { state: "uploading", percent: 0, abort, message: undefined });
      try {
        await uploadMedia({
          url: formatAdminURL({
            apiRoute: routes.api,
            serverURL,
            path: "/documents",
          }),
          file,
          data: {
            title: titleFromFilename(file.name),
            tenant: selectedTenantID,
          },
          signal: abort.signal,
          onProgress: (loaded, total) => {
            last = percentDone(loaded, total);
            patch(key, { percent: last });
          },
        });
        patch(key, null);
        router.refresh();
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          patch(key, null);
          return;
        }
        const message = (error as Error).message;
        const network = !message || message === "Upload failed";
        patch(key, {
          state: network ? "stopped" : "rejected",
          percent: last,
          message: network ? stoppedText(last) : message,
        });
      }
    },
    [patch, router, routes.api, selectedTenantID, serverURL],
  );

  const add = useCallback(
    (files: File[]) => {
      if (!canCreate || needsCompany) return;
      for (const file of files) {
        const key = ++counter.current;
        const check = checkDocumentFile(file);
        if (!check.ok) {
          setEntries((list) => [
            ...list,
            {
              key,
              file,
              percent: 0,
              state: "rejected",
              message: check.message,
              image: check.kind === "image",
            },
          ]);
          continue;
        }
        setEntries((list) => [
          ...list,
          { key, file, percent: 0, state: "queued" },
        ]);
      }
    },
    [canCreate, needsCompany],
  );

  useEffect(() => {
    for (const entry of nextQueued(entries)) {
      if (started.current.has(entry.key)) continue;
      started.current.add(entry.key);
      void send(entry.key, entry.file);
    }
  }, [entries, send]);

  useEffect(() => {
    if (!canCreate || needsCompany) return;
    let depth = 0;
    const enter = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      depth += 1;
      setDragging(true);
    };
    const over = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };
    const leave = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const drop = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      depth = 0;
      setDragging(false);
      add(Array.from(event.dataTransfer?.files ?? []));
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, [add, canCreate, needsCompany]);

  if (!canCreate) return null;

  return (
    <div className="dil-upload-docs">
      <TitleTag>
        <ActionButton
          className="dil-upload-pdf"
          icon="upload_file"
          onClick={() => input.current?.click()}
          type="button"
          unavailableReason={
            needsCompany ? "Pick a company in the sidebar first." : undefined
          }
        >
          Upload
        </ActionButton>
      </TitleTag>
      <input
        accept="application/pdf,.pdf,image/*"
        aria-label="Choose PDFs to upload"
        className="dil-sr-only"
        multiple
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? []);
          event.target.value = "";
          add(picked);
        }}
        ref={input}
        tabIndex={-1}
        type="file"
      />
      {dragging && (
        <div aria-live="polite" className="dil-doc-drop">
          <MaterialIcon name="upload_file" />
          Drop PDFs to upload · {DOCUMENT_LIMIT_TEXT}
        </div>
      )}
      {entries.length > 0 && (
        <ul aria-label="Uploads" className="dil-doc-uploads">
          {entries.map((entry) => (
            <li
              className={`dil-doc-upload dil-doc-upload--${entry.state}`}
              key={entry.key}
            >
              <MaterialIcon name="picture_as_pdf" />
              <div className="dil-doc-upload__text">
                <b>{entry.file.name}</b>
                {entry.state === "queued" ? (
                  <span>Waiting to upload</span>
                ) : entry.state === "uploading" ? (
                  <>
                    <span>{uploadingText(entry.percent)}</span>
                    <progress
                      aria-label={`Uploading ${entry.file.name}`}
                      max={100}
                      value={entry.percent}
                    />
                  </>
                ) : (
                  <span role="alert">
                    {entry.message}
                    {entry.image && (
                      <>
                        {" "}
                        <Link
                          href={formatAdminURL({
                            adminRoute: routes.admin,
                            path: "/collections/media",
                          })}
                        >
                          {MEDIA_LIBRARY_LABEL}
                        </Link>
                        .
                      </>
                    )}
                  </span>
                )}
              </div>
              {(entry.state === "uploading" || entry.state === "queued") && (
                <button
                  className="dil-ir-file__link"
                  onClick={() =>
                    entry.state === "queued"
                      ? patch(entry.key, null)
                      : entry.abort?.abort()
                  }
                  type="button"
                >
                  Cancel
                </button>
              )}
              {entry.state === "stopped" && (
                <button
                  className="dil-ir-file__link"
                  onClick={() => void send(entry.key, entry.file)}
                  type="button"
                >
                  Retry
                </button>
              )}
              {entry.state !== "uploading" && entry.state !== "queued" && (
                <button
                  aria-label={`Dismiss ${entry.file.name}`}
                  className="dil-ir-file__link"
                  onClick={() => patch(entry.key, null)}
                  type="button"
                >
                  Dismiss
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DocumentsUploader() {
  const { isInDrawer } = useListDrawerContext();
  return isInDrawer ? null : <DocumentsUploaderPanel />;
}

export function EmptyUploadDocuments() {
  const { permissions } = useAuth();
  if (!permissions?.collections?.documents?.create) return null;
  return (
    <ActionButton
      icon="upload_file"
      onClick={() =>
        document
          .querySelector<HTMLInputElement>(".dil-upload-docs input[type=file]")
          ?.click()
      }
      type="button"
    >
      Upload
    </ActionButton>
  );
}
