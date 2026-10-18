export type GuardTrigger = "company" | "language" | "leave" | "sign-out";

export const CONTINUE_VERBS: Record<GuardTrigger, string> = {
  company: "Save and switch company",
  language: "Save and switch language",
  leave: "Save and continue",
  "sign-out": "Save and sign out",
};

type FieldLike = { value?: unknown; initialValue?: unknown };

function normalized(value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  return JSON.stringify(value);
}

export function countChanges(fields: Record<string, FieldLike>): number {
  return Object.values(fields).filter(
    ({ value, initialValue }) => normalized(value) !== normalized(initialValue),
  ).length;
}

export function leaveTrigger(
  currentHref: string,
  nextHref: string,
): GuardTrigger {
  const current = new URL(currentHref);
  const next = new URL(nextHref, currentHref);
  if (/\/logout\/?$/.test(next.pathname)) return "sign-out";
  if (current.pathname === next.pathname) {
    const strip = (url: URL) => {
      const params = new URLSearchParams(url.search);
      params.delete("locale");
      params.sort();
      return params.toString();
    };
    const localeChanged =
      current.searchParams.get("locale") !== next.searchParams.get("locale");
    if (localeChanged && strip(current) === strip(next)) return "language";
  }
  return "leave";
}

export function changeCountText(count: number): string {
  return `${count} unsaved ${count === 1 ? "change" : "changes"}`;
}
