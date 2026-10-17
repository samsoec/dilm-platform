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
  return useSameAsDefault(path, value) ? <SameAsEnBadge /> : null;
}
