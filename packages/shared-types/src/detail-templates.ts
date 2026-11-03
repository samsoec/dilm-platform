export const SHARED_TEMPLATE_RECORD_TYPES = ["product", "solution"] as const;

export const TENANT_TEMPLATE_RECORD_TYPES = [
  "job",
  "post",
  "category",
] as const;

export const DETAIL_RECORD_TYPES = [
  ...SHARED_TEMPLATE_RECORD_TYPES,
  ...TENANT_TEMPLATE_RECORD_TYPES,
] as const;

export type DetailRecordType = (typeof DETAIL_RECORD_TYPES)[number];

export const TEMPLATE_TOKENS = ["title"] as const;

export type TemplateToken = (typeof TEMPLATE_TOKENS)[number];

export const TOKENS_OUTSIDE_TEMPLATES =
  "Placeholders only work in detail templates.";

export function unknownTokenMessage(name: string): string {
  return `{${name}} isn't a placeholder. Use {title}.`;
}

export const TEMPLATE_BLOCK_RECORD_TYPES: Readonly<
  Record<string, readonly DetailRecordType[]>
> = {
  recordHero: ["product", "solution", "job", "post"],
  productOverview: ["product"],
  productSpecifications: ["product"],
  productApplications: ["product"],
  solutionImpact: ["solution"],
  solutionApplications: ["solution"],
  jobDetail: ["job"],
  postArticle: ["post"],
};

export type RecordContext = { recordType?: DetailRecordType | null };

export function isBlockInContext(
  blockSlug: string,
  context?: RecordContext | null,
): boolean {
  const allowed = Object.hasOwn(TEMPLATE_BLOCK_RECORD_TYPES, blockSlug)
    ? TEMPLATE_BLOCK_RECORD_TYPES[blockSlug]
    : undefined;
  if (!allowed) return true;
  return context?.recordType ? allowed.includes(context.recordType) : false;
}

const TOKEN_PATTERN = /\{([A-Za-z][A-Za-z0-9_-]*)\}/g;

export function tokensIn(text: string): string[] {
  return [...text.matchAll(TOKEN_PATTERN)].map((match) => match[1]);
}

export type TokenRecord = {
  title?: LocalizedText;
  name?: LocalizedText;
};

type LocalizedText = string | null | undefined | Record<string, string | null>;

const DEFAULT_LOCALE = "en";

function inLocale(value: LocalizedText, locale: string): string | undefined {
  if (typeof value === "string") return value;
  if (!value) return undefined;
  return value[locale] || value[DEFAULT_LOCALE] || undefined;
}

export function renderTokens(
  text: string,
  record: TokenRecord | null | undefined,
  locale: string,
): string {
  const title =
    inLocale(record?.title, locale) ?? inLocale(record?.name, locale) ?? "";
  return text.replace(TOKEN_PATTERN, (token, name: string) =>
    name === "title" ? title : token,
  );
}

const SKIPPED_KEYS = new Set(["id", "blockType", "blockName"]);

function textsIn(value: unknown, found: string[]): string[] {
  if (typeof value === "string") found.push(value);
  else if (Array.isArray(value)) value.forEach((item) => textsIn(item, found));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (!SKIPPED_KEYS.has(key)) textsIn(item, found);
    }
  }
  return found;
}

export function tokenProblem(
  layout: unknown,
  inTemplate: boolean,
): string | undefined {
  const names = textsIn(layout, []).flatMap(tokensIn);
  if (names.length === 0) return undefined;
  if (!inTemplate) return TOKENS_OUTSIDE_TEMPLATES;
  const unknown = names.find(
    (name) => !(TEMPLATE_TOKENS as readonly string[]).includes(name),
  );
  return unknown === undefined ? undefined : unknownTokenMessage(unknown);
}
