"use client";

import { useFormFields } from "@payloadcms/ui";

import {
  overrideNote,
  OVERRIDE_FIELDS,
  type OverrideField,
} from "../../recordPicker";
import { useLinkTarget, type LinkTargetRef } from "../fields/useLinkTarget";

export function OverrideFallback({ path }: { path: string }) {
  const cut = path.lastIndexOf(".");
  const parent = path.slice(0, cut);
  const name = path.slice(cut + 1);
  const field = (OVERRIDE_FIELDS as readonly string[]).includes(name)
    ? (name as OverrideField)
    : undefined;
  const own = useFormFields(([fields]) => fields[path]?.value);
  const target = useFormFields(
    ([fields]) => fields[`${parent}.doc`]?.value,
  ) as LinkTargetRef;
  const { doc } = useLinkTarget(target);
  if (!field) return null;
  const note = overrideNote(field, own, doc);
  if (!note.inherited) return null;
  return <span className="dil-override-fallback">{note.text}</span>;
}
