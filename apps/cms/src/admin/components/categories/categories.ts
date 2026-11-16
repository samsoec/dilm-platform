export const READ_ONLY_BANNER =
  "Categories are the same on all 3 sites. Only a Super Admin can change them.";

export const COMPANY_COLUMNS = [
  { slug: "duniakimia", label: "DKU" },
  { slug: "indoacid", label: "IAI" },
  { slug: "likutelaga", label: "LTG" },
] as const;

export type CompanySlug = (typeof COMPANY_COLUMNS)[number]["slug"];

export function slugChangeMessage(
  from: string,
  to: string,
  posts: number,
): string {
  return `Changing "${from}" to "${to}" changes the URL of ${posts} ${posts === 1 ? "post" : "posts"} on all 3 sites. Redirects are created for each.`;
}

export function shouldWarnSlugChange(
  initial: string,
  current: string,
  posts: number,
): boolean {
  return posts > 0 && initial !== "" && current.trim() !== initial;
}

export function slugText(
  slug: Record<string, string | null | undefined> | string | null | undefined,
  locale: string,
  fallback: string,
): string {
  if (typeof slug === "string") return slug;
  return slug?.[locale] || slug?.[fallback] || "";
}
