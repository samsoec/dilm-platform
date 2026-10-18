"use client";

import { Modal, useConfig, useModal } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { LoadingBlock } from "../kit/Loading";
import { MaterialIcon } from "../MaterialIcon";
import { ACCEPTED_IMAGE_TYPES } from "./uploadRules";
import { UploadDialog } from "./UploadDialog";

export type PickedMedia = {
  id: number | string;
  filename?: string;
  alt?: string;
  url?: string;
  thumbnail?: string;
};

type MediaDoc = {
  id: number | string;
  filename?: string;
  alt?: string;
  url?: string;
  sizes?: { thumbnail?: { url?: string | null } };
};

const COLUMNS = 4;

export function toPicked(doc: MediaDoc): PickedMedia {
  return {
    id: doc.id,
    filename: doc.filename,
    alt: doc.alt,
    url: doc.url,
    thumbnail: doc.sizes?.thumbnail?.url ?? doc.url,
  };
}

export function MediaPickerDialog({
  slug,
  title,
  tenant,
  selectedId,
  onPick,
}: {
  slug: string;
  title: string;
  tenant: number | string | undefined;
  selectedId?: number | string;
  onPick: (media: PickedMedia) => void;
}) {
  const { closeModal, isModalOpen, openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<MediaDoc[]>();
  const [chosen, setChosen] = useState<number | string | undefined>(selectedId);
  const [active, setActive] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [reload, setReload] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const open = isModalOpen(slug);

  useEffect(() => {
    if (open) setChosen(selectedId);
  }, [open, selectedId]);

  useEffect(() => {
    if (!open || tenant === undefined) return;
    const request = new AbortController();
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        depth: "0",
        limit: "48",
        sort: "-createdAt",
        "where[and][0][tenant][equals]": String(tenant),
      });
      const term = query.trim();
      if (term) {
        params.set("where[and][1][or][0][filename][like]", term);
        params.set("where[and][1][or][1][alt][like]", term);
      }
      fetch(
        formatAdminURL({
          apiRoute: routes.api,
          serverURL,
          path: `/media?${params}`,
        }),
        { credentials: "include", signal: request.signal },
      )
        .then((response) => (response.ok ? response.json() : { docs: [] }))
        .then((body: { docs: MediaDoc[] }) => {
          setDocs(body.docs);
          setActive(0);
        })
        .catch(() => undefined);
    }, 250);
    return () => {
      clearTimeout(timer);
      request.abort();
    };
  }, [open, query, reload, routes.api, serverURL, tenant]);

  const focusCard = (index: number) => {
    setActive(index);
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-index="${index}"]`)
      ?.focus();
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!docs?.length) return;
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: COLUMNS,
      ArrowUp: -COLUMNS,
    };
    const step = moves[event.key];
    if (step === undefined) return;
    event.preventDefault();
    focusCard(Math.min(docs.length - 1, Math.max(0, active + step)));
  };

  const use = () => {
    const doc = docs?.find(({ id }) => id === chosen);
    if (!doc) return;
    onPick(toPicked(doc));
    closeModal(slug);
  };

  return (
    <>
      {open && (
        <Modal className="dil-picker" closeOnBlur={false} slug={slug}>
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className="dil-picker__dialog"
            role="dialog"
          >
            <div className="dil-upload__head">
              <h2 className="dil-upload__title" id={titleId}>
                {title}
              </h2>
              <button
                aria-label="Close"
                className="dil-upload__close"
                onClick={() => closeModal(slug)}
                type="button"
              >
                <MaterialIcon name="close" />
              </button>
            </div>
            <div className="dil-picker__bar">
              <label className="dil-picker__search">
                <MaterialIcon name="search" />
                <span className="dil-sr-only">Search images</span>
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search file name or alt text"
                  type="search"
                  value={query}
                />
              </label>
              <ActionButton
                icon="upload"
                onClick={() => fileInput.current?.click()}
                type="button"
                variant="secondary"
              >
                Upload new
              </ActionButton>
              <input
                accept={[...ACCEPTED_IMAGE_TYPES, "image/*"].join(",")}
                className="dil-sr-only"
                multiple={false}
                onChange={(event) => {
                  const picked = Array.from(event.target.files ?? []);
                  event.target.value = "";
                  if (picked.length === 0) return;
                  setFiles(picked);
                  openModal(`${slug}-upload`);
                }}
                ref={fileInput}
                tabIndex={-1}
                type="file"
              />
            </div>
            {!docs ? (
              <div className="dil-picker__loading">
                <LoadingBlock lines={2} />
              </div>
            ) : docs.length === 0 ? (
              <p className="dil-picker__empty">
                {query.trim()
                  ? `No images match “${query.trim()}”.`
                  : "No images for this company yet. Upload one."}
              </p>
            ) : (
              <div
                aria-label="Images"
                className="dil-picker__grid"
                onKeyDown={onGridKeyDown}
                ref={gridRef}
                role="listbox"
              >
                {docs.map((doc, index) => {
                  const selected = doc.id === chosen;
                  const thumb = doc.sizes?.thumbnail?.url ?? doc.url;
                  return (
                    <button
                      aria-selected={selected}
                      className={`dil-picker__card${selected ? " dil-picker__card--selected" : ""}`}
                      data-index={index}
                      key={doc.id}
                      onClick={() => {
                        setActive(index);
                        setChosen(doc.id);
                      }}
                      onDoubleClick={() => {
                        setChosen(doc.id);
                        onPick(toPicked(doc));
                        closeModal(slug);
                      }}
                      role="option"
                      tabIndex={index === active ? 0 : -1}
                      title={doc.alt}
                      type="button"
                    >
                      <span className="dil-picker__thumb">
                        {thumb && <img alt="" loading="lazy" src={thumb} />}
                        {selected && (
                          <span className="dil-picker__check">
                            <MaterialIcon name="check" />
                          </span>
                        )}
                      </span>
                      <span className="dil-picker__name">{doc.filename}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="dil-picker__foot">
              <ActionButton
                onClick={() => closeModal(slug)}
                type="button"
                variant="secondary"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={use}
                type="button"
                unavailableReason={
                  chosen === undefined ? "Pick an image first." : undefined
                }
              >
                Use this image
              </ActionButton>
            </div>
          </div>
        </Modal>
      )}
      <UploadDialog
        files={files}
        slug={`${slug}-upload`}
        onUploaded={(uploaded) => {
          const first = uploaded[0];
          if (first) setChosen(first.id);
          setQuery("");
          setReload((count) => count + 1);
          openModal(slug);
        }}
        tenant={tenant}
      />
    </>
  );
}
