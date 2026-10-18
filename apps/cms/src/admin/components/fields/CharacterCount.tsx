"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { StaticLabel } from "payload";

function useLength(path: string): number {
  const { value } = useField<string>({ path });
  return typeof value === "string" ? value.length : 0;
}

export function CountedLabel({
  field,
  path,
  limit,
}: {
  field?: {
    name?: string;
    label?: StaticLabel;
    localized?: boolean;
    required?: boolean;
  };
  path?: string;
  limit: number;
}) {
  const fieldPath = path ?? field?.name ?? "";
  const length = useLength(fieldPath);
  return (
    <span className="dil-counted-label">
      <FieldLabel
        label={field?.label}
        localized={field?.localized}
        path={fieldPath}
        required={field?.required}
      />
      <span
        aria-live="polite"
        className={`dil-char-count__value${length > limit ? " dil-char-count__value--over" : ""}`}
      >
        {length} / {limit}
      </span>
    </span>
  );
}

export function CharacterLimit({
  path,
  limit,
  bar = false,
}: {
  path: string;
  limit: number;
  bar?: boolean;
}) {
  const length = useLength(path);
  const over = length > limit;
  if (!bar && !over) return null;
  return (
    <div className={`dil-char-count${over ? " dil-char-count--over" : ""}`}>
      {bar && (
        <span aria-hidden className="dil-char-count__bar">
          <span
            style={{ width: `${Math.min(100, (length / limit) * 100)}%` }}
          />
        </span>
      )}
      {over && (
        <span className="dil-char-count__warning">
          Search engines may cut this off after {limit} characters.
        </span>
      )}
    </div>
  );
}
