"use client";

import {
  useAllFormFields,
  useDocumentInfo,
  useFormFields,
  useLocale,
} from "@payloadcms/ui";

import { docPath } from "../../linkPicker";
import {
  bannerText,
  CONSENT_NOTES,
  cookiePolicyCheckLine,
  firstLinkedPageId,
  NOT_FOUND_RESPONSE,
  notFoundUrl,
  policyVersionChanged,
  policyVersionWarning,
  siteMessagesSubtitle,
} from "../../siteMessages";
import { useLinkTarget } from "../fields/useLinkTarget";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { Banner } from "../kit/Banner";
import { MaterialIcon } from "../MaterialIcon";

function useText(path: string): string {
  const value = useFormFields(([fields]) => fields[path]?.value);
  return typeof value === "string" ? value : "";
}

export function SiteMessagesIntro() {
  const { company } = useUnsavedChangesGuard();
  return (
    <p className="dil-tab-intro">{siteMessagesSubtitle(company?.domain)}</p>
  );
}

export function CookiePolicyCheck() {
  const body = useFormFields(([fields]) => fields["cookieBanner.body"]?.value);
  const { code } = useLocale();
  const id = firstLinkedPageId(body);
  const { doc } = useLinkTarget(
    id ? { relationTo: "pages", value: id } : undefined,
  );
  if (!id) return null;
  return (
    <p className="dil-cookie-check">
      <MaterialIcon name="check_circle" />
      {cookiePolicyCheckLine(doc ? docPath(doc, code) : "")}
    </p>
  );
}

export function PolicyVersionWarning() {
  const { data } = useDocumentInfo();
  const { company } = useUnsavedChangesGuard();
  const now = useFormFields(
    ([fields]) => fields["cookieBanner.policyVersion"]?.value,
  );
  const was = (data as { cookieBanner?: { policyVersion?: unknown } })
    ?.cookieBanner?.policyVersion;
  const change = policyVersionChanged(was, now);
  if (!change.changed || data?.id === undefined) return null;
  return (
    <Banner className="dil-policy-warning" tone="warning">
      {policyVersionWarning(change.was, company?.domain)}
    </Banner>
  );
}

function useButtonLabels(): string[] {
  const [fields] = useAllFormFields();
  return Object.keys(fields)
    .map((key) => /^notFound\.buttons\.(\d+)\.link\.label$/.exec(key))
    .filter((match): match is RegExpExecArray => match !== null)
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((match) => String(fields[match[0]]?.value ?? ""))
    .filter((label) => label !== "");
}

export function NotFoundPreview() {
  const code = useText("notFound.code");
  const title = useText("notFound.title");
  const description = useText("notFound.description");
  const labels = useButtonLabels();
  const { code: locale } = useLocale();
  const { company } = useUnsavedChangesGuard();
  return (
    <section className="dil-side-panel dil-msg-preview">
      <h3 className="dil-side-panel__title">
        <MaterialIcon name="block" />
        404 page
        {company?.domain && (
          <a
            className="dil-msg-preview__open"
            href={notFoundUrl(company.domain, locale)}
            rel="noopener"
            target="_blank"
          >
            Open
          </a>
        )}
      </h3>
      <div className="dil-msg-preview__page">
        <p className="dil-msg-preview__code">{code || "404"}</p>
        <p className="dil-msg-preview__title">{title}</p>
        {description && <p className="dil-msg-preview__text">{description}</p>}
        {labels.length > 0 && (
          <p className="dil-msg-preview__buttons">
            {labels.map((label, index) => (
              <span
                className={
                  index === 0
                    ? "dil-msg-preview__button dil-msg-preview__button--primary"
                    : "dil-msg-preview__button"
                }
                key={`${index}-${label}`}
              >
                {label}
              </span>
            ))}
          </p>
        )}
        <p aria-hidden className="dil-msg-preview__footer">
          Footer
        </p>
      </div>
      <p className="dil-msg-preview__note">{NOT_FOUND_RESPONSE}</p>
    </section>
  );
}

export function CookieBannerPreview() {
  const title = useText("cookieBanner.title");
  const accept = useText("cookieBanner.acceptLabel");
  const reject = useText("cookieBanner.rejectLabel");
  const body = useFormFields(([fields]) => fields["cookieBanner.body"]?.value);
  const text = bannerText(body);
  return (
    <section className="dil-side-panel dil-msg-preview">
      <h3 className="dil-side-panel__title">
        <MaterialIcon name="campaign" />
        Cookie banner
      </h3>
      <div className="dil-msg-preview__banner">
        <p className="dil-msg-preview__title">{title}</p>
        {text && <p className="dil-msg-preview__text">{text}</p>}
        <p className="dil-msg-preview__buttons">
          {reject && <span className="dil-msg-preview__button">{reject}</span>}
          {accept && (
            <span className="dil-msg-preview__button dil-msg-preview__button--primary">
              {accept}
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

export function ConsentNotes() {
  return (
    <section className="dil-side-panel dil-msg-notes">
      <h3 className="dil-side-panel__title">
        <MaterialIcon name="info" />
        How consent works
      </h3>
      <ul className="dil-msg-notes__list">
        {CONSENT_NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}
