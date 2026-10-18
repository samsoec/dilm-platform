"use client";

import { useConfig, useFormFields, useLocale } from "@payloadcms/ui";
import type { ArrayFieldClientProps } from "payload";

import { MaterialIcon } from "../MaterialIcon";

const COLUMN_LIMIT = 8;

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
  const fullColumnKey = useFormFields(([fields]) =>
    field.name === "linkColumns"
      ? Array.from({ length: fields[fieldPath]?.rows?.length ?? 0 }, (_, i) =>
          (fields[`${fieldPath}.${i}.links`]?.rows?.length ?? 0) >= COLUMN_LIMIT
            ? String(fields[`${fieldPath}.${i}.title`]?.value || "Untitled")
            : "",
        )
          .filter(Boolean)
          .join("\n")
      : "",
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
  const fullColumns = fullColumnKey ? fullColumnKey.split("\n") : [];
  if (!note && fullColumns.length === 0) return null;
  return (
    <p className="dil-array-note" role="status">
      <MaterialIcon name="block" />
      <span>
        {note && max !== undefined && note(max)}
        {fullColumns.map(
          (title) => ` “${title}” is full at ${COLUMN_LIMIT} links.`,
        )}
      </span>
    </p>
  );
}
