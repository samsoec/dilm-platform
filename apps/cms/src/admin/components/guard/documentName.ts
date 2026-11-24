export type DocumentName = { title: string; titled: boolean };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function resolveDocumentName(input: {
  liveTitle: unknown;
  defaultLocaleTitle: unknown;
  singularLabel: string | undefined;
}): DocumentName {
  const live = text(input.liveTitle);
  if (live) return { title: live, titled: true };
  const fallback = text(input.defaultLocaleTitle);
  if (fallback) return { title: fallback, titled: true };
  return {
    title: (input.singularLabel ?? "document").toLowerCase(),
    titled: false,
  };
}
