function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function documentId(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const id = isRecord(value) ? value.id : value;
  return id === null || id === undefined || id === "" ? undefined : String(id);
}

function collectAttachments(node: unknown, found: Set<string>): void {
  if (Array.isArray(node)) {
    for (const entry of node) collectAttachments(entry, found);
    return;
  }
  if (!isRecord(node)) return;
  const fields = node.fields;
  if (isRecord(fields) && fields.blockType === "attachment") {
    const id = documentId(fields.document);
    if (id) found.add(id);
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") collectAttachments(value, found);
  }
}

export function attachedDocumentIds(body: unknown): string[] {
  const found = new Set<string>();
  collectAttachments(body, found);
  return [...found];
}
