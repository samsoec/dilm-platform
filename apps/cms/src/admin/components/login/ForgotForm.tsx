"use client";

import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { type FormEvent, useId, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { MaterialIcon } from "../MaterialIcon";
import { senderFor } from "./reset";

export function ForgotForm({
  signInHref,
  domains,
}: {
  signInHref: string;
  domains: string[];
}) {
  const {
    config: { admin, routes, serverURL },
  } = useConfig();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string>();
  const emailId = useId();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setProblem("Enter your work email, like dimas.pratama@duniakimia.com.");
      return;
    }
    setBusy(true);
    setProblem(undefined);
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/${admin.user}/forgot-password`,
      }),
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
      },
    ).catch(() => undefined);
    setBusy(false);
    if (!response || response.status >= 500) {
      setProblem(
        "Couldn't reach the CMS. Check your connection and try again.",
      );
      return;
    }
    setSent(address);
  };

  if (sent) {
    const sender = senderFor(sent, domains);
    return (
      <div className="dil-signin">
        <span className="dil-login__tile">
          <MaterialIcon name="mark_email_read" />
        </span>
        <div className="dil-login__intro">
          <h1 className="dil-login__title">Check your email</h1>
          <p className="dil-login__hint">
            If an account exists for <b>{sent}</b>, we&apos;ve sent a reset
            link.{" "}
            {sender ? (
              <>
                It comes from <code>{sender}</code>.
              </>
            ) : (
              "It comes from your company's own noreply@ address."
            )}
          </p>
        </div>
        <a className="dil-signin__link" href={signInHref}>
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form
      className="dil-signin"
      noValidate
      onSubmit={(event) => void submit(event)}
    >
      <a className="dil-login__back" href={signInHref}>
        <MaterialIcon name="arrow_back" />
        Sign in
      </a>
      <div className="dil-login__intro">
        <h1 className="dil-login__title">Reset your password</h1>
        <p className="dil-login__hint">
          Enter your work email. We&apos;ll send a link to set a new password.
        </p>
      </div>
      {problem && <Banner tone="error">{problem}</Banner>}
      <div className="dil-signin__field">
        <label htmlFor={emailId}>Email</label>
        <input
          autoComplete="email"
          autoFocus
          id={emailId}
          onChange={(event) => setEmail(event.target.value)}
          readOnly={busy}
          type="email"
          value={email}
        />
      </div>
      <ActionButton busy={busy} className="dil-signin__submit" type="submit">
        Send reset link
      </ActionButton>
    </form>
  );
}
