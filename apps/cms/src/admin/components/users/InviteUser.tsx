"use client";

import { Modal, useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { type FormEvent, useId, useState } from "react";

import type { InviteField } from "../../../account/invite";
import { ROLE_LABELS, type Role } from "../../../access";
import { ActionButton } from "../kit/ActionButton";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";

export type InviteTenant = { id: number; name: string; domain?: string };

const SLUG = "dil-invite-user";

const ROLE_CARDS: { role: Role; hint: string }[] = [
  { role: "super-admin", hint: "All companies" },
  { role: "tenant-editor", hint: "Edit content" },
  { role: "tenant-viewer", hint: "Look only" },
];

export function InviteUser({
  tenants,
  selectedTenant,
}: {
  tenants: InviteTenant[];
  selectedTenant?: number | string;
}) {
  const { openModal, isModalOpen } = useModal();
  return (
    <>
      <ActionButton
        className="dil-invite-button"
        icon="person_add"
        onClick={() => openModal(SLUG)}
        type="button"
      >
        Invite user
      </ActionButton>
      {isModalOpen(SLUG) && (
        <UserAccessDialog
          selectedTenant={selectedTenant}
          slug={SLUG}
          tenants={tenants}
        />
      )}
    </>
  );
}

export type EditTarget = {
  id: number;
  name: string;
  email: string;
  role: Role;
  tenants: number[];
  self: boolean;
};

export function UserAccessDialog({
  slug,
  tenants,
  selectedTenant,
  editing,
}: {
  slug: string;
  tenants: InviteTenant[];
  selectedTenant?: number | string;
  editing?: EditTarget;
}) {
  const router = useRouter();
  const { closeModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [role, setRole] = useState<Role>(editing?.role ?? "tenant-editor");
  const [picked, setPicked] = useState<number[]>(
    editing?.tenants ??
      tenants
        .filter(({ id }) => String(id) === String(selectedTenant))
        .map(({ id }) => id),
  );
  const lockedRole = Boolean(editing?.self && editing.role === "super-admin");
  const [error, setError] = useState<{ field: InviteField; message: string }>();
  const [busy, setBusy] = useState(false);
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const superAdmin = role === "super-admin";
  const senderTenant = superAdmin
    ? tenants.find(({ id }) => String(id) === String(selectedTenant))
    : tenants.find(({ id }) => id === picked[0]);

  const close = () => closeModal(slug);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: editing ? "/users/access" : "/users/invite",
      }),
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editing ? { id: editing.id } : { name, email }),
          role,
          tenants: superAdmin ? [] : picked,
        }),
      },
    ).catch(() => undefined);
    setBusy(false);
    const body = (await response?.json().catch(() => undefined)) as
      { field?: InviteField; message?: string; name?: string } | undefined;
    if (response?.ok) {
      close();
      const first = name.trim().split(/\s+/)[0];
      notify(
        editing
          ? {
              tone: "success",
              title: `Saved ${first}'s role and companies.`,
              body: "They take effect on their next click.",
            }
          : {
              tone: "success",
              title: `Invitation sent to ${first}.`,
              body: "The link is valid for 72 hours.",
            },
      );
      router.refresh();
      return;
    }
    if (body?.field) {
      setError({
        field: body.field,
        message: body.message ?? "Check this field.",
      });
      return;
    }
    notify({
      tone: "error",
      title: "Couldn't send the invitation.",
      body: body?.message ?? "Try again.",
    });
    if (response?.status === 502) {
      close();
      router.refresh();
    }
  };

  const fieldError = (field: InviteField) =>
    error?.field === field ? (
      <span className="dil-account-field__error" id={`${titleId}-${field}`}>
        <MaterialIcon name="error" />
        {error.message}
      </span>
    ) : null;

  const describedBy = (field: InviteField) =>
    error?.field === field ? `${titleId}-${field}` : undefined;

  return (
    <Modal className="dil-confirm" closeOnBlur={false} slug={slug}>
      <form
        aria-labelledby={titleId}
        aria-modal="true"
        className="dil-invite"
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
        onSubmit={(event) => void submit(event)}
        role="dialog"
      >
        <header className="dil-invite__head">
          <h2 id={titleId}>
            {editing ? (
              <>
                {editing.name}
                {editing.self && (
                  <span className="dil-invite__you"> (you)</span>
                )}
              </>
            ) : (
              "Invite a user"
            )}
          </h2>
          <button
            aria-label="Close"
            className="dil-drawer__close"
            onClick={close}
            type="button"
          >
            <MaterialIcon name="close" />
          </button>
        </header>
        <div className="dil-invite__body">
          {editing ? (
            <p className="dil-account__note">{editing.email}</p>
          ) : (
            <div className="dil-account__pair">
              <label className="dil-account-field" htmlFor={nameId}>
                <span className="dil-account-field__label">Name</span>
                <input
                  aria-describedby={describedBy("name")}
                  aria-invalid={error?.field === "name" || undefined}
                  autoFocus
                  id={nameId}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error?.field === "name") setError(undefined);
                  }}
                  value={name}
                />
                {fieldError("name")}
              </label>
              <label className="dil-account-field" htmlFor={emailId}>
                <span className="dil-account-field__label">Email</span>
                <input
                  aria-describedby={describedBy("email")}
                  aria-invalid={error?.field === "email" || undefined}
                  id={emailId}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error?.field === "email") setError(undefined);
                  }}
                  type="email"
                  value={email}
                />
                {fieldError("email")}
              </label>
            </div>
          )}
          {lockedRole ? (
            <div className="dil-account-field">
              <span className="dil-account-field__label">
                Role <MaterialIcon name="lock" />
              </span>
              <p className="dil-account-field__locked">
                {ROLE_LABELS["super-admin"]}
              </p>
              <p className="dil-account__note">
                You can&apos;t remove your own Super Admin role. Ask another
                Super Admin.
              </p>
              <p className="dil-account__note">
                Remove user isn&apos;t available for your own account.
              </p>
            </div>
          ) : (
            <fieldset
              aria-describedby={describedBy("role")}
              className="dil-account-field"
            >
              <legend className="dil-account-field__label">Role</legend>
              <div className="dil-invite__roles">
                {ROLE_CARDS.map((card) => (
                  <label
                    className={`dil-invite__role${role === card.role ? " dil-invite__role--checked" : ""}`}
                    key={card.role}
                  >
                    <input
                      checked={role === card.role}
                      className="dil-sr-only"
                      name={`${titleId}-role`}
                      onChange={() => setRole(card.role)}
                      type="radio"
                    />
                    <b>{ROLE_LABELS[card.role]}</b>
                    <span>{card.hint}</span>
                  </label>
                ))}
              </div>
              {fieldError("role")}
            </fieldset>
          )}
          {!lockedRole && (
            <fieldset
              aria-describedby={describedBy("tenants")}
              className="dil-account-field"
            >
              <legend className="dil-account-field__label">
                Companies{" "}
                <span className="dil-invite__hint">· at least one</span>
              </legend>
              {superAdmin ? (
                <p className="dil-invite__all">All companies</p>
              ) : (
                <ul className="dil-invite__companies">
                  {tenants.map((tenant) => {
                    const checked = picked.includes(tenant.id);
                    return (
                      <li key={tenant.id}>
                        <label>
                          <input
                            checked={checked}
                            onChange={() => {
                              setPicked(
                                checked
                                  ? picked.filter((id) => id !== tenant.id)
                                  : [...picked, tenant.id],
                              );
                              if (error?.field === "tenants")
                                setError(undefined);
                            }}
                            type="checkbox"
                          />
                          {tenant.name}
                          {!editing && picked[0] === tenant.id && (
                            <span className="dil-invite__hint">
                              · sends the invite
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
              {fieldError("tenants")}
            </fieldset>
          )}
          <p className="dil-account__note">
            {editing
              ? "Role and company changes take effect on the user's next click."
              : senderTenant?.domain
                ? `They get an email from noreply@${senderTenant.domain} with a link to set their own password, valid 72 hours.`
                : "They get an email with a link to set their own password, valid 72 hours."}
          </p>
        </div>
        <footer className="dil-invite__foot">
          <ActionButton onClick={close} type="button" variant="secondary">
            Cancel
          </ActionButton>
          {editing ? (
            !lockedRole && (
              <ActionButton busy={busy} type="submit">
                Save changes
              </ActionButton>
            )
          ) : (
            <ActionButton busy={busy} icon="send" type="submit">
              Send invitation
            </ActionButton>
          )}
        </footer>
      </form>
    </Modal>
  );
}
