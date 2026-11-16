export type RoutingSetting =
  "productsPage" | "solutionsPage" | "careerPage" | "publicationPage";

export type RoutingPage = {
  title: string;
  paths: Record<string, string>;
};

export type RoutingImpact = {
  setting: RoutingSetting;
  domains: string[];
  locales: string[];
  current: RoutingPage | null;
  next: RoutingPage | null;
  total: number;
  records: number;
  redirects: number;
  overLimit: boolean;
  message?: string;
};

export const SETTING_COPY = {
  productsPage: {
    title: "Products",
    singular: "product",
    plural: "products",
    sentenceName: "Products",
  },
  solutionsPage: {
    title: "Solutions",
    singular: "solution",
    plural: "solutions",
    sentenceName: "Solutions",
  },
  careerPage: {
    title: "Career",
    singular: "job",
    plural: "jobs",
    sentenceName: "Career",
  },
} as const;

export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  id: "Indonesian",
};

export const SITE_ROUTING_READ_ONLY =
  "Only a Super Admin can change site routing.";

export const CAREER_PAGE_NOTE =
  "Only this company's published pages. The page can't be trashed while it's set here.";

export const PUBLICATION_PAGE_NOTE =
  "Pick the page that lists all posts. Post URLs don't change: they follow their category.";

export const PUBLICATION_USED_BY = [
  "Navbar search",
  "“All Updates” tab",
  "Post breadcrumbs",
] as const;

export const PUBLICATION_URLS_UNCHANGED =
  "Saving moves no URLs, so nothing is redirected.";

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function urlPattern(path: string | undefined): string | undefined {
  if (!path) return undefined;
  return `${path === "/" ? "" : path.replace(/\/$/, "")}/{slug}`;
}

export function firstPath(
  page: RoutingPage | null,
  locale: string,
): string | undefined {
  return page?.paths[locale] || undefined;
}

export function sitesText(domains: string[], shared: boolean): string {
  if (!shared) return domains[0] ?? "this company's site";
  return `all ${domains.length || 3} sites`;
}

export function changed(initial: unknown, value: unknown): boolean {
  const norm = (v: unknown) =>
    v === null || v === undefined || v === ""
      ? ""
      : String(typeof v === "object" ? (v as { id?: unknown }).id : v);
  return norm(initial) !== norm(value);
}

export function dialogTitle(
  setting: Exclude<RoutingSetting, "publicationPage">,
) {
  return `Change the ${SETTING_COPY[setting].title} page?`;
}

export function dialogSummary(
  setting: Exclude<RoutingSetting, "publicationPage">,
  impact: RoutingImpact,
  locale = "en",
): string {
  const copy = SETTING_COPY[setting];
  const shared = setting !== "careerPage";
  const where = sitesText(impact.domains, shared);
  const from = firstPath(impact.current, locale);
  const to = firstPath(impact.next, locale);
  if (impact.overLimit && impact.message) return impact.message;
  if (impact.records === 0) {
    return `No ${copy.singular} URLs move on ${where}. No redirects are created.`;
  }
  const move = `${plural(impact.records, `${copy.singular} URL`, `${copy.singular} URLs`)} on ${where}`;
  const redirects = `${plural(impact.redirects, "redirect is", "redirects are")} created.`;
  if (from && to) {
    return `${move} ${impact.records === 1 ? "moves" : "move"} from ${from} to ${to}. ${redirects}`;
  }
  return `${move} ${to ? `get a URL under ${to}` : "lose their URL"}. ${redirects}`;
}

export function dialogLanguages(impact: RoutingImpact): string[] {
  return impact.locales.map((locale) => {
    const from = impact.current?.paths[locale];
    const to = impact.next?.paths[locale];
    return `${LOCALE_NAMES[locale] ?? locale}: ${from || "no page"} → ${to || "no page"}`;
  });
}
