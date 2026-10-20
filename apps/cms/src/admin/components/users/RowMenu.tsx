"use client";

import { useModal } from "@payloadcms/ui";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import { Popover } from "../kit/Popover";
import { MaterialIcon } from "../MaterialIcon";
import {
  type EditTarget,
  type InviteTenant,
  UserAccessDialog,
} from "./InviteUser";
import { unlockSlug, useUserActions } from "./StatusActions";
import type { UserStatus } from "./users";

const HEADINGS: Record<UserStatus["status"], string> = {
  active: "Active",
  invited: "Invited",
  locked: "Locked",
};

export function RowMenu({
  user,
  status,
  companies,
}: {
  user: EditTarget;
  status: UserStatus;
  companies: InviteTenant[];
}) {
  const { openModal, isModalOpen } = useModal();
  const { resend, remove } = useUserActions(user);
  const editSlug = `edit-user-${user.id}`;
  const removeSlug = `remove-user-${user.id}`;
  const heading =
    status.status === "locked"
      ? `Locked · ${status.minutes} min left`
      : HEADINGS[status.status];

  return (
    <>
      <Popover
        align="end"
        className="dil-row-menu"
        floating
        icon="more_horiz"
        label={<span className="dil-sr-only">Actions for {user.name}</span>}
        trailingIcon={null}
      >
        {(close) => (
          <div className="dil-menu" role="menu">
            <span className="dil-menu__heading">{heading}</span>
            {status.status === "invited" && (
              <button
                className="dil-menu__action"
                onClick={() => {
                  close();
                  void resend();
                }}
                role="menuitem"
                type="button"
              >
                <MaterialIcon name="forward_to_inbox" />
                Resend invitation
              </button>
            )}
            {status.status === "locked" && (
              <button
                className="dil-menu__action"
                onClick={() => {
                  close();
                  openModal(unlockSlug(user.id));
                }}
                role="menuitem"
                type="button"
              >
                <MaterialIcon name="lock_open" />
                Unlock now…
              </button>
            )}
            <button
              className="dil-menu__action"
              onClick={() => {
                close();
                openModal(editSlug);
              }}
              role="menuitem"
              type="button"
            >
              <MaterialIcon name="edit" />
              Edit role &amp; companies
            </button>
            {user.self ? (
              <span className="dil-menu__note">
                Remove user isn&apos;t available for your own account.
              </span>
            ) : (
              <button
                className="dil-menu__action dil-menu__action--danger"
                onClick={() => {
                  close();
                  openModal(removeSlug);
                }}
                role="menuitem"
                type="button"
              >
                <MaterialIcon name="person_remove" />
                Remove user…
              </button>
            )}
          </div>
        )}
      </Popover>
      {isModalOpen(editSlug) && (
        <UserAccessDialog editing={user} slug={editSlug} tenants={companies} />
      )}
      {!user.self && (
        <ConfirmDialog
          body='They can no longer sign in. Content they saved keeps its history and shows "Removed user" as the author.'
          confirmLabel="Remove user"
          icon="person_remove"
          onConfirm={remove}
          slug={removeSlug}
          title={`Remove ${user.name}?`}
          tone="delete"
        />
      )}
    </>
  );
}
