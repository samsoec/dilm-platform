"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useState } from "react";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import { StatusChip } from "../kit/StatusChip";
import { notify } from "../kit/Toast";
import type { UserStatus } from "./users";

export function StatusActions({
  id,
  name,
  email,
  status,
}: {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
}) {
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const { openModal } = useModal();
  const [busy, setBusy] = useState(false);
  const unlockSlug = `unlock-user-${id}`;
  const api = (path: `/${string}`) =>
    formatAdminURL({ apiRoute: routes.api, serverURL, path });
  const first = name.split(/\s+/)[0] || name;

  const post = async (path: `/${string}`, body: object) => {
    setBusy(true);
    const response = await fetch(api(path), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);
    setBusy(false);
    return response;
  };

  const unlock = async () => {
    const response = await post("/users/unlock", { email });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't unlock ${first}.`,
        body: "Try again.",
      });
      return;
    }
    notify({
      tone: "success",
      title: `${name} is unlocked.`,
      body: "They can sign in again right away.",
    });
    router.refresh();
  };

  const resend = async () => {
    const response = await post("/users/invite/resend", { id });
    const body = (await response?.json().catch(() => undefined)) as
      { message?: string } | undefined;
    if (!response?.ok) {
      notify({
        tone: "error",
        title: "Couldn't resend the invitation.",
        body: body?.message ?? "Try again.",
      });
      return;
    }
    notify({
      tone: "success",
      title: `Invitation resent to ${first}.`,
      body: "The new link is valid for 72 hours.",
    });
  };

  if (status.status === "invited") {
    return (
      <span className="dil-user-status">
        <span className="dil-user-status__invited">
          Invited · never signed in
        </span>
        <button
          className="dil-user-status__action"
          disabled={busy}
          onClick={() => void resend()}
          type="button"
        >
          Resend invitation
        </button>
      </span>
    );
  }

  if (status.status === "locked") {
    return (
      <span className="dil-user-status">
        <StatusChip detail={status.minutes} set="user" status="locked" />
        <button
          className="dil-user-status__action"
          onClick={() => openModal(unlockSlug)}
          type="button"
        >
          Unlock
        </button>
        <ConfirmDialog
          body="They can sign in again right away. Status returns to Active."
          confirmLabel="Unlock"
          icon="lock_open"
          onConfirm={unlock}
          slug={unlockSlug}
          title={`Unlock ${name}?`}
          tone="go-live"
        />
      </span>
    );
  }

  return <StatusChip set="user" status="active" />;
}
