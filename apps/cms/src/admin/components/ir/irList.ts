import type { Where } from "payload";

import { flatWhere } from "../lists/cvFilters";

export type IrFilters = { type?: string; locale?: string };

function equalsValue(where: Where, field: string): string | undefined {
  const condition = where[field] as { equals?: unknown } | undefined;
  return typeof condition?.equals === "string" ? condition.equals : undefined;
}

export function irFilters(where: Where | undefined): IrFilters {
  const flat = flatWhere(where);
  return {
    type: equalsValue(flat, "documentType"),
    locale: equalsValue(flat, "locale"),
  };
}

export function irWhere({ type, locale }: IrFilters): Where {
  const conditions: Where[] = [
    ...(type ? [{ documentType: { equals: type } }] : []),
    ...(locale ? [{ locale: { equals: locale } }] : []),
  ];
  return conditions.length ? { and: conditions } : {};
}

export function irFooterText(total: number, company?: string): string {
  const count = `${total} ${total === 1 ? "document" : "documents"}`;
  return company ? `${count} · ${company} only` : count;
}

export type LiveStatus = {
  status: "draft" | "published" | "trashed";
  pendingDraft: boolean;
};

export function liveStatus(
  displayed: unknown,
  deletedAt: unknown,
  liveRowStatus?: unknown,
): LiveStatus {
  if (deletedAt) return { status: "trashed", pendingDraft: false };
  if (displayed === "changed") {
    return liveRowStatus === "published"
      ? { status: "published", pendingDraft: true }
      : { status: "draft", pendingDraft: false };
  }
  return {
    status: displayed === "published" ? "published" : "draft",
    pendingDraft: false,
  };
}
