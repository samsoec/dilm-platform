"use client";

import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { type FormEvent, useId, useState } from "react";

import { MIN_PASSWORD_LENGTH } from "../../../account/password";
import type { InviteInfo } from "../../../account/resetToken";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { MaterialIcon } from "../MaterialIcon";
import { validUntil } from "./reset";

type Links = { home: string; signIn: string; forgot: string };

export function LinkProblem({
  invite = false,
  inviterName,
  links,
}: {
  invite?: boolean;
  inviterName?: string;
  links: Links;
}) {
  return (
    <div className="dil-signin">
      <div className="dil-login__intro">
        <h1 className="dil-login__title dil-login__title--problem">
          <MaterialIcon name="link_off" />
          {invite
            ? "This invitation has expired"
            : "This reset link no longer works"}
        </h1>
        <p className="dil-login__hint">
          {invite
            ? `Invitations last 72 hours. Ask a Super Admin to resend it${
                inviterName
                  ? `, for example ${inviterName}, who invited you`
                  : ""
              }.`
            : "It has expired or was already used."}
        </p>
      </div>
      {invite ? (
        <a className="dil-signin__link" href={links.signIn}>
          Back to sign in
        </a>
      ) : (
        <ActionButton
          className="dil-signin__submit"
          el="link"
          to={links.forgot}
        >
          Send a new link
        </ActionButton>
      )}
    </div>
  );
}

export function ResetForm({
  token,
  info,
  links,
}: {
  token: string;
  info?: InviteInfo;
  links: Links;
}) {
  const {
    config: { admin, routes, serverURL },
  } = useConfig();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [problem, setProblem] = useState<{
    field: "password" | "repeat" | "form";
    message: string;
  }>();
  const [busy, setBusy] = useState(false);
  const [gone, setGone] = useState(false);
  const passwordId = useId();
  const repeatId = useId();
  const api = (path: `/${string}`) =>
    formatAdminURL({ apiRoute: routes.api, serverURL, path });

  if (gone)
    return (
      <LinkProblem
        invite={Boolean(info)}
        inviterName={info?.inviterName}
        links={links}
      />
    );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (password.length < MIN_PASSWORD_LENGTH) {
      setProblem({
        field: "password",
        message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
      return;
    }
    if (password !== repeat) {
      setProblem({
        field: "repeat",
        message: "The two passwords don't match.",
      });
      return;
    }
    setBusy(true);
    setProblem(undefined);
    const response = await fetch(api(`/${admin.user}/reset-password`), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }).catch(() => undefined);
    if (response?.status === 403) {
      setBusy(false);
      setGone(true);
      return;
    }
    if (!response?.ok) {
      setBusy(false);
      setProblem({
        field: "form",
        message: "Couldn't save your password. Try again.",
      });
      return;
    }
    const { user } = (await response.json()) as { user?: { email?: string } };
    if (info && user?.email) {
      await fetch(api(`/${admin.user}/login`), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password }),
      }).catch(() => undefined);
      window.location.assign(links.home);
      return;
    }
    await fetch(api(`/${admin.user}/logout`), {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
    window.location.assign(`${links.signIn}?notice=password-updated`);
  };

  const error = (field: "password" | "repeat", id: string) =>
    problem?.field === field ? (
      <span className="dil-signin__error" id={`${id}-error`}>
        <MaterialIcon name="error" />
        {problem.message}
      </span>
    ) : null;

  return (
    <form
      className="dil-signin"
      noValidate
      onSubmit={(event) => void submit(event)}
    >
      <div className="dil-login__intro">
        <h1 className="dil-login__title">
          {info ? `Welcome, ${info.firstName}` : "Set a new password"}
        </h1>
        {info && (
          <>
            <p className="dil-login__hint">
              {info.inviterName ? <b>{info.inviterName}</b> : "A Super Admin"}{" "}
              invited you as a <b>{info.role}</b> for:
            </p>
            <span className="dil-login__companies">
              {info.companies.map((company) => (
                <span className="dil-login__company" key={company}>
                  {company}
                </span>
              ))}
            </span>
          </>
        )}
      </div>
      {problem?.field === "form" && (
        <Banner tone="error">{problem.message}</Banner>
      )}
      <div className="dil-signin__field">
        <label htmlFor={passwordId}>
          {info ? "Choose a password" : "New password"}
        </label>
        <input
          aria-describedby={
            problem?.field === "password" ? `${passwordId}-error` : undefined
          }
          aria-invalid={problem?.field === "password" || undefined}
          autoComplete="new-password"
          autoFocus
          id={passwordId}
          onChange={(event) => setPassword(event.target.value)}
          readOnly={busy}
          type="password"
          value={password}
        />
        {error("password", passwordId)}
      </div>
      <div className="dil-signin__field">
        <label htmlFor={repeatId}>
          {info ? "Repeat password" : "Repeat new password"}
        </label>
        <input
          aria-describedby={
            problem?.field === "repeat" ? `${repeatId}-error` : undefined
          }
          aria-invalid={problem?.field === "repeat" || undefined}
          autoComplete="new-password"
          id={repeatId}
          onChange={(event) => setRepeat(event.target.value)}
          readOnly={busy}
          type="password"
          value={repeat}
        />
        {error("repeat", repeatId)}
      </div>
      <ActionButton busy={busy} className="dil-signin__submit" type="submit">
        {info ? "Set password and continue" : "Save password and sign in"}
      </ActionButton>
      {info && (
        <p className="dil-login__footnote">
          Only you will know this password. Link valid until{" "}
          {validUntil(info.expiresAt)}.
        </p>
      )}
    </form>
  );
}
