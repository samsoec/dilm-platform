export type Nameable = { email?: null | string; name?: null | string };

export function initials({ email, name }: Nameable): string {
  const source = name?.trim() || email?.split("@")[0] || "";
  const words = source.split(/[\s._-]+/).filter(Boolean);
  const letters =
    words.length > 1
      ? [words[0], words[words.length - 1]].map((word) => word[0])
      : [...(words[0] ?? "")].slice(0, 2);
  return letters.join("").toUpperCase() || "?";
}
