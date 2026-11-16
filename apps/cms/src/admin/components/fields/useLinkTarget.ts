"use client";

import { useLocale } from "@payloadcms/ui";
import { useEffect, useState } from "react";

import { isReferenceCollection, type PickerDoc } from "../../linkPicker";

export type LinkTargetRef = { relationTo?: string; value?: unknown } | null;

export function refId(reference: LinkTargetRef | undefined) {
  const value = reference?.value;
  if (value === null || value === undefined || value === "") return undefined;
  return String(
    typeof value === "object" ? (value as { id: number | string }).id : value,
  );
}

type Loaded = { key: string; doc: PickerDoc | null };

export function useLinkTarget(reference: LinkTargetRef | undefined): {
  doc: PickerDoc | null | undefined;
  loading: boolean;
} {
  const { code } = useLocale();
  const relationTo = reference?.relationTo;
  const id = refId(reference);
  const key = relationTo && id ? `${relationTo}:${id}:${code}` : "";
  const [loaded, setLoaded] = useState<Loaded>();

  useEffect(() => {
    if (!key || !isReferenceCollection(relationTo)) return;
    const controller = new AbortController();
    fetch(
      `/api/${relationTo}/${id}?depth=1&draft=true&locale=${code}&trash=true`,
      { credentials: "include", signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((doc) => setLoaded({ key, doc: doc as PickerDoc | null }))
      .catch(() => undefined);
    return () => controller.abort();
  }, [key, relationTo, id, code]);

  if (!key) return { doc: undefined, loading: false };
  if (loaded?.key !== key) return { doc: undefined, loading: true };
  return { doc: loaded.doc, loading: false };
}
