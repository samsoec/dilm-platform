"use client";

import { useConfig, useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useState } from "react";

import type { RoutingImpact, RoutingSetting } from "./routing";

export const PICKER_PATHS: Record<RoutingSetting, string> = {
  productsPage: "productsPage",
  solutionsPage: "solutionsPage",
  careerPage: "routing.careerPage",
  publicationPage: "routing.publicationPage",
};

function idOf(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(
    typeof value === "object" ? (value as { id?: unknown }).id : value,
  );
}

export type RoutingContext = {
  api: string;
  serverURL: string | undefined;
  tenant: string;
  doc: string;
};

export function useRoutingContext(): RoutingContext {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const { id } = useDocumentInfo();
  const tenant = useFormFields(([fields]) => idOf(fields.tenant?.value));
  return {
    api: routes.api,
    serverURL,
    tenant,
    doc: id === undefined ? "" : String(id),
  };
}

export async function fetchRoutingImpact(
  context: RoutingContext,
  setting: RoutingSetting,
  page: string,
  signal?: AbortSignal,
): Promise<RoutingImpact> {
  const params = new URLSearchParams({ setting });
  if (page) params.set("page", page);
  if (context.tenant) params.set("tenant", context.tenant);
  else if (context.doc) params.set("doc", context.doc);
  const url = formatAdminURL({
    apiRoute: context.api,
    serverURL: context.serverURL,
    path: `/routing-impact?${params.toString()}`,
  });
  const response = await fetch(url, { credentials: "include", signal });
  if (!response.ok) throw new Error(String(response.status));
  return (await response.json()) as RoutingImpact;
}

export function useRoutingImpact(setting: RoutingSetting, page: string) {
  const { api, serverURL, tenant, doc } = useRoutingContext();
  const [impact, setImpact] = useState<RoutingImpact>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const shared = setting === "productsPage" || setting === "solutionsPage";
    if (!shared && !tenant && !doc) return;
    const controller = new AbortController();
    setFailed(false);
    fetchRoutingImpact(
      { api, serverURL, tenant, doc },
      setting,
      page,
      controller.signal,
    )
      .then(setImpact)
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, [api, serverURL, setting, page, tenant, doc]);

  return { impact, failed };
}
