export const REMOVED_USER = "Removed user";

type Author = { name?: string | null; email?: string | null };

export function authorName(
  author: unknown,
  stamped: boolean,
): string | undefined {
  if (author === null || author === undefined) {
    return stamped ? REMOVED_USER : undefined;
  }
  if (typeof author === "object") {
    const { name, email } = author as Author;
    return name?.trim() || email || undefined;
  }
  return undefined;
}
