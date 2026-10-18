"use client";

import { useConfig, useModal, Modal } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useId, useRef, useState } from "react";

import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { ActionButton } from "../kit/ActionButton";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import {
  checkImageFile,
  type FileCheck,
  progressText,
  UPLOAD_LIMITS_TEXT,
} from "./uploadRules";
import { type UploadedMedia, uploadMedia } from "./uploadMedia";

export const UPLOAD_DIALOG_SLUG = "dil-upload-images";

type RowStatus = "ready" | "uploading" | "uploaded" | "failed";

type Row = {
  key: string;
  file: File;
  check: FileCheck;
  preview?: string;
  alt: string;
  touched: boolean;
  status: RowStatus;
  loaded: number;
};

function toRows(files: File[]): Row[] {
  return files.map((file, index) => {
    const check = checkImageFile(file);
    return {
      key: `${index}-${file.name}-${file.size}`,
      file,
      check,
      preview:
        check.ok && typeof URL.createObjectURL === "function"
          ? URL.createObjectURL(file)
          : undefined,
      alt: "",
      touched: false,
      status: "ready",
      loaded: 0,
    };
  });
}

export function UploadDialog({
  files,
  tenant,
  onUploaded,
  slug = UPLOAD_DIALOG_SLUG,
}: {
  slug?: string;
  files: File[];
  tenant: number | string | undefined;
  onUploaded?: (docs: UploadedMedia[]) => void;
}) {
  const { closeModal, isModalOpen } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const { company } = useUnsavedChangesGuard();
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const abort = useRef<AbortController>(undefined);
  const titleId = useId();
  const reasonId = useId();
  const open = isModalOpen(slug);

  useEffect(() => {
    const next = toRows(files);
    setRows(next);
    return () =>
      next.forEach(({ preview }) => preview && URL.revokeObjectURL(preview));
  }, [files]);

  const pending = rows.filter(
    (row) => row.check.ok && row.status !== "uploaded",
  );
  const missingAlt = pending.some((row) => row.alt.trim() === "");

  const update = (key: string, change: Partial<Row>) =>
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...change } : row)),
    );

  const close = () => {
    abort.current?.abort();
    setSaving(false);
    closeModal(slug);
  };

  const save = async () => {
    if (saving || missingAlt || pending.length === 0) return;
    setSaving(true);
    abort.current = new AbortController();
    const url = formatAdminURL({
      apiRoute: routes.api,
      serverURL,
      path: "/media",
    });
    const uploaded: UploadedMedia[] = [];
    let failed = 0;
    for (const row of pending) {
      update(row.key, { status: "uploading", loaded: 0 });
      try {
        const doc = await uploadMedia({
          url,
          file: row.file,
          data: { alt: row.alt.trim(), tenant },
          onProgress: (loaded) => update(row.key, { loaded }),
          signal: abort.current.signal,
        });
        uploaded.push(doc);
        update(row.key, { status: "uploaded", loaded: row.file.size });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        failed += 1;
        update(row.key, { status: "failed" });
      }
    }
    setSaving(false);
    if (failed > 0) return;
    const count = uploaded.length;
    notify({
      tone: "success",
      title: `${count} ${count === 1 ? "image" : "images"} uploaded.`,
      body: company?.domain
        ? `${count === 1 ? "It's" : "They're"} public on ${company.domain}.`
        : undefined,
    });
    onUploaded?.(uploaded);
    closeModal(slug);
  };

  if (!open) return null;

  const count = pending.length;

  return (
    <Modal className="dil-upload" closeOnBlur={false} slug={slug}>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="dil-upload__dialog"
        role="dialog"
      >
        <div className="dil-upload__head">
          <h2 className="dil-upload__title" id={titleId}>
            Upload images · {rows.length} {rows.length === 1 ? "file" : "files"}
          </h2>
          <button
            aria-label="Close"
            className="dil-upload__close"
            onClick={close}
            type="button"
          >
            <MaterialIcon name="close" />
          </button>
        </div>
        <p className="dil-upload__notice">
          <MaterialIcon name="public" />
          Every upload is public on {company?.domain ?? "the website"}.{" "}
          {UPLOAD_LIMITS_TEXT}
        </p>
        <ul className="dil-upload__rows">
          {rows.map((row) => (
            <UploadRow
              key={row.key}
              onAlt={(alt) => update(row.key, { alt })}
              onBlur={() => update(row.key, { touched: true })}
              onRemove={() =>
                setRows((current) =>
                  current.filter(({ key }) => key !== row.key),
                )
              }
              row={row}
              saving={saving}
            />
          ))}
        </ul>
        <div className="dil-upload__foot">
          <span className="dil-upload__hint">
            Thumbnail, card and social sizes are made automatically.
          </span>
          <span className="dil-sr-only" id={reasonId}>
            Add alt text to every image first.
          </span>
          <ActionButton onClick={close} type="button" variant="secondary">
            Cancel
          </ActionButton>
          <ActionButton
            busy={saving}
            onClick={() => void save()}
            type="button"
            unavailableReasonId={
              !saving && (missingAlt || count === 0) ? reasonId : undefined
            }
          >
            Save {count} {count === 1 ? "image" : "images"}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}

function UploadRow({
  row,
  saving,
  onAlt,
  onBlur,
  onRemove,
}: {
  row: Row;
  saving: boolean;
  onAlt: (alt: string) => void;
  onBlur: () => void;
  onRemove: () => void;
}) {
  const inputId = useId();
  const statusId = useId();

  if (!row.check.ok) {
    return (
      <li className="dil-upload__row dil-upload__row--rejected">
        <span className="dil-upload__thumb dil-upload__thumb--broken">
          <MaterialIcon name="broken_image" />
        </span>
        <div className="dil-upload__body">
          <span className="dil-upload__line">
            <b className="dil-upload__name">{row.file.name}</b>
            <button
              className="dil-upload__remove"
              onClick={onRemove}
              type="button"
            >
              Remove
            </button>
          </span>
          <span className="dil-upload__message" role="alert">
            {row.check.message}
          </span>
        </div>
      </li>
    );
  }

  const missing = row.alt.trim() === "";
  const showMissing = missing && (row.touched || row.status === "failed");

  return (
    <li className="dil-upload__row">
      {row.preview ? (
        <img alt="" className="dil-upload__thumb" src={row.preview} />
      ) : (
        <span className="dil-upload__thumb" />
      )}
      <div className="dil-upload__body">
        <span className="dil-upload__line">
          <b className="dil-upload__name">{row.file.name}</b>
          <span className="dil-upload__state" id={statusId}>
            {row.status === "uploaded" && (
              <span className="dil-upload__ok">
                <MaterialIcon name="check_circle" />
                Uploaded
              </span>
            )}
            {row.status === "uploading" &&
              progressText(row.loaded, row.file.size)}
            {row.status === "failed" && (
              <span className="dil-upload__error">
                <MaterialIcon name="error" />
                Couldn&apos;t upload. Try again.
              </span>
            )}
            {row.status === "ready" && showMissing && (
              <span className="dil-upload__error">
                <MaterialIcon name="error" />
                Alt text required
              </span>
            )}
          </span>
        </span>
        {row.status === "uploading" ? (
          <span
            aria-label={`Uploading ${row.file.name}`}
            aria-valuemax={row.file.size}
            aria-valuemin={0}
            aria-valuenow={row.loaded}
            className="dil-upload__progress"
            role="progressbar"
          >
            <span style={{ width: `${(row.loaded / row.file.size) * 100}%` }} />
          </span>
        ) : (
          <>
            <label className="dil-sr-only" htmlFor={inputId}>
              Alt text for {row.file.name}
            </label>
            <input
              aria-describedby={statusId}
              aria-invalid={showMissing || undefined}
              className={`dil-upload__alt${showMissing ? " dil-upload__alt--error" : ""}`}
              disabled={saving || row.status === "uploaded"}
              id={inputId}
              onBlur={onBlur}
              onChange={(event) => onAlt(event.target.value)}
              placeholder="Describe the image for people who can't see it"
              required
              value={row.alt}
            />
          </>
        )}
      </div>
    </li>
  );
}
