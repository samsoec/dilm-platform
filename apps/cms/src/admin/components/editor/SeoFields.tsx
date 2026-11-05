"use client";

import {
  FieldError,
  FieldLabel,
  TextareaInput,
  TextInput,
  useDocumentInfo,
  useField,
  useFormFields,
  useLocale,
} from "@payloadcms/ui";
import type { ChangeEvent } from "react";
import { useConfig } from "@payloadcms/ui";

import { CharacterLimit } from "../fields/CharacterCount";
import {
  FALLBACK_NOTE,
  searchSnippet,
  seoView,
  USING_DEFAULT,
  type SeoDefaults,
} from "./seo";
import { useEditorUrls, type UrlSeed } from "./useEditorUrls";

type Kind = "title" | "description";

const LIMITS = { title: 60, description: 160 } as const;

function useSeoContext() {
  const { code } = useLocale();
  const {
    config: { localization },
  } = useConfig();
  return {
    locale: code,
    defaultLocale: localization ? localization.defaultLocale : code,
  };
}

export function SeoTextField({
  path,
  kind,
  label,
  defaults,
}: {
  path: string;
  kind: Kind;
  label: string;
  defaults: SeoDefaults;
}) {
  const { value, setValue, showError } = useField<string>({ path });
  const { hasSavePermission } = useDocumentInfo();
  const { locale, defaultLocale } = useSeoContext();
  const pageTitle = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const view = seoView(
    { [kind]: value } as { title?: string; description?: string },
    defaults,
    { locale, defaultLocale, pageTitle },
  );
  const text = view[kind];
  const readOnly = hasSavePermission === false;
  const limit = LIMITS[kind];
  const aside =
    kind === "description" && text.usingDefault && text.fallback
      ? USING_DEFAULT
      : `${text.length} / ${limit}`;

  const labelNode = (
    <span className="dil-seo-label">
      <FieldLabel label={label} localized path={path} />
      <span
        aria-live="polite"
        className={`dil-seo-label__aside${text.over ? " dil-seo-label__aside--over" : ""}`}
      >
        {aside}
      </span>
    </span>
  );

  const shared = {
    AfterInput: <CharacterLimit limit={limit} path={path} />,
    Description:
      kind === "description" ? (
        <p className="dil-seo-note">{FALLBACK_NOTE}</p>
      ) : undefined,
    Error: <FieldError path={path} showError={showError} />,
    Label: labelNode,
    localized: true,
    path,
    placeholder: text.fallback || undefined,
    readOnly,
    showError,
    value: value ?? "",
  };

  return (
    <div
      className={`field-type dil-seo-field dil-seo-field--${kind}${showError ? " error" : ""}`}
    >
      {kind === "title" ? (
        <TextInput
          {...shared}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setValue(event.target.value)
          }
        />
      ) : (
        <TextareaInput
          {...shared}
          onChange={(event) => setValue(event.target.value)}
          rows={3}
        />
      )}
    </div>
  );
}

export function SeoPreview({
  seed,
  defaults,
}: {
  seed: UrlSeed;
  defaults: SeoDefaults;
}) {
  const { locale, defaultLocale } = useSeoContext();
  const title = useFormFields(([fields]) => fields["meta.title"]?.value) as
    string | undefined;
  const description = useFormFields(
    ([fields]) => fields["meta.description"]?.value,
  ) as string | undefined;
  const pageTitle = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const { current } = useEditorUrls(seed);
  const view = seoView({ title, description }, defaults, {
    locale,
    defaultLocale,
    pageTitle,
  });
  const snippet = searchSnippet({
    domain: seed.domain,
    path: current?.path ?? "/",
    locale,
    title: view.title.shown,
    description: view.description.shown,
  });
  return (
    <section aria-labelledby="dil-seo-preview" className="dil-seo-preview">
      <h2 className="dil-seo-preview__heading" id="dil-seo-preview">
        Search result preview
      </h2>
      <div className="dil-seo-preview__card">
        <p className="dil-seo-preview__trail">{snippet.trail.join(" › ")}</p>
        <p className="dil-seo-preview__title">{snippet.title}</p>
        <p className="dil-seo-preview__description">{snippet.description}</p>
      </div>
    </section>
  );
}
