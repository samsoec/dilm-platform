export type ErrorEntry = { path: string; text: string };

type FieldLike = { valid?: boolean; rows?: unknown[]; errorMessage?: string };

const FIELD_NAMES: Record<string, string> = {
  internalPath: "Page path",
  externalUrl: "Web address",
  label: "Label",
  title: "Title",
  children: "Dropdown links",
  copyright: "Copyright",
  heading: "Heading",
};

const GROUP_NAMES: Record<string, string> = {
  cta: "Call-to-action",
  ctaBand: "Contact band",
  partOf: "Part of",
  primaryButton: "Primary button",
  secondaryButton: "Secondary button",
};

function humanize(segment: string): string {
  const spaced = segment.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

export function errorEntries(
  fields: Record<string, FieldLike>,
  rowTitle: (rowPath: string) => string,
): ErrorEntry[] {
  return Object.entries(fields)
    .filter(
      ([, field]) =>
        field.valid === false && (!field.rows || Boolean(field.errorMessage)),
    )
    .map(([path]) => {
      const segments = path.split(".");
      const parts: string[] = [];
      for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        if (/^\d+$/.test(segment)) {
          parts.splice(-1, 1, rowTitle(segments.slice(0, index + 1).join(".")));
        } else if (GROUP_NAMES[segment]) {
          parts.push(GROUP_NAMES[segment]);
        } else if (segment !== "link") {
          parts.push(humanize(segment));
        }
      }
      const last = segments[segments.length - 1];
      parts.push(FIELD_NAMES[last] ?? humanize(last));
      return { path, text: parts.join(" · ") };
    });
}
