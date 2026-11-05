"use client";

import { useConfig, useFormFields, useLocale } from "@payloadcms/ui";
import { useEffect, useMemo, useState } from "react";

import {
  computeUrls,
  mergeSlugs,
  parentLookupPath,
  pathsOf,
  relationId,
  slugFallbackWarning,
  type ParentPaths,
  type SlugWarning,
  type UrlRow,
} from "./urls";

export type UrlSeed = {
  collection: string;
  domain?: string;
  parentId?: string;
  parentPaths: ParentPaths;
  slugs: Record<string, string>;
};

export type EditorUrls = {
  rows: UrlRow[];
  current: UrlRow | undefined;
  warning: SlugWarning | undefined;
  parentError: string | undefined;
  locales: string[];
};

const LANGUAGE_NAMES = new Intl.DisplayNames(["en"], { type: "language" });

export function useEditorUrls(seed: UrlSeed): EditorUrls {
  const {
    config: { localization, routes, serverURL },
  } = useConfig();
  const { code } = useLocale();
  const locales = useMemo(
    () => (localization ? localization.localeCodes : [code]),
    [code, localization],
  );
  const defaultLocale = localization ? localization.defaultLocale : code;
  const slug = useFormFields(([fields]) => fields.slug?.value) as
    string | undefined;
  const parentValue = useFormFields(([fields]) => fields.parent?.value);
  const parent = relationId(parentValue as Parameters<typeof relationId>[0]);
  const [found, setFound] = useState<Record<string, ParentPaths>>({});
  const [failed, setFailed] = useState<Record<string, string>>({});

  const known: Record<string, ParentPaths> = useMemo(
    () => ({
      ...found,
      ...(seed.parentId ? { [seed.parentId]: seed.parentPaths } : {}),
    }),
    [found, seed.parentId, seed.parentPaths],
  );

  useEffect(() => {
    if (!parent || known[parent] || failed[parent]) return;
    const request = new AbortController();
    const base = `${serverURL ?? ""}${routes.api}`;
    fetch(parentLookupPath(seed.collection, parent, base), {
      credentials: "include",
      signal: request.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`The parent page's address couldn't be loaded.`);
        }
        const doc: unknown = await response.json();
        setFound((all) => ({ ...all, [parent]: pathsOf(doc) }));
      })
      .catch((error: unknown) => {
        if (request.signal.aborted) return;
        setFailed((all) => ({
          ...all,
          [parent]:
            error instanceof Error
              ? error.message
              : "The parent page's address couldn't be loaded.",
        }));
      });
    return () => request.abort();
  }, [failed, known, parent, routes.api, seed.collection, serverURL]);

  const slugs = useMemo(
    () => mergeSlugs(seed.slugs, { locale: code, slug }),
    [code, seed.slugs, slug],
  );
  const rows = useMemo(
    () =>
      computeUrls({
        domain: seed.domain,
        locales,
        defaultLocale,
        slugs,
        parentPaths: parent ? known[parent] : undefined,
        parent: Boolean(parent),
      }),
    [defaultLocale, known, locales, parent, seed.domain, slugs],
  );
  const names = useMemo(
    () =>
      Object.fromEntries(
        locales.map((locale) => [locale, LANGUAGE_NAMES.of(locale) ?? locale]),
      ),
    [locales],
  );
  return {
    rows,
    current: rows.find(({ locale }) => locale === code),
    warning: slugFallbackWarning(slugs, locales, defaultLocale, names),
    parentError: parent ? failed[parent] : undefined,
    locales,
  };
}
