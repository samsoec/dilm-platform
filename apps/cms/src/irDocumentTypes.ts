export const IR_DOCUMENT_TYPE_OPTIONS = [
  { value: "annual-report", label: "Annual report" },
  { value: "financial-statement", label: "Financial statement" },
  { value: "sustainability-report", label: "Sustainability report" },
  { value: "public-disclosure", label: "Public disclosure" },
  { value: "shareholder-meeting", label: "Shareholder meeting" },
  { value: "prospectus", label: "Prospectus" },
] as const;

export type IrDocumentType = (typeof IR_DOCUMENT_TYPE_OPTIONS)[number]["value"];

export const IR_DOCUMENT_TYPES = IR_DOCUMENT_TYPE_OPTIONS.map(
  ({ value }) => value,
);

export const IR_LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  id: "Indonesian",
};

export function irTypeLabel(value: unknown): string {
  const known = IR_DOCUMENT_TYPE_OPTIONS.find(
    (option) => option.value === value,
  );
  if (known) return known.label;
  const text = typeof value === "string" ? value.replace(/-/g, " ") : "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
