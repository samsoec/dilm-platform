"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import { TRASH_COPY, type TrashSlug } from "./trash";

export function TrashActions({
  collectionSlug,
  id,
  title,
  company,
  canDelete,
}: {
  collectionSlug: TrashSlug;
  id: number;
  title: string;
  company: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const copy = TRASH_COPY[collectionSlug];
  const restoreSlug = `restore-${collectionSlug}-${id}`;
  const deleteSlug = `delete-${collectionSlug}-${id}`;
  const url = formatAdminURL({
    apiRoute: routes.api,
    serverURL,
    path: `/${collectionSlug}/${id}?trash=true`,
  });

  const patch = (body: object) =>
    fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);

  const restore = async () => {
    const response = await patch({
      deletedAt: null,
      ...(collectionSlug === "ir-documents" && { _status: "draft" }),
    });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't restore "${title}".`,
        body: "Try again.",
      });
      return;
    }
    router.refresh();
    notify({
      tone: "undo",
      title: `Restored "${title}".`,
      body: copy.restoreToast,
      action: {
        label: "Undo",
        onClick: () => {
          void patch({ deletedAt: new Date().toISOString() }).then(() =>
            router.refresh(),
          );
        },
      },
    });
  };

  const remove = async () => {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    }).catch(() => undefined);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't delete "${title}".`,
        body: "Try again.",
      });
      return;
    }
    router.refresh();
    notify({ tone: "success", title: `Deleted "${title}" permanently.` });
  };

  return (
    <span className="dil-trash__actions">
      <button
        className="dil-trash__restore"
        onClick={() => openModal(restoreSlug)}
        type="button"
      >
        <MaterialIcon name="restore_from_trash" />
        Restore
      </button>
      {canDelete && (
        <button
          className="dil-trash__delete"
          onClick={() => openModal(deleteSlug)}
          type="button"
        >
          Delete permanently
        </button>
      )}
      <ConfirmDialog
        body={copy.restoreBody}
        confirmLabel="Restore"
        icon="restore_from_trash"
        onConfirm={restore}
        slug={restoreSlug}
        title={`Restore "${title}"?`}
        tone="go-live"
      />
      {canDelete && (
        <ConfirmDialog
          body={copy.deleteBody(company)}
          confirmLabel="Delete permanently"
          onConfirm={remove}
          slug={deleteSlug}
          title={`Delete "${title}" permanently?`}
          tone="delete"
        />
      )}
    </span>
  );
}
