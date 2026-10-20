"use client";

import { useListQuery, useModal } from "@payloadcms/ui";
import { useState } from "react";

import { MaterialIcon } from "../MaterialIcon";
import { hasAlt, type MediaDoc, thumbnail } from "./media";
import { MEDIA_DRAWER_SLUG, MediaDrawer } from "./MediaDrawer";

export function MediaGrid() {
  const { data } = useListQuery();
  const { openModal } = useModal();
  const [openId, setOpenId] = useState<number>();
  const docs = (data?.docs ?? []) as MediaDoc[];
  const open = docs.find(({ id }) => id === openId);

  return (
    <>
      <ul aria-label="Images" className="dil-media-grid">
        {docs.map((doc) => {
          const thumb = thumbnail(doc);
          const missingAlt = !hasAlt(doc.alt);
          return (
            <li key={doc.id}>
              <button
                aria-haspopup="dialog"
                className={`dil-media-card${doc.id === openId ? " dil-media-card--open" : ""}`}
                onClick={() => {
                  setOpenId(doc.id);
                  openModal(MEDIA_DRAWER_SLUG);
                }}
                type="button"
              >
                <span
                  className={`dil-media-card__thumb${thumb?.original ? " dil-media-card__thumb--original" : ""}`}
                >
                  {thumb ? (
                    <img
                      alt=""
                      decoding="async"
                      loading="lazy"
                      src={thumb.url}
                    />
                  ) : (
                    <MaterialIcon name="image" />
                  )}
                  {missingAlt && (
                    <span className="dil-media-card__flag">
                      <MaterialIcon name="error" />
                      No alt text
                    </span>
                  )}
                </span>
                <span className="dil-media-card__name">{doc.filename}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {open && <MediaDrawer doc={open} onClosed={() => setOpenId(undefined)} />}
    </>
  );
}
