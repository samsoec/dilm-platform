"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import {
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
  useFormModified,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { type DragEvent, useEffect, useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { MaterialIcon } from "../MaterialIcon";
import { uploadMedia } from "../media/uploadMedia";
import {
  checkPdf,
  fileMetaText,
  IR_FILE_LIMIT_TEXT,
  type PdfCheck,
  progressText,
  REPLACE_NOTE,
  titleFromFilename,
} from "./irEditor";

type Upload = {
  name: string;
  loaded: number;
  total: number;
  abort: AbortController;
};

type Rejection = Extract<PdfCheck, { ok: false }>;

const DETAIL_PATHS = ["title", "documentType", "publishedDate", "locale"];

function useUploaderName(id: unknown): string | undefined {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [name, setName] = useState<string>();
  useEffect(() => {
    const userId =
      id && typeof id === "object" ? (id as { id?: unknown }).id : id;
    if (typeof userId !== "number" && typeof userId !== "string") {
      setName(undefined);
      return;
    }
    const request = new AbortController();
    fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/users/${userId}?depth=0`,
      }),
      { credentials: "include", signal: request.signal },
    )
      .then((response) => (response.ok ? response.json() : undefined))
      .then((user?: { name?: string }) => setName(user?.name || undefined))
      .catch(() => undefined);
    return () => request.abort();
  }, [id, routes.api, serverURL]);
  return name;
}

export function IrFilePanel() {
  const { id, collectionSlug, hasSavePermission } = useDocumentInfo();
  const { selectedTenantID } = useTenantSelection();
  const { getData } = useForm();
  const modified = useFormModified();
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const input = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<Upload>();
  const [rejection, setRejection] = useState<Rejection>();
  const [failure, setFailure] = useState<string>();
  const [over, setOver] = useState(false);
  const [filename, filesize, url, createdAt, firstPublishedAt, uploadedBy] =
    useFormFields(([fields]) => [
      fields.filename?.value,
      fields.filesize?.value,
      fields.url?.value,
      fields.createdAt?.value,
      fields.firstPublishedAt?.value,
      fields.uploadedBy?.value,
    ]);
  const uploader = useUploaderName(uploadedBy);
  const hasFile = typeof filename === "string" && filename !== "";
  const locked = Boolean(firstPublishedAt);
  const canEdit = hasSavePermission !== false;

  const details = (): Record<string, unknown> => {
    const data = getData() as Record<string, unknown>;
    return Object.fromEntries(
      DETAIL_PATHS.filter((path) => {
        const value = data[path];
        return value !== undefined && value !== null && value !== "";
      }).map((path) => [path, data[path]]),
    );
  };

  const send = async (file: File) => {
    setRejection(undefined);
    setFailure(undefined);
    const check = checkPdf(file);
    if (!check.ok) {
      setRejection(check);
      return;
    }
    if (id === undefined && selectedTenantID === undefined) {
      setFailure("Pick a company in the sidebar first.");
      return;
    }
    const abort = new AbortController();
    setUpload({ name: file.name, loaded: 0, total: file.size, abort });
    const data = details();
    try {
      const saved = await uploadMedia({
        url: formatAdminURL({
          apiRoute: routes.api,
          serverURL,
          path:
            id === undefined
              ? `/${collectionSlug}?draft=true`
              : `/${collectionSlug}/${id}?draft=true`,
        }),
        method: id === undefined ? "POST" : "PATCH",
        file,
        data:
          id === undefined
            ? {
                title: titleFromFilename(file.name),
                ...data,
                tenant: selectedTenantID,
                _status: "draft",
              }
            : { ...data, _status: "draft" },
        signal: abort.signal,
        onProgress: (loaded, total) =>
          setUpload((current) => current && { ...current, loaded, total }),
      });
      setUpload(undefined);
      if (id === undefined) {
        router.push(
          formatAdminURL({
            adminRoute: routes.admin,
            path: `/collections/${collectionSlug}/${saved.id}`,
          }),
        );
      } else {
        router.refresh();
      }
    } catch (error) {
      setUpload(undefined);
      if ((error as Error).name !== "AbortError") {
        setFailure((error as Error).message || "The upload failed. Try again.");
      }
    }
  };

  const pick = (files: FileList | null | undefined) => {
    const file = files?.[0];
    if (file) void send(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOver(false);
    if (upload || !canEdit) return;
    pick(event.dataTransfer.files);
  };

  const chooser = (
    <input
      accept="application/pdf,.pdf"
      className="dil-sr-only"
      onChange={(event) => {
        pick(event.target.files);
        event.target.value = "";
      }}
      ref={input}
      tabIndex={-1}
      type="file"
    />
  );

  return (
    <section
      aria-labelledby="dil-ir-file-title"
      className="dil-ir-panel dil-ir-file"
    >
      <header className="dil-ir-panel__head">
        <h2 className="dil-ir-panel__title" id="dil-ir-file-title">
          File
        </h2>
        <span className="dil-ir-panel__aside">{IR_FILE_LIMIT_TEXT}</span>
      </header>
      <div className="dil-ir-panel__body">
        {upload ? (
          <div className="dil-ir-file__progress">
            <MaterialIcon className="dil-ir-file__icon" name="picture_as_pdf" />
            <div className="dil-ir-file__text">
              <span className="dil-ir-file__line">
                <b>{upload.name}</b>
                <span>{progressText(upload.loaded, upload.total)}</span>
              </span>
              <progress
                aria-label={`Uploading ${upload.name}`}
                max={upload.total || 1}
                value={upload.loaded}
              />
            </div>
            <button
              className="dil-ir-file__link"
              onClick={() => upload.abort.abort()}
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : hasFile ? (
          <>
            <div className="dil-ir-file__current">
              <MaterialIcon
                className="dil-ir-file__icon"
                name="picture_as_pdf"
              />
              <div className="dil-ir-file__text">
                <b>{filename}</b>
                <span className="dil-ir-file__meta">
                  {fileMetaText({ filesize, uploadedAt: createdAt, uploader })}
                </span>
              </div>
              {typeof url === "string" && (
                <ActionButton
                  el="anchor"
                  icon="visibility"
                  newTab
                  url={url}
                  variant="secondary"
                >
                  Preview
                </ActionButton>
              )}
              {canEdit && !locked && (
                <ActionButton
                  icon="swap_horiz"
                  onClick={() => input.current?.click()}
                  type="button"
                  unavailableReason={
                    modified ? "Save the draft first." : undefined
                  }
                  variant="secondary"
                >
                  Replace PDF
                </ActionButton>
              )}
            </div>
            {!locked && <p className="dil-ir-file__note">{REPLACE_NOTE}</p>}
          </>
        ) : (
          <div
            className={`dil-ir-file__drop${over ? " dil-ir-file__drop--over" : ""}`}
            onDragLeave={() => setOver(false)}
            onDragOver={(event) => {
              event.preventDefault();
              if (canEdit) setOver(true);
            }}
            onDrop={onDrop}
          >
            <MaterialIcon name="upload_file" />
            <p>
              {canEdit ? (
                <>
                  <button
                    className="dil-ir-file__link"
                    onClick={() => input.current?.click()}
                    type="button"
                  >
                    Choose a PDF
                  </button>{" "}
                  or drop it here
                </>
              ) : (
                "No PDF yet."
              )}
            </p>
            <span>{IR_FILE_LIMIT_TEXT}</span>
          </div>
        )}
        {rejection && (
          <div className="dil-ir-file__error" role="alert">
            <MaterialIcon name="error" />
            <div className="dil-ir-file__text">
              <b>{rejection.title}</b>
              <span>{rejection.hint}</span>
            </div>
            <button
              className="dil-ir-file__link"
              onClick={() => input.current?.click()}
              type="button"
            >
              {rejection.retry ?? "Choose another"}
            </button>
          </div>
        )}
        {failure && (
          <div className="dil-ir-file__error" role="alert">
            <MaterialIcon name="error" />
            <div className="dil-ir-file__text">
              <b>The upload didn't finish.</b>
              <span>{failure}</span>
            </div>
          </div>
        )}
        {chooser}
      </div>
    </section>
  );
}
