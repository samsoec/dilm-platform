"use client";

import {
  useAllFormFields,
  useConfig,
  useDocumentInfo,
  useForm,
  useFormModified,
  useModal,
  useTranslation,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { countChanges, leaveTrigger } from "./changes";
import { useUnsavedChangesGuard } from "./UnsavedChangesProvider";

const NATIVE_LEAVE_SLUG = "leave-without-saving";

function labelText(label: unknown, language: string): string | undefined {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const byLanguage = label as Record<string, string>;
    return byLanguage[language] ?? byLanguage.en;
  }
  return undefined;
}

function useDocumentName(): string {
  const { collectionSlug, globalSlug, title } = useDocumentInfo();
  const { getEntityConfig } = useConfig();
  const { i18n } = useTranslation();
  const entity = getEntityConfig(
    collectionSlug ? { collectionSlug } : { globalSlug: globalSlug! },
  );
  const useAsTitle =
    entity && "admin" in entity
      ? (entity.admin as { useAsTitle?: string }).useAsTitle
      : undefined;
  const label =
    entity && "labels" in entity
      ? labelText(
          (entity.labels as { singular?: unknown }).singular,
          i18n.language,
        )
      : labelText((entity as { label?: unknown })?.label, i18n.language);
  if (useAsTitle && useAsTitle !== "id" && title) return title;
  return label ?? title ?? "document";
}

export function UnsavedChangesReporter() {
  const modified = useFormModified();
  const [fields] = useAllFormFields();
  const { submit } = useForm();
  const { guard, report } = useUnsavedChangesGuard();
  const { closeModal, isModalOpen } = useModal();
  const router = useRouter();
  const title = useDocumentName();
  const lastHref = useRef<string>(undefined);

  useEffect(() => {
    report({
      modified,
      count: Math.max(countChanges(fields), modified ? 1 : 0),
      title,
      save: async () => {
        const result = await submit();
        return Boolean(result && result.res.ok);
      },
    });
  }, [fields, modified, report, submit, title]);

  useEffect(() => () => report(undefined), [report]);

  useEffect(() => {
    const remember = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (anchor?.href) lastHref.current = anchor.href;
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, []);

  const nativeOpen = isModalOpen(NATIVE_LEAVE_SLUG);
  useEffect(() => {
    if (!nativeOpen) return;
    closeModal(NATIVE_LEAVE_SLUG);
    const href = lastHref.current;
    if (!href) return;
    guard(leaveTrigger(window.location.href, href), () => router.push(href));
  }, [closeModal, guard, nativeOpen, router]);

  return null;
}
