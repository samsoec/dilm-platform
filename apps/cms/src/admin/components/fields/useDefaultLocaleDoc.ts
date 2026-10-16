"use client";

import { useConfig, useDocumentInfo, useLocale } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useState } from "react";

const requests = new Map<string, Promise<unknown>>();

export function useDefaultLocaleDoc(): unknown {
  const { config } = useConfig();
  const { id, collectionSlug, data } = useDocumentInfo();
  const { code } = useLocale();
  const [doc, setDoc] = useState<unknown>();

  const defaultLocale = config.localization
    ? config.localization.defaultLocale
    : undefined;
  const editingOtherLocale = Boolean(defaultLocale) && code !== defaultLocale;
  const url =
    editingOtherLocale && id !== undefined && collectionSlug
      ? `${formatAdminURL({
          apiRoute: config.routes.api,
          path: `/${collectionSlug}/${id}`,
        })}?locale=${defaultLocale}&depth=0`
      : undefined;
  const key = url && `${url}#${String(data?.updatedAt ?? "")}`;

  useEffect(() => {
    if (!url || !key) return;
    let current = true;
    if (!requests.has(key)) {
      requests.set(
        key,
        fetch(url, { credentials: "include" }).then((response) =>
          response.ok ? response.json() : undefined,
        ),
      );
    }
    void requests.get(key)!.then((value) => {
      if (current) setDoc(value);
    });
    return () => {
      current = false;
    };
  }, [key, url]);

  return url ? doc : undefined;
}
