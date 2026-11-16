"use client";

import { useField, useFormFields, useLocale } from "@payloadcms/ui";
import { useEffect, useState } from "react";

import { MaterialIcon } from "../MaterialIcon";
import { newestPostText } from "./publication";

export function FeaturedNewest({ path = "" }: { path?: string }) {
  const { value } = useField<unknown>({ path });
  const { code } = useLocale();
  const tenant = useFormFields(([fields]) => fields.tenant?.value);
  const [title, setTitle] = useState<string | null>(null);
  const picked = Array.isArray(value) ? value.length > 0 : Boolean(value);
  const company =
    tenant === undefined || tenant === null || tenant === ""
      ? undefined
      : String(tenant);

  useEffect(() => {
    if (picked || !company) return;
    const params = new URLSearchParams({
      limit: "1",
      depth: "0",
      sort: "-publishedAt",
      locale: code,
      "where[_status][equals]": "published",
      "where[tenant][equals]": company,
    });
    fetch(`/api/posts?${params}`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then(({ docs }: { docs?: { title?: string | null }[] }) =>
        setTitle(docs?.[0]?.title ?? null),
      )
      .catch(() => setTitle(null));
  }, [picked, company, code]);

  if (picked) return null;
  return (
    <p className="dil-field-note" role="status">
      <MaterialIcon name="article" />
      {newestPostText(title)}
    </p>
  );
}
