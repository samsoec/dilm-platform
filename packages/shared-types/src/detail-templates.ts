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

export const DETAIL_TYPE_LABELS: Record<DetailRecordType, string> = {
  product: "Product",
  solution: "Solution",
  job: "Job",
  post: "Post",
  category: "Category",
};

export const TEMPLATE_ONLY_NOTE = "Works on detail templates only";

function joinNames(names: readonly string[]): string {
  return names.length > 1
    ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
    : (names[0] ?? "");
}

export function templateBlockRecordTypes(
  blockSlug: string,
): readonly DetailRecordType[] | undefined {
  return Object.hasOwn(TEMPLATE_BLOCK_RECORD_TYPES, blockSlug)
    ? TEMPLATE_BLOCK_RECORD_TYPES[blockSlug]
    : undefined;
}

export function availabilityNote(types: readonly DetailRecordType[]): string {
  return `${TEMPLATE_ONLY_NOTE} · ${types.map((type) => DETAIL_TYPE_LABELS[type]).join(", ")}`;
}

export function wrongContextMessage(
  types: readonly DetailRecordType[],
): string {
  const names = types.map((type) => DETAIL_TYPE_LABELS[type].toLowerCase());
  return `This section only shows on ${joinNames(names)} pages. It won't appear here.`;
}

export const MAX_HIGHLIGHTS = 5;

export const HERO_ATTRIBUTES = {
  product: ["formula", "casNumber", "totalVariants", "classification"],
  solution: ["keyApplications", "supportingProducts", "industriesServed"],
  job: ["department", "experience", "jobType", "location", "postedDate"],
  post: ["category", "publishedDate"],
} as const satisfies Partial<Record<DetailRecordType, readonly string[]>>;

export type HeroRecordType = keyof typeof HERO_ATTRIBUTES;

export const HERO_ATTRIBUTE_KEYS = Object.values(HERO_ATTRIBUTES).flat();

export const JOB_FORM_FIELDS = [
  "fullName",
  "email",
  "phone",
  "coverLetter",
  "resume",
] as const;

export type JobFormField = (typeof JOB_FORM_FIELDS)[number];

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

export const CONTENT_LOCALES = ["en", "id"] as const;

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

export type ScopedTokenRule = {
  path: string;
  allowed: readonly string[];
  message: (name: string) => string;
};

export const RESULTS_LABEL_TOKENS = ["count", "query"] as const;

export const EMPTY_TITLE_TOKENS = ["query"] as const;

export const RESULTS_LABEL_PATH = "resultsLabel";

export const EMPTY_TITLE_PATH = "emptyState.title";

export function unknownResultsTokenMessage(name: string): string {
  return `{${name}} isn't a placeholder. Use {count} or {query}.`;
}

export function unknownEmptyTitleTokenMessage(): string {
  return "Only {query} works in this title.";
}

export const SCOPED_TOKEN_RULES: Readonly<
  Record<string, readonly ScopedTokenRule[]>
> = {
  postListing: [
    {
      path: RESULTS_LABEL_PATH,
      allowed: RESULTS_LABEL_TOKENS,
      message: unknownResultsTokenMessage,
    },
    {
      path: EMPTY_TITLE_PATH,
      allowed: EMPTY_TITLE_TOKENS,
      message: unknownEmptyTitleTokenMessage,
    },
  ],
};

function scopedRules(blockType: unknown): readonly ScopedTokenRule[] {
  return typeof blockType === "string" &&
    Object.hasOwn(SCOPED_TOKEN_RULES, blockType)
    ? SCOPED_TOKEN_RULES[blockType]
    : [];
}

export function scopedTokenProblem(
  text: unknown,
  rule: Pick<ScopedTokenRule, "allowed" | "message">,
): string | undefined {
  const unknown = textsIn(text, [])
    .flatMap(tokensIn)
    .find((name) => !rule.allowed.includes(name));
  return unknown === undefined ? undefined : rule.message(unknown);
}

function isLocaleMap(value: object): boolean {
  const keys = Object.keys(value);
  return (
    keys.length > 0 &&
    keys.every((key) => (CONTENT_LOCALES as readonly string[]).includes(key))
  );
}

function textsIn(
  value: unknown,
  found: string[],
  skip: readonly string[] = [],
  prefix = "",
): string[] {
  if (typeof value === "string") found.push(value);
  else if (Array.isArray(value)) {
    value.forEach((item) => textsIn(item, found, skip, prefix));
  } else if (value && typeof value === "object") {
    const locales = isLocaleMap(value);
    for (const [key, item] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const skipped = !locales && SKIPPED_KEYS.has(key);
      if (!skipped && !skip.includes(path)) {
        textsIn(item, found, skip, path);
      }
    }
  }
  return found;
}

function valueAt(block: unknown, path: string): unknown {
  let value = block;
  for (const key of path.split(".")) {
    if (!value || typeof value !== "object") return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

function blocksOf(layout: unknown): unknown[] {
  if (Array.isArray(layout)) return layout;
  return layout === null || layout === undefined ? [] : [layout];
}

export function tokenProblem(
  layout: unknown,
  inTemplate: boolean,
): string | undefined {
  const names = blocksOf(layout).flatMap((block) => {
    const rules = scopedRules(
      (block as { blockType?: unknown } | null)?.blockType,
    );
    return textsIn(
      block,
      [],
      rules.map(({ path }) => path),
    ).flatMap(tokensIn);
  });
  if (names.length > 0) {
    if (!inTemplate) return TOKENS_OUTSIDE_TEMPLATES;
    const unknown = names.find(
      (name) => !(TEMPLATE_TOKENS as readonly string[]).includes(name),
    );
    if (unknown !== undefined) return unknownTokenMessage(unknown);
  }
  for (const block of blocksOf(layout)) {
    const rules = scopedRules(
      (block as { blockType?: unknown } | null)?.blockType,
    );
    for (const rule of rules) {
      const problem = scopedTokenProblem(valueAt(block, rule.path), rule);
      if (problem) return problem;
    }
  }
  return undefined;
}
