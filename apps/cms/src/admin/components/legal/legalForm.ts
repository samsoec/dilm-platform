import { useFormFields } from "@payloadcms/ui";

import {
  legalSnapshot,
  rowIndexOf,
  type FieldState,
  type LegalSnapshot,
} from "./legalSnapshot";

export function useLegalSnapshot(path?: string): LegalSnapshot {
  const row = rowIndexOf(path);
  const text = useFormFields(([fields]) =>
    JSON.stringify(legalSnapshot(fields as FieldState, row)),
  );
  return JSON.parse(text) as LegalSnapshot;
}

export function todayISO(now: Date = new Date()): string {
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12),
  ).toISOString();
}
