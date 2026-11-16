"use client";

import { useFormFields } from "@payloadcms/ui";

import { Banner } from "../kit/Banner";
import { Tag } from "../kit/Tag";
import {
  changed,
  dialogSummary,
  firstPath,
  LOCALE_NAMES,
  PUBLICATION_URLS_UNCHANGED,
  PUBLICATION_USED_BY,
  SETTING_COPY,
  sitesText,
  urlPattern,
  type RoutingImpact,
  type RoutingSetting,
} from "./routing";
import { PICKER_PATHS, useRoutingImpact } from "./useRoutingImpact";

function idOf(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(
    typeof value === "object" ? (value as { id?: unknown }).id : value,
  );
}

function Patterns({ impact }: { impact: RoutingImpact }) {
  if (impact.setting === "publicationPage") return null;
  const copy = SETTING_COPY[impact.setting];
  const page = impact.next;
  if (!page) {
    return (
      <p className="dil-routing-note__line">
        No page is picked, so {copy.plural} have no URL.
      </p>
    );
  }
  return (
    <ul className="dil-routing-note__patterns">
      {impact.locales.map((locale) => (
        <li key={locale}>
          <span className="dil-routing-note__locale">
            {LOCALE_NAMES[locale] ?? locale}
          </span>
          <code>{urlPattern(firstPath(page, locale))}</code>
        </li>
      ))}
    </ul>
  );
}

function Counts({ impact }: { impact: RoutingImpact }) {
  if (impact.setting === "publicationPage") return null;
  const copy = SETTING_COPY[impact.setting];
  const shared = impact.setting !== "careerPage";
  const where = sitesText(impact.domains, shared);
  const noun = impact.total === 1 ? copy.singular : copy.plural;
  return (
    <p className="dil-routing-note__line">
      {impact.total} {noun} on {where} follow this page.
    </p>
  );
}

export function RoutingNote({ setting }: { setting: RoutingSetting }) {
  const page = useFormFields(([fields]) =>
    idOf(fields[PICKER_PATHS[setting]]?.value),
  );
  const moved = useFormFields(([fields]) => {
    const field = fields[PICKER_PATHS[setting]];
    return Boolean(field) && changed(field?.initialValue, field?.value);
  });
  const { impact, failed } = useRoutingImpact(setting, page);

  if (failed) {
    return (
      <Banner className="dil-routing-note" tone="warning">
        Couldn&apos;t load the page details. Saving still checks the page.
      </Banner>
    );
  }
  if (!impact) return null;

  if (setting === "publicationPage") {
    return (
      <div className="dil-routing-note">
        {impact.next ? (
          <p className="dil-routing-note__line">
            Page path:{" "}
            {impact.locales.map((locale) => (
              <code key={locale}>{firstPath(impact.next, locale)}</code>
            ))}
          </p>
        ) : (
          <p className="dil-routing-note__line">No page is picked yet.</p>
        )}
        <p className="dil-routing-note__line">
          Used by{" "}
          {PUBLICATION_USED_BY.map((place) => (
            <Tag key={place}>{place}</Tag>
          ))}
        </p>
        <p className="dil-routing-note__line">{PUBLICATION_URLS_UNCHANGED}</p>
      </div>
    );
  }

  return (
    <div className="dil-routing-note">
      <Patterns impact={impact} />
      <Counts impact={impact} />
      {moved && (
        <Banner className="dil-routing-note__impact" tone="warning">
          {dialogSummary(setting, impact)}
        </Banner>
      )}
    </div>
  );
}
