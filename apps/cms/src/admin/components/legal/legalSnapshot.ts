import {
  h2Headings,
  layoutFingerprint,
  textChangedSince,
  tocEntries,
  type TocEntry,
} from "../../../legal/legalText";

export type FieldState = Record<string, { value?: unknown } | undefined>;

export type LegalSnapshot = {
  changed: boolean;
  hasDate: boolean;
  headings: number;
  toc: { on: boolean; title: string; entries: TocEntry[] } | null;
};

function rowsOf(fields: FieldState): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  for (const [key, state] of Object.entries(fields)) {
    const match = /^layout\.(\d+)\.([A-Za-z]+)$/.exec(key);
    if (!match) continue;
    const index = Number(match[1]);
    rows[index] = { ...rows[index], [match[2]]: state?.value };
  }
  return Array.from(rows, (row) => row ?? {});
}

export function rowIndexOf(path: string | undefined): number | undefined {
  const match = /^layout\.(\d+)\./.exec(path ?? "");
  return match ? Number(match[1]) : undefined;
}

export function legalSnapshot(fields: FieldState, row?: number): LegalSnapshot {
  const rows = rowsOf(fields);
  const header = rows.find((entry) => entry.blockType === "articleHeader");
  const text =
    row !== undefined && rows[row]?.blockType === "richText"
      ? rows[row]
      : (rows.find(
          (entry) =>
            entry.blockType === "richText" && entry.showTableOfContents,
        ) ?? rows.find((entry) => entry.blockType === "richText"));
  const toc = text
    ? {
        on: text.showTableOfContents === true,
        title:
          typeof text.tocTitle === "string" && text.tocTitle.trim() !== ""
            ? text.tocTitle
            : "On this page",
        entries: tocEntries(text.body),
      }
    : null;
  return {
    changed: header
      ? textChangedSince(
          header.textStamp,
          layoutFingerprint(rows),
          header.lastUpdated,
        )
      : false,
    hasDate: Boolean(header?.lastUpdated),
    headings: text ? h2Headings(text.body).length : 0,
    toc,
  };
}
