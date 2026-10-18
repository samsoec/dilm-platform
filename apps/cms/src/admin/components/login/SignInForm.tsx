"use client";

import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { type FormEvent, useId, useRef, useState } from "react";

import {
  LOCKED_ACCOUNT_MESSAGE,
  LOGIN_NOTICES,
  type LoginNotice,
  loginOutcome,
  WRONG_CREDENTIALS,
} from "../../login";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { useWakeUpNotice } from "../kit/Loading";
import { MaterialIcon } from "../MaterialIcon";

const SIGN_IN_WAKE_UP =
  "Waking up the CMS after a quiet period. This can take up to 20 seconds, you don't need to click again.";

export function SignInForm({
  notice,
  redirectTo,
  forgotHref,
}: {
  notice?: LoginNotice;
  redirectTo: string;
  forgotHref: string;
}) {
  const {
    config: { admin, routes, serverURL },
  } = useConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [problem, setProblem] = useState<string>();
  const [locked, setLocked] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailId = useId();
  const passwordId = useId();
  const wakeUpId = useId();
  const late = useWakeUpNotice(submitting);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setProblem(undefined);
    try {
      const response = await fetch(
        formatAdminURL({
          apiRoute: routes.api,
          serverURL,
          path: `/${admin.user}/login`,
        }),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      const body = await response.json().catch(() => undefined);
      const outcome = loginOutcome(response.status, body);
      if (outcome === "signed-in") {
        window.location.assign(redirectTo);
        return;
      }
      setSubmitting(false);
      if (outcome === "locked") {
        setLocked(true);
        return;
      }
      setProblem(WRONG_CREDENTIALS);
    } catch {
      setSubmitting(false);
      setProblem(
        "Couldn't reach the CMS. Check your connection and try again.",
      );
    }
    setPassword("");
    requestAnimationFrame(() => passwordRef.current?.focus());
  };

  if (locked) {
    return (
      <div className="dil-signin dil-signin--locked" role="alert">
        <span className="dil-signin__lock-tile">
          <MaterialIcon name="lock_clock" />
        </span>
        <h1 className="dil-login__title">Account temporarily locked</h1>
        <p className="dil-signin__lock-text">{LOCKED_ACCOUNT_MESSAGE}</p>
        <ActionButton el="link" url={forgotHref} variant="secondary">
          Reset password
        </ActionButton>
        <button
          className="dil-signin__link"
          onClick={() => {
            setLocked(false);
            setPassword("");
          }}
          type="button"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  const shownNotice = notice && !problem ? LOGIN_NOTICES[notice] : undefined;

  return (
    <form className="dil-signin" noValidate onSubmit={submit}>
      <div className="dil-login__intro">
        <h1 className="dil-login__title">Sign in</h1>
        <p className="dil-login__hint">
          Use the email your administrator invited.
        </p>
      </div>
      {shownNotice && (
        <Banner
          icon={shownNotice.icon}
          title={shownNotice.title}
          tone={shownNotice.tone}
        >
          {shownNotice.body}
        </Banner>
      )}
      {problem && <Banner tone="error">{problem}</Banner>}
      <div className="dil-signin__field">
        <label htmlFor={emailId}>Email</label>
        <input
          autoComplete="email"
          id={emailId}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          readOnly={submitting}
          required
          type="email"
          value={email}
        />
      </div>
      <div className="dil-signin__field">
        <span className="dil-signin__label-row">
          <label htmlFor={passwordId}>Password</label>
          <a className="dil-signin__forgot" href={forgotHref}>
            Forgot password?
          </a>
        </span>
        <span className="dil-signin__password">
          <input
            autoComplete="current-password"
            id={passwordId}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            readOnly={submitting}
            ref={passwordRef}
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="dil-signin__reveal"
            onClick={() => setShowPassword((shown) => !shown)}
            type="button"
          >
            <MaterialIcon
              name={showPassword ? "visibility_off" : "visibility"}
            />
          </button>
        </span>
      </div>
      <ActionButton
        busy={submitting}
        className="dil-signin__submit"
        type="submit"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </ActionButton>
      {late && (
        <div aria-live="polite" className="dil-signin__wake" id={wakeUpId}>
          <span aria-hidden="true" className="dil-signin__wake-bar" />
          <span>{SIGN_IN_WAKE_UP}</span>
        </div>
      )}
      <p className="dil-login__footnote">
        <MaterialIcon name="mail" />
        Reset emails come from your company&apos;s own noreply@ address.
      </p>
    </form>
  );
}
