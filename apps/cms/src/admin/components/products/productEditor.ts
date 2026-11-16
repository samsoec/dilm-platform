import { formulaPlainText } from "../../../fields/plainText";
import { joinNames } from "../../../paths";
import { ALL_SITES_COUNT } from "../kit/reach";

export const MAX_VARIANTS = 20;
export const MAX_SPEC_ROWS = 30;
export const SHORT_DESCRIPTION_LIMIT = 160;

export const FORMULA_HINT =
  "Select a number and press ⌘, for subscript, ⌘. for superscript.";

export const PASTE_HINT =
  "Columns in order: Parameter · Method · Guaranteed value. Tab-separated, as copied from Excel or Sheets.";

export function tabCountText(count: number): string {
  return ` · ${count}`;
}

export function variantsCountText(count: number, max = MAX_VARIANTS): string {
  const cards = `${count} ${count === 1 ? "Variant" : "Variants"}`;
  return `${count} of ${max} · cards show "${cards}"`;
}

export function specsCountText(count: number, max = MAX_SPEC_ROWS): string {
  return `${count} of ${max}`;
}

export function sameOnSitesText(domains: readonly string[]): string {
  return domains.length > 0
    ? `same path on ${joinNames([...domains])}`
    : "same path on every site";
}

export function productPublishLead(sites: number = ALL_SITES_COUNT): string {
  return `Goes live on all ${sites} sites`;
}

export const PRODUCT_PUBLISH_TAIL = "Pages that list it update too.";

export function valueText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return typeof value === "object" && value !== null
    ? formulaPlainText(value).trim()
    : "";
}

export function isEmptyValue(value: unknown): boolean {
  return valueText(value) === "";
}

export type Inherited = { empty: boolean; text: string };

export function inheritedFrom(own: unknown, product: unknown): Inherited {
  return { empty: isEmptyValue(own), text: valueText(product) };
}

export type VariantRow = {
  name?: string | null;
  formula?: unknown;
  specs?: unknown[] | null;
  pdsFile?: unknown;
  sdsFile?: unknown;
};

export function variantSummary(
  row: VariantRow,
  productFormula: unknown,
): string[] {
  const form = valueText(
    isEmptyValue(row.formula) ? productFormula : row.formula,
  );
  const rows = Array.isArray(row.specs) ? row.specs.length : 0;
  const sheets = [row.pdsFile ? "PDS" : "", row.sdsFile ? "SDS" : ""].filter(
    Boolean,
  );
  return [
    form,
    `${rows} spec ${rows === 1 ? "row" : "rows"}`,
    sheets.length > 0 ? sheets.join(", ") : "No data sheets",
  ].filter(Boolean);
}

export function usedByText(count: number): string {
  return `Used by ${count} ${count === 1 ? "variant" : "variants"}`;
}

function idOf(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(
    typeof value === "object" ? (value as { id?: unknown }).id : value,
  );
}

export function documentUses(
  rows: readonly { pdsFile?: unknown; sdsFile?: unknown }[],
  field: "pdsFile" | "sdsFile",
  id: unknown,
): number {
  const key = idOf(id);
  if (!key) return 0;
  return rows.filter((row) => idOf(row[field]) === key).length;
}

export type PastedSpec = {
  parameter: string;
  method: string;
  value: string;
  missing: ("parameter" | "method" | "value")[];
};

export function parseTable(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  let atStart = true;
  const endCell = () => {
    row.push(cell);
    cell = "";
    atStart = true;
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]!;
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"' && atStart) {
      quoted = true;
      atStart = false;
    } else if (char === "\t") {
      endCell();
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      endRow();
    } else {
      cell += char;
      atStart = false;
    }
  }
  if (cell !== "" || row.length > 0) endRow();
  return rows;
}

export function parseSpecs(text: string): PastedSpec[] {
  const rows = parseTable(text)
    .map((cells) => cells.map((cell) => cell.trim()))
    .filter((cells) => cells.some((cell) => cell !== ""));
  if (rows.length > 0 && /^parameter$/i.test(rows[0]![0] ?? "")) rows.shift();
  return rows.map(([parameter = "", method = "", value = ""]) => ({
    parameter,
    method,
    value,
    missing: (
      [
        ["parameter", parameter],
        ["method", method],
        ["value", value],
      ] as const
    )
      .filter(([, cell]) => cell === "")
      .map(([name]) => name),
  }));
}

export const PREVIEW_ROWS = MAX_SPEC_ROWS;

export function specsSchemaPath(path: string): string {
  return path.replace(/\.\d+(?=\.|$)/g, "");
}

export function specRowState(row: PastedSpec) {
  const cell = <T extends string | boolean>(value: T) => ({
    initialValue: value,
    valid: true,
    value,
  });
  return {
    parameter: cell(row.parameter),
    method: cell(row.method),
    value: cell(row.value),
    emphasized: cell(false),
  };
}

export function hiddenRowsText(total: number, shown = PREVIEW_ROWS): string {
  const rest = total - shown;
  return rest > 0
    ? `and ${rest} more ${rest === 1 ? "row" : "rows"} not shown`
    : "";
}

export type PastePreview = {
  accepted: PastedSpec[];
  dropped: number;
  after: number;
  text: string;
};

export function previewSpecs(
  existing: number,
  pasted: readonly PastedSpec[],
  max = MAX_SPEC_ROWS,
): PastePreview {
  const accepted = pasted.slice(0, Math.max(max - existing, 0));
  const after = existing + accepted.length;
  const noun = accepted.length === 1 ? "row" : "rows";
  const where = existing === 0 ? "" : ` after row ${existing}`;
  return {
    accepted,
    dropped: pasted.length - accepted.length,
    after,
    text: `${accepted.length} ${noun} added${where} · ${after} of ${max} after applying`,
  };
}

export function droppedText(dropped: number, max = MAX_SPEC_ROWS): string {
  return `${dropped} ${dropped === 1 ? "row doesn't" : "rows don't"} fit: a table holds ${max} rows.`;
}

export function ownerPanelText(input: {
  company: string;
  canEdit: boolean;
}): string {
  return input.canEdit
    ? `${input.company} owns this product. Its editors and Super Admins can change it.`
    : `Owned by ${input.company}. Only ${input.company} editors or a Super Admin can change it.`;
}
