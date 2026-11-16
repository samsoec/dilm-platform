import { positionText } from "../../sectionRows";

type Block = Record<string, unknown> & { id?: string; blockType?: string };

export type SectionsSummary = {
  added: string[];
  removed: string[];
  moved: string[];
};

export type FieldDiff = { label: string; before: string; after: string };

export type NameOf = (blockType: string | undefined) => string;

const IGNORED = new Set(["id", "blockType", "blockName"]);

export function blocksOf(version: unknown): Block[] {
  const layout = (version as { layout?: unknown } | null | undefined)?.layout;
  return Array.isArray(layout)
    ? layout.filter((block): block is Block => !!block && !!block.id)
    : [];
}

function title(nameOf: NameOf, block: Block, index: number): string {
  return `${positionText(index)} ${nameOf(block.blockType).toUpperCase()}`;
}

export function sectionsSummary(
  older: unknown,
  newer: unknown,
  nameOf: NameOf,
): SectionsSummary {
  const before = blocksOf(older);
  const after = blocksOf(newer);
  const beforeIds = new Map(before.map((block, index) => [block.id, index]));
  const afterIds = new Map(after.map((block, index) => [block.id, index]));
  return {
    added: after
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => !beforeIds.has(block.id))
      .map(({ block, index }) => `Added ${title(nameOf, block, index)}`),
    removed: before
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => !afterIds.has(block.id))
      .map(
        ({ block, index }) =>
          `Removed ${title(nameOf, block, index)} (was ${positionText(index)})`,
      ),
    moved: after
      .map((block, index) => ({ block, index, from: beforeIds.get(block.id) }))
      .filter(({ from, index }) => from !== undefined && from !== index)
      .map(
        ({ block, index, from }) =>
          `Moved ${title(nameOf, block, index)} from ${positionText(from ?? 0)} to ${positionText(index)}`,
      ),
  };
}

function words(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toUpperCase();
}

function shown(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "changed";
}

function isLocalized(value: unknown, locales: readonly string[]): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => locales.includes(key));
}

function leaves(
  value: unknown,
  path: string[],
  locales: readonly string[],
  into: Map<string, unknown>,
) {
  if (isLocalized(value, locales)) {
    for (const [locale, text] of Object.entries(
      value as Record<string, unknown>,
    )) {
      into.set(
        `${path.map(words).join(" › ")} (${locale.toUpperCase()})`,
        text,
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      leaves(
        item,
        [...path.slice(0, -1), `${path.at(-1)} ${index + 1}`],
        locales,
        into,
      ),
    );
    return;
  }
  if (value && typeof value === "object" && !("root" in value)) {
    for (const [key, child] of Object.entries(value)) {
      if (!IGNORED.has(key)) leaves(child, [...path, key], locales, into);
    }
    return;
  }
  into.set(path.map(words).join(" › "), value);
}

function leafMap(block: Block, locales: readonly string[]) {
  const into = new Map<string, unknown>();
  for (const [key, value] of Object.entries(block)) {
    if (!IGNORED.has(key)) leaves(value, [key], locales, into);
  }
  return into;
}

export function fieldDiffs(
  older: unknown,
  newer: unknown,
  nameOf: NameOf,
  locales: readonly string[],
): FieldDiff[] {
  const before = new Map(blocksOf(older).map((block) => [block.id, block]));
  return blocksOf(newer).flatMap((block, index) => {
    const previous = before.get(block.id);
    if (!previous) return [];
    const old = leafMap(previous, locales);
    const now = leafMap(block, locales);
    const prefix = title(nameOf, block, index);
    return [...new Set([...old.keys(), ...now.keys()])]
      .filter(
        (key) => JSON.stringify(old.get(key)) !== JSON.stringify(now.get(key)),
      )
      .map((key) => ({
        label: `${prefix} › ${key}`,
        before: shown(old.get(key)),
        after: shown(now.get(key)),
      }));
  });
}
