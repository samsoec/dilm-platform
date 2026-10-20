import type { DocumentViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { Tag } from "../kit/Tag";
import { MaterialIcon } from "../MaterialIcon";
import {
  CONSENT_TYPE_ICONS,
  CONSENT_TYPE_LABELS,
  timestampText,
} from "./consent";
import { ConsentStepNav } from "./ConsentStepNav";
import { relatedApplicationURL } from "./related";

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function ConsentRecordView({
  doc,
  payload,
}: DocumentViewServerProps) {
  const listPath = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: "/collections/consent-logs",
  });
  const consentType = text(doc.consentType);
  const related = text(doc.relatedRecordId);
  const relatedURL = await relatedApplicationURL(payload, consentType, related);
  const stamp = timestampText(doc.timestamp);

  return (
    <div className="dil-consent-record">
      <ConsentStepNav
        label={stamp}
        listLabel="Consent records"
        listURL={listPath}
      />
      <a className="dil-app__back" href={listPath}>
        <MaterialIcon name="arrow_back" />
        Consent records
      </a>
      <header className="dil-consent-record__header">
        <h1>
          {stamp} <span className="dil-consent-record__zone">WIB</span>
        </h1>
        <Tag icon="lock">Read-only · UU PDP audit trail</Tag>
      </header>
      <section className="dil-app-card">
        <header className="dil-app-card__header">
          <h2>Consent record</h2>
          <span className="dil-app-card__tag">
            <MaterialIcon name="settings" />
            Written by the system
          </span>
        </header>
        <dl className="dil-app-card__list">
          <dt>Timestamp</dt>
          <dd>{stamp} WIB (Asia/Jakarta)</dd>
          <dt>Consent type</dt>
          <dd className="dil-consent__type">
            <MaterialIcon
              name={CONSENT_TYPE_ICONS[consentType] ?? "verified_user"}
            />
            {CONSENT_TYPE_LABELS[consentType] ?? consentType}
          </dd>
          <dt>Policy version</dt>
          <dd>
            <code className="dil-consent__mono">{text(doc.policyVersion)}</code>
          </dd>
          <dt>Related record</dt>
          <dd>
            {relatedURL ? (
              <a
                className="dil-consent__mono dil-consent__related"
                href={relatedURL}
              >
                {related}
              </a>
            ) : (
              <code className="dil-consent__mono">{related}</code>
            )}
          </dd>
        </dl>
      </section>
      <p className="dil-consent-record__note">
        <MaterialIcon name="shield" />
        No IP address is ever stored. Nobody can add, edit or delete consent
        records, including Super Admins.
      </p>
    </div>
  );
}
