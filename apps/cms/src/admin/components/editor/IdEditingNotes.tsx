"use client";

import { useFormFields } from "@payloadcms/ui";
import { useEffect } from "react";

import { Banner } from "../kit/Banner";
import { useDefaultLocaleDoc } from "../fields/useDefaultLocaleDoc";
import { useTabButtons } from "./EditorTabs";
import { MISSING_SLUG_NOTE, SECTIONS_LOCKED_BANNER } from "./editor";

export function IdEditingNotes() {
  const slug = useFormFields(([fields]) => fields.slug?.value);
  const defaultDoc = useDefaultLocaleDoc() as
    { slug?: string | null } | undefined;
  const buttons = useTabButtons();

  useEffect(() => {
    document.documentElement.dataset.structureLocked = "true";
    return () => {
      delete document.documentElement.dataset.structureLocked;
    };
  }, []);

  const missing = Boolean(defaultDoc?.slug) && !slug;
  return (
    <>
      <Banner className="dil-locale-banner" icon="translate" tone="info">
        {SECTIONS_LOCKED_BANNER}
      </Banner>
      {missing && (
        <Banner icon="link" tone="warning">
          {MISSING_SLUG_NOTE}{" "}
          <button
            className="dil-link-button"
            onClick={() => buttons[1]?.click()}
            type="button"
          >
            Open Page settings
          </button>
        </Banner>
      )}
    </>
  );
}
