"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";

export function CategoryRowActions({
  id,
  name,
  inUseMessage,
}: {
  id: string;
  name: string;
  inUseMessage: string | undefined;
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const slug = `delete-category-${id}`;

  const remove = async () => {
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/categories/${id}`,
      }),
      { method: "DELETE", credentials: "include" },
    ).catch(() => undefined);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't delete "${name}".`,
        body: "Try again.",
      });
      return;
    }
    router.refresh();
    notify({ tone: "success", title: `Deleted "${name}".` });
  };

  return (
    <>
      <button
        className="dil-categories__delete"
        onClick={() => openModal(slug)}
        type="button"
      >
        Delete
      </button>
      {inUseMessage ? (
        <ConfirmDialog
          body={inUseMessage}
          confirmLabel="Delete"
          onConfirm={() => undefined}
          refusal
          slug={slug}
          cancelLabel="Close"
          title={`"${name}" can't be deleted`}
          tone="delete"
        />
      ) : (
        <ConfirmDialog
          body="No posts are filed under it on any site. This can't be undone."
          confirmLabel="Delete"
          onConfirm={remove}
          slug={slug}
          title={`Delete "${name}"?`}
          tone="delete"
        />
      )}
    </>
  );
}
