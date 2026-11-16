"use client";

import { useConfig, useForm, useLocale } from "@payloadcms/ui";

import {
  LEGAL_DATE_QUESTION,
  PUBLISH_AS_IS,
  SET_TODAY_AND_PUBLISH,
} from "../../../legal/legalText";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { todayISO } from "./legalForm";

export function LegalDateConfirm({
  slug,
  onContinue,
}: {
  slug: string;
  onContinue: () => void;
}) {
  const { getFields, dispatchFields } = useForm();
  const { code } = useLocale();
  const {
    config: { localization },
  } = useConfig();
  const defaultCode =
    localization === false ? code : localization.defaultLocale;
  const canSetDate = code === defaultCode;

  const setToday = () => {
    const fields = getFields() as Record<string, { value?: unknown }>;
    const key = Object.keys(fields).find(
      (name) =>
        /^layout\.\d+\.blockType$/.test(name) &&
        fields[name]?.value === "articleHeader",
    );
    if (key) {
      dispatchFields({
        type: "UPDATE",
        path: key.replace(/blockType$/, "lastUpdated"),
        value: todayISO(),
      });
    }
    onContinue();
  };

  return (
    <ConfirmDialog
      body={<p>{LEGAL_DATE_QUESTION}</p>}
      confirmLabel={canSetDate ? SET_TODAY_AND_PUBLISH : PUBLISH_AS_IS}
      icon="help"
      onConfirm={canSetDate ? setToday : onContinue}
      secondary={
        canSetDate ? { label: PUBLISH_AS_IS, onClick: onContinue } : undefined
      }
      slug={slug}
      title="Update the Last updated date?"
      tone="go-live"
    />
  );
}
