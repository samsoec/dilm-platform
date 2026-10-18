"use client";

import { useEffect, useState } from "react";

import {
  documentEntries,
  type FoundDoc,
  type PaletteEntry,
  SEARCH_DEBOUNCE_MS,
  type SearchSource,
  searchURL,
  type TenantID,
} from "./search";

export type ResultGroup = { source: SearchSource; entries: PaletteEntry[] };

export type DocumentSearch = {
  status: "idle" | "loading" | "done";
  groups: ResultGroup[];
  failed: boolean;
};

const IDLE: DocumentSearch = { status: "idle", groups: [], failed: false };

async function findIn(
  source: SearchSource,
  url: string,
  adminRoute: string,
  signal: AbortSignal,
): Promise<ResultGroup | "failed"> {
  try {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) return "failed";
    const { docs } = (await response.json()) as { docs?: FoundDoc[] };
    return { source, entries: documentEntries(source, docs ?? [], adminRoute) };
  } catch {
    return "failed";
  }
}

export function useDocumentSearch({
  sources,
  query,
  tenant,
  locale,
  apiURL,
  adminRoute,
  attempt = 0,
}: {
  sources: SearchSource[];
  query: string;
  tenant: TenantID | undefined;
  locale: string | undefined;
  apiURL: string;
  adminRoute: string;
  attempt?: number;
}): DocumentSearch {
  const [search, setSearch] = useState<DocumentSearch>(IDLE);
  const trimmed = query.trim();
  const searchable =
    trimmed !== "" && tenant !== undefined && sources.length > 0;

  useEffect(() => {
    if (!searchable) {
      setSearch(IDLE);
      return;
    }
    setSearch((current) => ({ ...current, status: "loading" }));
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const results = await Promise.all(
        sources.map((source) =>
          findIn(
            source,
            searchURL({ apiURL, source, query: trimmed, tenant, locale }),
            adminRoute,
            controller.signal,
          ),
        ),
      );
      if (controller.signal.aborted) return;
      setSearch({
        status: "done",
        groups: results.filter(
          (result): result is ResultGroup =>
            result !== "failed" && result.entries.length > 0,
        ),
        failed: results.includes("failed"),
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    adminRoute,
    apiURL,
    attempt,
    locale,
    searchable,
    sources,
    tenant,
    trimmed,
  ]);

  return searchable ? search : IDLE;
}
