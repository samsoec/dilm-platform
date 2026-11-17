"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";

import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { SuperAdminTag } from "../kit/Tag";
import { notify } from "../kit/Toast";
import { eraseCopy } from "./contact";

const DIALOG = "erase-contact-message";

export function ContactEraseCard({
  id,
  name,
  company,
  returnHref,
}: {
  id: number | string;
  name: string;
  company: string;
  returnHref: string;
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const copy = eraseCopy(name, company);

  async function erase() {
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/contact-submissions/${id}`,
      }),
      { method: "DELETE", credentials: "include" },
    ).catch(() => undefined);
    if (!response?.ok) {
      notify({ tone: "error", title: copy.failed });
      return;
    }
    router.push(returnHref);
    notify({ tone: "success", title: copy.done });
  }

  return (
    <section aria-labelledby="erase-contact-heading" className="dil-app-panel">
      <h2 className="dil-app-panel__title" id="erase-contact-heading">
        Erasure request <SuperAdminTag />
      </h2>
      <p className="dil-app-panel__note">
        Permanently deletes this message. There&apos;s no trash.
      </p>
      <ActionButton
        icon="delete_forever"
        onClick={() => openModal(DIALOG)}
        type="button"
        variant="destructive"
      >
        Delete permanently
      </ActionButton>
      <ConfirmDialog
        body={copy.body}
        confirmLabel="Delete permanently"
        onConfirm={erase}
        slug={DIALOG}
        title={copy.title}
        tone="delete"
        typeToConfirm="DELETE"
      />
    </section>
  );
}
