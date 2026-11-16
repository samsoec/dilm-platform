import { type LinkValue, linkTarget } from "./layoutEditor";

export type ButtonStyleValue = "primary" | "light" | "text";

export const BUTTON_STYLE_OPTIONS: readonly {
  value: ButtonStyleValue;
  label: string;
  description: string;
}[] = [
  { value: "primary", label: "Primary", description: "Filled navy button" },
  {
    value: "light",
    label: "Light",
    description: "White, for dark or photo backgrounds",
  },
  {
    value: "text",
    label: "Text link",
    description: "Underlined text with an arrow",
  },
];

export function buttonStyleLabel(style: string | null | undefined): string {
  return (
    BUTTON_STYLE_OPTIONS.find((option) => option.value === style)?.label ??
    BUTTON_STYLE_OPTIONS[0]!.label
  );
}

export function buttonSummary(link: LinkValue | null | undefined): string {
  const label = link?.label?.trim();
  const target = linkTarget(link);
  if (label && target) return `${label} → ${target}`;
  return label || target || "";
}

export const BACKGROUND_IMAGE_NOTE =
  "Choose an image, or pick another background. Needed to publish.";

export const VARIANT_KEPT_NOTE =
  "Fields that this variant does not use are hidden, not deleted. They are kept until you save.";

export const TITLE_HINT = "⌘I italic";

export function limitReason(
  count: number,
  max: number | undefined,
  noun = "item",
): string | undefined {
  if (!max || count < max) return undefined;
  return `Limit reached: ${count} of ${max} ${noun}s. Remove one to add another.`;
}

const BOLD_WEIGHT = /font-weight:\s*(bold|[6-9]00)/i;

export function removedFromHtml(html: string): string[] {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  const found: string[] = [];
  const has = (name: string, present: boolean) => {
    if (present) found.push(name);
  };
  has(
    "bold",
    body.querySelector("b, strong") !== null ||
      [...body.querySelectorAll("[style]")].some((node) =>
        BOLD_WEIGHT.test(node.getAttribute("style") ?? ""),
      ),
  );
  has("a link", body.querySelector("a[href]") !== null);
  has("a heading", body.querySelector("h1, h2, h3, h4, h5, h6") !== null);
  has("a list", body.querySelector("ul, ol, li") !== null);
  return found;
}

export function titleNotice(removed: readonly string[]): string {
  if (removed.length === 0) return "";
  const list =
    removed.length === 1
      ? removed[0]!
      : `${removed.slice(0, -1).join(", ")} and ${removed.at(-1)}`;
  return `Pasted ${list} ${removed.length === 1 ? "was" : "were"} removed from the title.`;
}

export function sectionArrayLabel(
  label: string,
  count: number,
  max: number | undefined,
): string {
  return max ? `${label} · ${count} of ${max}` : `${label} · ${count}`;
}
