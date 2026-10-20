"use client";

import { Modal, useAuth, useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useEffect, useId, useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import {
  hasAlt,
  type MediaDoc,
  type MediaUse,
  originalText,
  previewURL,
  sizesText,
  uploadedText,
  usageQuery,
  usedAsText,
  usesOf,
} from "./media";

export const MEDIA_DRAWER_SLUG = "dil-media-detail";
const TRASH_SLUG = `${MEDIA_DRAWER_SLUG}-trash`;

export function MediaDrawer({
  doc: listed,
  onClosed,
}: {
  doc: MediaDoc;
  onClosed: () => void;
}) {
  const { isModalOpen } = useModal();
  const open = isModalOpen(MEDIA_DRAWER_SLUG);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) wasOpen.current = true;
    else if (wasOpen.current) onClosed();
  }, [open, onClosed]);

  if (!open) return null;
  return <OpenMediaDrawer doc={listed} key={listed.id} />;
}

function OpenMediaDrawer({ doc: listed }: { doc: MediaDoc }) {
  const { closeModal, openModal } = useModal();
  const { permissions } = useAuth();
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [doc, setDoc] = useState<MediaDoc>(listed);
  const [uses, setUses] = useState<MediaUse[]>();
  const [alt, setAlt] = useState(listed.alt ?? "");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const altRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const altId = useId();
  const hintId = useId();
  const errorId = useId();
  const canEdit = Boolean(permissions?.collections?.media?.update);
  const name = doc.filename ?? "this image";

  const api = (path: `/${string}`) =>
    formatAdminURL({ apiRoute: routes.api, serverURL, path });

  const [focusTrapOptions] = useState(() => ({
    initialFocus: () => closeRef.current ?? false,
    returnFocusOnDeactivate: false,
  }));

  useEffect(() => {
    const trigger = document.activeElement;
    closeRef.current?.focus();
    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  }, []);

  useEffect(() => {
    const request = new AbortController();
    const get = (path: `/${string}`) =>
      fetch(api(path), { credentials: "include", signal: request.signal })
        .then((response) => (response.ok ? response.json() : undefined))
        .catch(() => undefined);
    void get(`/media/${listed.id}?depth=1`).then((full?: MediaDoc) => {
      if (full) setDoc(full);
    });
    void Promise.all([
      get(`/footer?${usageQuery("footer", listed.id)}`),
      get(`/tenant-settings?${usageQuery("tenant-settings", listed.id)}`),
    ]).then(([footer, settings]) => {
      if (request.signal.aborted) return;
      setUses(
        usesOf(listed.id, {
          footer: footer?.docs,
          "tenant-settings": settings?.docs,
        }),
      );
    });
    return () => request.abort();
  }, [listed.id]);

  const close = () => closeModal(MEDIA_DRAWER_SLUG);

  const patch = (body: object, trash = false) =>
    fetch(api(`/media/${listed.id}${trash ? "?trash=true" : ""}`), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);

  const altMissing = !hasAlt(alt);
  const showError = touched && altMissing;

  const save = async () => {
    if (saving) return;
    if (altMissing) {
      setTouched(true);
      altRef.current?.focus();
      return;
    }
    setSaving(true);
    const response = await patch({ alt: alt.trim() });
    setSaving(false);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: "Couldn't save the alt text.",
        body: "Try again.",
      });
      return;
    }
    setAlt(alt.trim());
    router.refresh();
    notify({ tone: "success", title: "Alt text saved." });
  };

  const trash = async () => {
    const response = await patch({ deletedAt: new Date().toISOString() });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't move "${name}" to trash.`,
        body: "Try again.",
      });
      return;
    }
    close();
    router.refresh();
    notify({
      tone: "undo",
      title: `Moved "${name}" to trash.`,
      body: "You can restore it from Trash.",
      action: {
        label: "Undo",
        onClick: () => {
          void patch({ deletedAt: null }, true).then(() => router.refresh());
        },
      },
    });
  };

  const usedAs = uses && usedAsText(uses);
  const preview = previewURL(doc);

  return (
    <>
      <Modal
        className="dil-media-drawer"
        closeOnBlur={false}
        focusTrapOptions={focusTrapOptions}
        slug={MEDIA_DRAWER_SLUG}
      >
        <button
          aria-hidden="true"
          className="dil-media-drawer__scrim"
          onClick={close}
          tabIndex={-1}
          type="button"
        />
        <aside
          aria-labelledby={titleId}
          aria-modal="true"
          className="dil-media-drawer__panel"
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            close();
          }}
          role="dialog"
        >
          <div className="dil-upload__head">
            <h2
              className="dil-upload__title dil-media-drawer__title"
              id={titleId}
            >
              {name}
            </h2>
            <button
              aria-label="Close"
              className="dil-upload__close"
              onClick={close}
              ref={closeRef}
              type="button"
            >
              <MaterialIcon name="close" />
            </button>
          </div>
          <div className="dil-media-drawer__body">
            <div className="dil-media-drawer__preview">
              {preview ? (
                <img alt="" src={preview} />
              ) : (
                <MaterialIcon name="image" />
              )}
            </div>
            <div className="dil-media-drawer__alt">
              <label htmlFor={altId}>
                Alt text
                {canEdit && (
                  <span
                    aria-hidden="true"
                    className="dil-media-drawer__required"
                  >
                    {" "}
                    *
                  </span>
                )}
              </label>
              <input
                aria-describedby={showError ? `${errorId} ${hintId}` : hintId}
                aria-invalid={showError || undefined}
                aria-required={canEdit || undefined}
                className={
                  showError ? "dil-media-drawer__input--error" : undefined
                }
                id={altId}
                onChange={(event) => {
                  setAlt(event.target.value);
                  setTouched(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void save();
                }}
                readOnly={!canEdit}
                ref={altRef}
                value={alt}
              />
              {showError && (
                <p className="dil-media-drawer__error" id={errorId}>
                  <MaterialIcon name="error" />
                  Add alt text before saving.
                </p>
              )}
              <p className="dil-media-drawer__hint" id={hintId}>
                Describe the image for screen readers and search.
              </p>
            </div>
            <dl className="dil-media-drawer__facts">
              <dt>Original</dt>
              <dd>{originalText(doc)}</dd>
              <dt>Sizes</dt>
              <dd>{sizesText(doc.sizes)}</dd>
              <dt>Uploaded</dt>
              <dd>{uploadedText(doc)}</dd>
            </dl>
            {usedAs && (
              <Banner
                className="dil-media-drawer__usage"
                icon="link"
                tone="info"
              >
                {usedAs}
              </Banner>
            )}
          </div>
          {canEdit && (
            <div className="dil-media-drawer__foot">
              <ActionButton
                icon="delete"
                onClick={() => openModal(TRASH_SLUG)}
                type="button"
                variant="secondary"
              >
                Move to trash
              </ActionButton>
              <ActionButton
                busy={saving}
                className="dil-media-drawer__save"
                onClick={() => void save()}
                type="button"
              >
                Save alt text
              </ActionButton>
            </div>
          )}
        </aside>
      </Modal>
      {canEdit && (
        <ConfirmDialog
          body={
            <>
              <p>It leaves the media library. You can restore it from Trash.</p>
              {uses?.map(({ path, loses }) => (
                <p className="dil-media-drawer__warning" key={path}>
                  <MaterialIcon name="warning" />
                  {loses}
                </p>
              ))}
            </>
          }
          confirmLabel="Move to trash"
          onConfirm={trash}
          slug={TRASH_SLUG}
          title={`Move "${name}" to trash?`}
          tone="delete"
        />
      )}
    </>
  );
}
