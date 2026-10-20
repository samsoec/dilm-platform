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
        <InviteDialog selectedTenant={selectedTenant} tenants={tenants} />
      )}
    </>
  );
}

function InviteDialog({
  tenants,
  selectedTenant,
}: {
  tenants: InviteTenant[];
  selectedTenant?: number | string;
}) {
  const router = useRouter();
  const { closeModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("tenant-editor");
  const [picked, setPicked] = useState<number[]>(
    tenants
      .filter(({ id }) => String(id) === String(selectedTenant))
      .map(({ id }) => id),
  );
  const [error, setError] = useState<{ field: InviteField; message: string }>();
  const [busy, setBusy] = useState(false);
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const superAdmin = role === "super-admin";
  const senderTenant = superAdmin
    ? tenants.find(({ id }) => String(id) === String(selectedTenant))
    : tenants.find(({ id }) => id === picked[0]);

  const close = () => closeModal(SLUG);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: "/users/invite",
      }),
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
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
      notify({
        tone: "success",
        title: `Invitation sent to ${name.trim().split(/\s+/)[0]}.`,
        body: "The link is valid for 72 hours.",
      });
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
    <Modal className="dil-confirm" closeOnBlur={false} slug={SLUG}>
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
          <h2 id={titleId}>Invite a user</h2>
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
          <fieldset className="dil-account-field">
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
          </fieldset>
          <fieldset
            aria-describedby={describedBy("tenants")}
            className="dil-account-field"
          >
            <legend className="dil-account-field__label">
              Companies <span className="dil-invite__hint">· at least one</span>
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
                            if (error?.field === "tenants") setError(undefined);
                          }}
                          type="checkbox"
                        />
                        {tenant.name}
                        {picked[0] === tenant.id && (
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
          <p className="dil-account__note">
            {senderTenant?.domain
              ? `They get an email from noreply@${senderTenant.domain} with a link to set their own password, valid 72 hours.`
              : "They get an email with a link to set their own password, valid 72 hours."}
          </p>
        </div>
        <footer className="dil-invite__foot">
          <ActionButton onClick={close} type="button" variant="secondary">
            Cancel
          </ActionButton>
          <ActionButton busy={busy} icon="send" type="submit">
            Send invitation
          </ActionButton>
        </footer>
      </form>
    </Modal>
  );
}
