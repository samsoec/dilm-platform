"use client";

import {
  useAllFormFields,
  useDocumentInfo,
  useFormModified,
} from "@payloadcms/ui";

import { countChanges, changeCountText } from "../guard/changes";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { Banner } from "../kit/Banner";
import { MaterialIcon } from "../MaterialIcon";
import {
  documentKey,
  type LiveCollection,
  savedAgo,
  useSavedVersion,
  viewerNotice,
} from "./liveSave";

export const DOCUMENT_STATUS_ID = "dil-document-status";

export function DocumentStatus() {
  const modified = useFormModified();
  const [fields] = useAllFormFields();
  const { collectionSlug, hasSavePermission, id } = useDocumentInfo();
  const { company } = useUnsavedChangesGuard();
  const saved = useSavedVersion(documentKey(collectionSlug, id));

  if (hasSavePermission === false) {
    return (
      <Banner
        className="dil-document-status__readonly"
        title="Read-only."
        tone="readonly"
      >
        {viewerNotice(collectionSlug as LiveCollection)}
      </Banner>
    );
  }

  if (modified) {
    return (
      <div
        aria-live="polite"
        className="dil-document-status"
        id={DOCUMENT_STATUS_ID}
      >
        <span className="dil-document-status__dirty">
          <span aria-hidden="true" className="dil-document-status__dot" />
          {changeCountText(Math.max(countChanges(fields), 1))}
        </span>
        <span className="dil-document-status__target">
          Saving updates {company?.domain ?? "the live site"}
        </span>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="dil-document-status"
      id={DOCUMENT_STATUS_ID}
    >
      {saved && (
        <span className="dil-document-status__saved">
          <MaterialIcon name="check_circle" />
          Saved · v{saved.version} · {savedAgo(saved.at)}
        </span>
      )}
    </div>
  );
}
