export type Nameable = { email?: null | string; name?: null | string };

function words(source: null | string | undefined): string[] {
  return (source ?? "").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

export function initials({ email, name }: Nameable): string {
  const parts =
    words(name).length > 0 ? words(name) : words(email?.split("@")[0]);
  const letters =
    parts.length > 1
      ? [parts[0], parts[parts.length - 1]].map((word) => [...word][0])
      : [...(parts[0] ?? "")].slice(0, 2);
  return letters.join("").toUpperCase() || "?";
}
