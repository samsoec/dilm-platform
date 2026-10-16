"use client";

import { useFormFields } from "@payloadcms/ui";
import type { ArrayFieldLabelClientComponent } from "payload";

import { countText } from "../../layoutEditor";

function labelText(label: unknown, name: string): string {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const byLanguage = label as Record<string, string>;
    return byLanguage.en ?? Object.values(byLanguage)[0] ?? name;
  }
  return name;
}

export const ArrayCountLabel: ArrayFieldLabelClientComponent = ({
  field,
  path,
}) => {
  const name = field?.name ?? "";
  const fieldPath = path ?? name;
  const count = useFormFields(
    ([fields]) => fields[fieldPath]?.rows?.length ?? 0,
  );
  return (
    <span className="dil-array-count">
      {countText(
        labelText(field?.label, name),
        count,
        field?.maxRows,
        fieldPath.includes("."),
      )}
    </span>
  );
};
