"use client";

import { useFormFields } from "@payloadcms/ui";

import { Banner } from "../kit/Banner";
import { shouldWarnSlugChange, slugChangeMessage } from "./categories";

export function CategorySlugWarning({
  initial,
  posts,
}: {
  initial: string;
  posts: number;
}) {
  const current = useFormFields(([fields]) => fields.slug?.value);
  const text = typeof current === "string" ? current : "";
  if (!shouldWarnSlugChange(initial, text, posts)) return null;
  return (
    <Banner icon="warning" tone="warning">
      {slugChangeMessage(initial, text.trim(), posts)}
    </Banner>
  );
}
