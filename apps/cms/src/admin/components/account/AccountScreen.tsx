"use client";

import {
  type Theme,
  useConfig,
  useStepNav,
  useTheme,
  useTranslation,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";

import type { PasswordField } from "../../../account/password";
import type { IconName } from "../../icons";
import { initials } from "../../initials";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";

type ThemeChoice = "light" | "dark" | "auto";

const THEMES: { value: ThemeChoice; icon: IconName; label: string }[] = [
  { value: "light", icon: "light_mode", label: "Light" },
  { value: "dark", icon: "dark_mode", label: "Dark" },
  { value: "auto", icon: "contrast", label: "Follow system" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" },
] as const;

export function AccountScreen({
  id,
  name,
  email,
  roles,
  companies,
  recordHref,
  logoutHref,
}: {
  id: number | string;
  name: string;
  email: string;
  roles: string[];
  companies: string[];
  recordHref?: string;
  logoutHref: string;
}) {
  const { stepNav, setStepNav } = useStepNav();
  useEffect(() => {
    if (stepNav.at(-1)?.label !== "My account") {
      setStepNav([{ label: "My account" }]);
    }
  }, [setStepNav, stepNav]);

  return (
    <div className="dil-account">
      <header className="dil-account__head">
        <div>
          <h1>My account</h1>
          <p>
            Your profile, password and how the CMS looks for you. These settings
            follow you on every company.
          </p>
        </div>
        <ActionButton
          icon="logout"
          to={logoutHref}
          el="link"
          variant="secondary"
        >
          Sign out
        </ActionButton>
      </header>
      <div className="dil-account__grid">
        <ProfileCard
          companies={companies}
          email={email}
          id={id}
          name={name}
          recordHref={recordHref}
          roles={roles}
        />
        <div className="dil-account__column">
          <PasswordCard />
          <PreferencesCard />
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="dil-account-card">
      <h2 className="dil-account-card__title">{title}</h2>
      <div className="dil-account-card__body">{children}</div>
    </section>
  );
}

function useApi() {
  const {
    config: { routes, serverURL },
  } = useConfig();
  return (path: `/${string}`) =>
    formatAdminURL({ apiRoute: routes.api, serverURL, path });
}

function ProfileCard({
  id,
  name: savedName,
  email,
  roles,
  companies,
  recordHref,
}: {
  id: number | string;
  name: string;
  email: string;
  roles: string[];
  companies: string[];
  recordHref?: string;
}) {
  const api = useApi();
  const router = useRouter();
  const [name, setName] = useState(savedName);
  const [saved, setSaved] = useState(savedName);
  const [busy, setBusy] = useState(false);
  const nameId = useId();
  const changed = name.trim() !== saved;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!changed || busy) return;
    setBusy(true);
    const response = await fetch(
      api(`/users/${encodeURIComponent(String(id))}`),
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      },
    ).catch(() => undefined);
    setBusy(false);
    if (!response?.ok) {
      notify({
        tone: "error",
        title: "Couldn't save your profile.",
        body: "Try again.",
      });
      return;
    }
    setSaved(name.trim());
    router.refresh();
    notify({ tone: "success", title: "Profile saved." });
  };

  const locked = !recordHref;
  return (
    <Card title="Profile">
      <form className="dil-account-form" onSubmit={(event) => void save(event)}>
        <div className="dil-account__avatar-row">
          <span aria-hidden className="dil-account__avatar">
            {initials({ name: saved, email })}
          </span>
          <p className="dil-account__note">
            Avatars are your initials. No photos are loaded from outside the
            CMS.
          </p>
        </div>
        <label className="dil-account-field" htmlFor={nameId}>
          <span className="dil-account-field__label">Name</span>
          <input
            autoComplete="name"
            id={nameId}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
        <div className="dil-account-field">
          <span className="dil-account-field__label">
            Email <MaterialIcon name="lock" />
          </span>
          <p className="dil-account-field__locked">{email}</p>
        </div>
        <div className="dil-account__pair">
          <Assignment
            href={recordHref}
            label="Role"
            locked={locked}
            values={roles}
          />
          <Assignment
            href={recordHref}
            label="Companies"
            locked={locked}
            tone="tenant"
            values={companies}
          />
        </div>
        <p className="dil-account__note">
          {locked
            ? "Only a Super Admin can change your role or companies."
            : "Change roles and companies on your Users record."}
        </p>
        <div className="dil-account-form__actions">
          <ActionButton busy={busy} type="submit">
            Save profile
          </ActionButton>
        </div>
      </form>
    </Card>
  );
}

function Assignment({
  label,
  values,
  locked,
  href,
  tone = "neutral",
}: {
  label: string;
  values: string[];
  locked: boolean;
  href?: string;
  tone?: "neutral" | "tenant";
}) {
  return (
    <div className="dil-account-field">
      <span className="dil-account-field__label">
        {label} {locked && <MaterialIcon name="lock" />}
      </span>
      <span className="dil-account__chips">
        {values.map((value) =>
          href ? (
            <a
              className={`dil-account__chip dil-account__chip--${tone}`}
              href={href}
              key={value}
            >
              {value}
            </a>
          ) : (
            <span
              className={`dil-account__chip dil-account__chip--${tone}`}
              key={value}
            >
              {value}
            </span>
          ),
        )}
      </span>
    </div>
  );
}

type PasswordValues = Record<PasswordField, string>;

const EMPTY: PasswordValues = {
  currentPassword: "",
  newPassword: "",
  repeatPassword: "",
};

function PasswordCard() {
  const api = useApi();
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<{
    field: PasswordField;
    message: string;
  }>();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const baseId = useId();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setDone(false);
    const response = await fetch(api("/users/change-password"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => undefined);
    setBusy(false);
    const body = (await response?.json().catch(() => undefined)) as
      { field?: PasswordField; message?: string } | undefined;
    if (response?.ok) {
      setValues(EMPTY);
      setError(undefined);
      setDone(true);
      return;
    }
    setError({
      field: body?.field ?? "currentPassword",
      message: body?.message ?? "Couldn't change your password. Try again.",
    });
  };

  const field = (name: PasswordField, label: string, autoComplete: string) => {
    const inputId = `${baseId}-${name}`;
    const invalid = error?.field === name;
    return (
      <label className="dil-account-field" htmlFor={inputId}>
        <span className="dil-account-field__label">{label}</span>
        <input
          aria-describedby={invalid ? `${inputId}-error` : undefined}
          aria-invalid={invalid || undefined}
          autoComplete={autoComplete}
          id={inputId}
          onChange={(event) => {
            setValues({ ...values, [name]: event.target.value });
            if (invalid) setError(undefined);
          }}
          type="password"
          value={values[name]}
        />
        {invalid && (
          <span className="dil-account-field__error" id={`${inputId}-error`}>
            <MaterialIcon name="error" />
            {error.message}
          </span>
        )}
      </label>
    );
  };

  return (
    <Card title="Password">
      <form
        className="dil-account-form"
        onSubmit={(event) => void submit(event)}
      >
        {field("currentPassword", "Current password", "current-password")}
        <div className="dil-account__pair">
          {field("newPassword", "New password", "new-password")}
          {field("repeatPassword", "Repeat new password", "new-password")}
        </div>
        {done && (
          <Banner title="Password changed." tone="success">
            You stay signed in on this device.
          </Banner>
        )}
        <div className="dil-account-form__actions">
          <ActionButton busy={busy} type="submit" variant="secondary">
            Change password
          </ActionButton>
        </div>
      </form>
    </Card>
  );
}

function PreferencesCard() {
  const { autoMode, theme, setTheme } = useTheme();
  const { i18n, switchLanguage } = useTranslation();
  const current: ThemeChoice = autoMode ? "auto" : theme;
  const languageName = useId();

  return (
    <Card title="Preferences">
      <fieldset className="dil-account-field">
        <legend className="dil-account-field__label">Interface language</legend>
        <div className="dil-account__languages">
          {LANGUAGES.map((language) => {
            const checked = i18n.language === language.value;
            return (
              <label
                className={`dil-account__language${checked ? " dil-account__language--checked" : ""}`}
                key={language.value}
                lang={language.value}
              >
                <input
                  checked={checked}
                  name={languageName}
                  onChange={() => {
                    void switchLanguage?.(language.value);
                    notify({
                      tone: "info",
                      icon: "translate",
                      title: `Interface switched to ${language.label}.`,
                      body: "Your content language didn't change.",
                    });
                  }}
                  type="radio"
                  value={language.value}
                />
                {language.label}
              </label>
            );
          })}
        </div>
        <span className="dil-account__note">
          Menus and messages in the CMS. Separate from the EN / ID content
          language you edit.
        </span>
      </fieldset>
      <fieldset className="dil-account-field">
        <legend className="dil-account-field__label">Theme</legend>
        <div
          className="dil-account__themes"
          role="radiogroup"
          aria-label="Theme"
        >
          {THEMES.map((choice) => (
            <button
              aria-checked={current === choice.value}
              className={`dil-account__theme${current === choice.value ? " dil-account__theme--active" : ""}`}
              key={choice.value}
              onClick={() => setTheme(choice.value as Theme)}
              role="radio"
              type="button"
            >
              <MaterialIcon name={choice.icon} />
              {choice.label}
            </button>
          ))}
        </div>
      </fieldset>
    </Card>
  );
}
