export type LinkValue = {
  type?: "internal" | "external" | null;
  newTab?: boolean | null;
  internalPath?: string | null;
  externalUrl?: string | null;
  label?: string | null;
};

export type NavItemValue = {
  type?: "link" | "dropdown" | null;
  label?: string | null;
  link?: LinkValue | null;
  children?: unknown[] | null;
};

export type ColumnValue = {
  title?: string | null;
  links?: unknown[] | null;
};

export const FOOTER_SECTIONS = [
  { anchor: "contact-band", number: "01", title: "Contact band" },
  { anchor: "link-columns", number: "02", title: "Link columns" },
  { anchor: "part-of", number: "03", title: "Part of" },
  { anchor: "copyright", number: "04", title: "Copyright" },
] as const;

export type FooterSection = (typeof FOOTER_SECTIONS)[number];

export function sectionId(anchor: string): string {
  return `dil-section-${anchor}`;
}

export function rowNumberText(rowNumber: number | undefined): string {
  return String((rowNumber ?? 0) + 1).padStart(2, "0");
}

export function linkTarget(link: LinkValue | null | undefined): string {
  if (!link) return "";
  if ((link.type ?? "internal") === "external") {
    return (link.externalUrl ?? "").replace(/^https?:\/\//i, "");
  }
  return link.internalPath ?? "";
}

export function tabText(newTab: boolean | null | undefined): string {
  return newTab ? "New tab" : "Same tab";
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function navItemTitle(item: NavItemValue): string {
  return (item.type === "dropdown" ? item.label : item.link?.label) ?? "";
}

export function navItemLabelPath(item: NavItemValue): string {
  return item.type === "dropdown" ? "label" : "link.label";
}

export function navItemMeta(item: NavItemValue): string[] {
  if (item.type === "dropdown") {
    return ["Dropdown", plural(item.children?.length ?? 0, "link", "links")];
  }
  return [linkTarget(item.link), "Link", tabText(item.link?.newTab)].filter(
    Boolean,
  );
}

export function columnMeta(column: ColumnValue, maxLinks: number): string {
  return `${column.links?.length ?? 0}/${maxLinks} links`;
}

export function countText(
  label: string,
  count: number,
  maxRows: number | undefined,
  nested: boolean,
): string {
  if (!maxRows) return `${label} ${count}`;
  return nested
    ? `${label} ${count}/${maxRows}`
    : `${label} ${count} of ${maxRows}`;
}

export function renderCopyright(
  template: string,
  { year, legalName }: { year: number; legalName?: string | null },
): string {
  return template
    .replaceAll("{year}", String(year))
    .replaceAll("{legalName}", legalName?.trim() || "{legalName}");
}

export function valueAtPath(doc: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined,
      doc,
    );
}

export function isSameAsDefault(
  value: unknown,
  defaultValue: unknown,
): boolean {
  return (
    typeof value === "string" &&
    typeof defaultValue === "string" &&
    value.trim() !== "" &&
    value.trim() === defaultValue.trim()
  );
}

const jakartaDateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function savedAtText(value: unknown): string | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return jakartaDateTime.format(date);
}

export function jakartaYear(now: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
    }).format(now),
  );
}
