"use client";

import { useConfig, useFormFields, useLocale } from "@payloadcms/ui";
import type { ArrayFieldClientProps } from "payload";

import { MaterialIcon } from "../MaterialIcon";

const LIMIT_NOTES: Record<string, (max: number) => string> = {
  navItems: (max) =>
    `Add menu item is unavailable. The navbar fits ${max} items; remove one to add another.`,
  children: (max) => `A dropdown holds up to ${max} links.`,
  linkColumns: (max) => `The footer fits ${max} columns.`,
  links: (max) => `A column holds up to ${max} links.`,
};

export function ArrayLimitNote({ field, path }: ArrayFieldClientProps) {
  const fieldPath = path ?? field.name;
  const rows = useFormFields(
    ([fields]) => fields[fieldPath]?.rows?.length ?? 0,
  );
  const { code } = useLocale();
  const {
    config: { localization },
  } = useConfig();
  const defaultLocale = localization ? localization.defaultLocale : code;

  if (code !== defaultLocale) {
    return (
      <p className="dil-array-note">
        <MaterialIcon name="lock" />
        Add, remove and reorder are available in {defaultLocale.toUpperCase()}
      </p>
    );
  }

  const max = field.maxRows;
  const note =
    max !== undefined && rows >= max ? LIMIT_NOTES[field.name] : undefined;
  if (!note || max === undefined) return null;
  return (
    <p className="dil-array-note" role="status">
      <MaterialIcon name="info" />
      {note(max)}
    </p>
  );
}
