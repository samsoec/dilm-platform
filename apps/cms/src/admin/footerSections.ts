import {
  FOOTER_SECTIONS,
  type FooterSection,
  isSameAsDefault,
  valueAtPath,
} from "./layoutEditor";

const SECTION_ROOTS: Record<string, FooterSection["anchor"]> = {
  ctaBand: "contact-band",
  linkColumns: "link-columns",
  partOf: "part-of",
  copyright: "copyright",
};

const TRANSLATABLE = /(^|\.)(label|title|eyebrow|copyright)$/;

export function sectionOfPath(
  path: string,
): FooterSection["anchor"] | undefined {
  return SECTION_ROOTS[path.split(".")[0] ?? ""];
}

export type SectionCounts = { errors: number; untranslated: number };

type FieldLike = { value?: unknown; valid?: boolean; rows?: unknown[] };

export function footerSectionCounts(
  fields: Record<string, FieldLike>,
  { submitted, englishDoc }: { submitted: boolean; englishDoc?: unknown },
): Record<FooterSection["anchor"], SectionCounts> {
  const counts = Object.fromEntries(
    FOOTER_SECTIONS.map(({ anchor }) => [
      anchor,
      { errors: 0, untranslated: 0 },
    ]),
  ) as Record<FooterSection["anchor"], SectionCounts>;
  for (const [path, field] of Object.entries(fields)) {
    const anchor = sectionOfPath(path);
    if (!anchor) continue;
    if (submitted && field.valid === false && !field.rows) {
      counts[anchor].errors += 1;
    }
    if (
      englishDoc !== undefined &&
      TRANSLATABLE.test(path) &&
      isSameAsDefault(field.value, valueAtPath(englishDoc, path))
    ) {
      counts[anchor].untranslated += 1;
    }
  }
  return counts;
}

const ITALIC = 2;
const KEEP = new Set(["root", "paragraph", "text", "linebreak"]);

type LexicalNode = {
  type?: string;
  format?: number | string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

function flatten(node: LexicalNode): LexicalNode[] {
  if (node.type === "text") {
    const format = typeof node.format === "number" ? node.format & ITALIC : 0;
    return [{ ...node, format }];
  }
  if (node.type === "linebreak") return [node];
  return (node.children ?? []).flatMap(flatten);
}

export function plainOrItalic(root: LexicalNode): LexicalNode {
  const paragraphs = (root.children ?? []).flatMap((child) => {
    if (child.type === "paragraph") {
      return [{ ...child, children: (child.children ?? []).flatMap(flatten) }];
    }
    const inline = flatten(child);
    return inline.length > 0
      ? [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            direction: null,
            children: inline,
          },
        ]
      : [];
  });
  return { ...root, children: paragraphs };
}

export function isPlainOrItalic(root: LexicalNode): boolean {
  const walk = (node: LexicalNode): boolean => {
    if (!node.type || !KEEP.has(node.type)) return false;
    if (
      node.type === "text" &&
      typeof node.format === "number" &&
      (node.format & ~ITALIC) !== 0
    ) {
      return false;
    }
    return (node.children ?? []).every(walk);
  };
  return walk(root);
}
