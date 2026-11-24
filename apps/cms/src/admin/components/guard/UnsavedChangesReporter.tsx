"use client";

import {
  useAllFormFields,
  useConfig,
  useDocumentInfo,
  useForm,
  useLocale,
  useFormModified,
  useModal,
  useTranslation,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { countChanges, leaveTrigger } from "./changes";
import { type DocumentName, resolveDocumentName } from "./documentName";
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

function useDocumentName(): DocumentName {
  const { collectionSlug, globalSlug, id } = useDocumentInfo();
  const { config, getEntityConfig } = useConfig();
  const { i18n } = useTranslation();
  const locale = useLocale();
  const [fields] = useAllFormFields();
  const [defaultLocaleTitle, setDefaultLocaleTitle] = useState<unknown>();
  const entity = getEntityConfig(
    collectionSlug ? { collectionSlug } : { globalSlug: globalSlug! },
  );
  const useAsTitle =
    entity && "admin" in entity
      ? (entity.admin as { useAsTitle?: string }).useAsTitle
      : undefined;
  const titleField = useAsTitle && useAsTitle !== "id" ? useAsTitle : undefined;
  const label =
    entity && "labels" in entity
      ? labelText(
          (entity.labels as { singular?: unknown }).singular,
          i18n.language,
        )
      : labelText((entity as { label?: unknown })?.label, i18n.language);
  const liveTitle = titleField ? fields[titleField]?.value : undefined;
  const defaultLocale =
    typeof config.localization === "object" && config.localization
      ? config.localization.defaultLocale
      : undefined;
  const needsFallback =
    Boolean(titleField && collectionSlug && id && defaultLocale) &&
    locale.code !== defaultLocale &&
    !(typeof liveTitle === "string" && liveTitle.trim());

  useEffect(() => {
    if (!needsFallback || !titleField) return;
    const controller = new AbortController();
    const url = `${config.serverURL}${config.routes.api}/${collectionSlug}/${id}?locale=${defaultLocale}&depth=0&fallback-locale=none`;
    fetch(url, { credentials: "include", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((doc) => setDefaultLocaleTitle(doc?.[titleField]))
      .catch(() => undefined);
    return () => controller.abort();
  }, [needsFallback, titleField, config, collectionSlug, id, defaultLocale]);

  return resolveDocumentName({
    liveTitle,
    defaultLocaleTitle: needsFallback ? defaultLocaleTitle : undefined,
    singularLabel: label,
  });
}

export function UnsavedChangesReporter() {
  const modified = useFormModified();
  const [fields] = useAllFormFields();
  const { submit } = useForm();
  const { guard, report } = useUnsavedChangesGuard();
  const { closeModal, isModalOpen } = useModal();
  const router = useRouter();
  const { title, titled } = useDocumentName();
  const lastHref = useRef<string>(undefined);

  useEffect(() => {
    report({
      modified,
      count: Math.max(countChanges(fields), modified ? 1 : 0),
      title,
      titled,
      save: async () => {
        const result = await submit();
        return Boolean(result && result.res.ok);
      },
    });
  }, [fields, modified, report, submit, title, titled]);

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
