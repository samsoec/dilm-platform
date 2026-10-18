"use client";

import { useFormFields } from "@payloadcms/ui";

import { isSameAsDefault, valueAtPath } from "../../layoutEditor";
import { SameAsEn } from "../kit/Tag";
import { useDefaultLocaleDoc } from "./useDefaultLocaleDoc";

export function SameAsEnBadge() {
  return (
    <span className="dil-same-tag">
      <SameAsEn />
    </span>
  );
}

export function useSameAsDefault(path: string, value: unknown): boolean {
  const defaultDoc = useDefaultLocaleDoc();
  return (
    defaultDoc !== undefined &&
    isSameAsDefault(value, valueAtPath(defaultDoc, path))
  );
}

export function SameAsEnTag({ path }: { path: string }) {
  const value = useFormFields(([fields]) => fields[path]?.value);
  const defaultDoc = useDefaultLocaleDoc();
  const same = useSameAsDefault(path, value);
  if (defaultDoc === undefined) return null;
  const english = valueAtPath(defaultDoc, path);
  return (
    <span className="dil-en-reference">
      {same && <SameAsEnBadge />}
      {typeof english === "string" && english !== "" && (
        <span className="dil-en-reference__text">EN: {english}</span>
      )}
    </span>
  );
}
