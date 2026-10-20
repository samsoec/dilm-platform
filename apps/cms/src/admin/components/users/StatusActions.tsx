"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useState } from "react";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import { StatusChip } from "../kit/StatusChip";
import { notify } from "../kit/Toast";
import type { UserStatus } from "./users";

export type UserRef = { id: number; name: string; email: string };

export function unlockSlug(id: number): string {
  return `unlock-user-${id}`;
}

export function useUserActions({ id, name, email }: UserRef) {
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [busy, setBusy] = useState(false);
  const first = name.split(/\s+/)[0] || name;

  const call = async (path: `/${string}`, method: string, body?: object) => {
    setBusy(true);
    const response = await fetch(
      formatAdminURL({ apiRoute: routes.api, serverURL, path }),
      {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      },
    ).catch(() => undefined);
    setBusy(false);
    return response;
  };

  const unlock = async () => {
    const response = await call("/users/unlock", "POST", { email });
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
    const response = await call("/users/invite/resend", "POST", { id });
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

  const remove = async () => {
    const response = await call(
      `/users/${encodeURIComponent(String(id))}`,
      "DELETE",
    );
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't remove ${first}.`,
        body: "Try again.",
      });
      return;
    }
    notify({
      tone: "success",
      title: `${name} was removed.`,
      body: 'Content they saved now shows "Removed user" as the author.',
    });
    router.refresh();
  };

  return { busy, unlock, resend, remove };
}

export function UnlockDialog({
  user,
  onConfirm,
}: {
  user: UserRef;
  onConfirm: () => Promise<void>;
}) {
  return (
    <ConfirmDialog
      body="They can sign in again right away. Status returns to Active."
      confirmLabel="Unlock"
      icon="lock_open"
      onConfirm={onConfirm}
      slug={unlockSlug(user.id)}
      title={`Unlock ${user.name}?`}
      tone="go-live"
    />
  );
}

export function StatusActions({
  status,
  ...user
}: UserRef & { status: UserStatus }) {
  const { openModal } = useModal();
  const { busy, unlock, resend } = useUserActions(user);

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
          onClick={() => openModal(unlockSlug(user.id))}
          type="button"
        >
          Unlock
        </button>
        <UnlockDialog onConfirm={unlock} user={user} />
      </span>
    );
  }

  return <StatusChip set="user" status="active" />;
}
