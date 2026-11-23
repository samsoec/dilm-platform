export const SITE_MESSAGES = "site-messages";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function idOf(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const id = isRecord(value) ? value.id : value;
  return id === null || id === undefined || id === "" ? undefined : String(id);
}

function collectPageLinks(node: unknown, found: Set<string>): void {
  if (Array.isArray(node)) {
    for (const entry of node) collectPageLinks(entry, found);
    return;
  }
  if (!isRecord(node)) return;
  const fields = node.fields;
  if (
    node.type === "link" &&
    isRecord(fields) &&
    fields.linkType === "internal" &&
    isRecord(fields.doc) &&
    fields.doc.relationTo === "pages"
  ) {
    const id = idOf(fields.doc.value);
    if (id) found.add(id);
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") collectPageLinks(value, found);
  }
}

export function linkedPageIds(body: unknown): string[] {
  const found = new Set<string>();
  collectPageLinks(body, found);
  return [...found];
}
