import {
  type ColumnValue,
  linkTarget,
  type LinkValue,
  type NavItemValue,
  navItemTitle,
  rowNumberText,
} from "../../layoutEditor";

export type SummaryLine = { key: string; text: string };

type Data = Record<string, unknown>;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "root" in value) {
    return (
      JSON.stringify(value)
        .match(/"text":"([^"]*)"/g)
        ?.map((part) => part.slice(8, -1))
        .join("") ?? ""
    );
  }
  return "";
}

function quoted(value: unknown): string {
  const plain = text(value).trim();
  return plain ? `"${plain}"` : "—";
}

function onOff(value: unknown): string {
  return value ? "On" : "Off";
}

function single(key: string, label: string, value: string): SummaryLine {
  return { key, text: `${label} · ${value}` };
}

function headerLines(data: Data): SummaryLine[] {
  const items = asArray<NavItemValue>(data.navItems).map((item, index) => {
    const row = `${rowNumberText(index)} ${navItemTitle(item) || "Untitled"}`;
    const target = item.type === "dropdown" ? "" : linkTarget(item.link);
    const line = target ? `${row} · ${target}` : row;
    return { key: line, text: line };
  });
  const cta = data.cta as { enabled?: boolean; link?: LinkValue } | undefined;
  return [
    ...items,
    single("search", "Search", onOff(data.showSearch)),
    single("language", "Language switcher", onOff(data.showLanguageSwitcher)),
    single("cta", "CTA", cta?.enabled ? quoted(cta.link?.label) : "Off"),
  ];
}

function footerLines(data: Data): SummaryLine[] {
  const band = (data.ctaBand ?? {}) as Data;
  const columns = asArray<ColumnValue>(data.linkColumns).map(
    (column, index) => {
      const line = `${rowNumberText(index)} ${column.title || "Untitled"} · ${
        column.links?.length ?? 0
      } links`;
      return { key: line, text: line };
    },
  );
  const partOf = (data.partOf ?? {}) as Data;
  return [
    single("heading", "Heading", quoted(band.heading)),
    ...columns,
    single("part-of", "Part of", partOf.enabled ? quoted(partOf.label) : "Off"),
    single("copyright", "Copyright", quoted(data.copyright)),
  ];
}

const SETTINGS_FIELDS: [string, string][] = [
  ["siteName", "Site name"],
  ["brand.legalName", "Legal name"],
  ["brand.tagline", "Tagline"],
  ["contactEmail", "Contact email"],
  ["contactPhone", "Phone"],
  ["waLink", "WhatsApp"],
  ["recruiterEmail", "Recruiter email"],
  ["defaultSeo.title", "SEO title"],
  ["defaultSeo.description", "SEO description"],
  ["analyticsId", "Analytics"],
];

function at(data: Data, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object" ? (value as Data)[key] : undefined,
      data,
    );
}

function settingsLines(data: Data): SummaryLine[] {
  const social = asArray<{ platform?: string }>(data.socialLinks)
    .map(({ platform }) => platform)
    .filter(Boolean)
    .join(", ");
  return [
    ...SETTINGS_FIELDS.map(([path, label]) =>
      single(path, label, quoted(at(data, path))),
    ),
    single("social", "Social", social || "—"),
  ];
}

export function summarize(slug: string, data: unknown): SummaryLine[] {
  const doc = (data ?? {}) as Data;
  if (slug === "header") return headerLines(doc);
  if (slug === "footer") return footerLines(doc);
  if (slug === "tenant-settings") return settingsLines(doc);
  return [];
}

export type ChangeKind = "same" | "edited" | "added" | "removed";

export type CompareRow = {
  left?: { text: string; kind: ChangeKind };
  right?: { text: string; kind: ChangeKind };
};

export function compareLines(
  older: SummaryLine[],
  current: SummaryLine[],
): CompareRow[] {
  const olderByKey = new Map(older.map((line) => [line.key, line.text]));
  const currentByKey = new Map(current.map((line) => [line.key, line.text]));
  const kind = (
    line: SummaryLine,
    other: Map<string, string>,
    missing: ChangeKind,
  ): ChangeKind => {
    if (!other.has(line.key)) return missing;
    return other.get(line.key) === line.text ? "same" : "edited";
  };
  return Array.from(
    { length: Math.max(older.length, current.length) },
    (_, index) => {
      const left = older[index];
      const right = current[index];
      return {
        left: left && {
          text: left.text,
          kind: kind(left, currentByKey, "removed"),
        },
        right: right && {
          text: right.text,
          kind: kind(right, olderByKey, "added"),
        },
      };
    },
  );
}
