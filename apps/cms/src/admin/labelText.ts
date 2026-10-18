export function labelText(label: unknown, language: string): string {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const byLanguage = label as Record<string, string>;
    return byLanguage[language] ?? Object.values(byLanguage)[0] ?? "";
  }
  return "";
}
