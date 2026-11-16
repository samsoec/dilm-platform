"use client";

import { useConfig, useDocumentDrawer, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";

import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";

export function AddRedirect({ tenant }: { tenant: number | string }) {
  const router = useRouter();
  const [Drawer, , { openDrawer, closeDrawer }] = useDocumentDrawer({
    collectionSlug: "redirects",
  });
  return (
    <>
      <ActionButton icon="add" onClick={openDrawer} type="button">
        Add redirect
      </ActionButton>
      <Drawer
        initialData={{ tenant, origin: "manual", locale: "en" }}
        onSave={() => {
          closeDrawer();
          router.refresh();
          notify({ tone: "success", title: "Redirect added." });
        }}
      />
    </>
  );
}

export function RedirectRowActions({ id, from }: { id: string; from: string }) {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [Drawer, , { openDrawer, closeDrawer }] = useDocumentDrawer({
    collectionSlug: "redirects",
    id: Number(id),
  });
  const slug = `delete-redirect-${id}`;

  const remove = async () => {
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/redirects/${id}`,
      }),
      { method: "DELETE", credentials: "include" },
    ).catch(() => undefined);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't delete the redirect from ${from}.`,
        body: "Try again.",
      });
      return;
    }
    router.refresh();
    notify({ tone: "success", title: `Deleted the redirect from ${from}.` });
  };

  return (
    <span className="dil-redirects__actions">
      <button
        aria-label={`Edit the redirect from ${from}`}
        className="dil-redirects__action"
        onClick={openDrawer}
        type="button"
      >
        Edit
      </button>
      <button
        aria-label={`Delete the redirect from ${from}`}
        className="dil-redirects__action"
        onClick={() => openModal(slug)}
        type="button"
      >
        Delete
      </button>
      <Drawer
        onSave={() => {
          closeDrawer();
          router.refresh();
        }}
      />
      <ConfirmDialog
        body="Visitors who still use the old address will get a not-found page. This can't be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        slug={slug}
        title={`Delete the redirect from ${from}?`}
        tone="delete"
      />
    </span>
  );
}
