import { joinNames } from "../paths";

export type PublishAction = "publish" | "unpublish" | "trash";

export type SiteUrls = {
  domain: string;
  urls: { locale: string; url: string }[];
};

export type LinkRef = {
  collection: string;
  id: string;
  title: string;
  paths: Record<string, string>;
};

export type Placement = {
  kind: "highlights" | "card";
  pageId: string;
  pageTitle: string;
  collection: string;
};

export type TrashRefusal =
  | { kind: "children"; children: { id: string; title: string }[] }
  | { kind: "recordBase"; message: string; label: string }
  | { kind: "publication"; message: string }
  | { kind: "cookiePolicy"; message: string };

export type PublishBlock =
  | { kind: "routing"; message: string }
  | { kind: "career"; message: string }
  | { kind: "consent"; message: string };

export type TemplateChange = { type: string; count: number; sites: string[] };

export type Impact = {
  title: string;
  collection: string;
  reach: { scope: "all" | "tenant"; sites: number; label: string };
  sites: SiteUrls[];
  links: LinkRef[];
  linkCount: number;
  placements: Placement[];
  refusal: TrashRefusal | null;
  block: PublishBlock | null;
  template: TemplateChange | null;
  live: boolean;
};

export const PURGE_NOTICE = {
  title: "Published, but the site hasn't refreshed yet.",
  body: "It will retry; the administrator has been told. You don't need to publish again.",
};

export const NO_PLAIN_LINKS = "No links point here.";

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function validationSummary(count: number): string {
  return `Fix ${plural(count, "thing")} to publish. Your draft is saved.`;
}

export type FieldProblem = { path: string; label: string; message: string };

export const PROBLEM_LABELS: Record<string, string> = {
  slug: "Slug",
  name: "Name",
  title: "Title",
};

export function fieldProblems(
  fields: Record<string, { valid?: boolean; errorMessage?: string }>,
  labels: Record<string, string> = PROBLEM_LABELS,
): FieldProblem[] {
  return Object.entries(fields)
    .filter(([, field]) => field.valid === false)
    .map(([path, field]) => ({
      path,
      label: labels[path] ?? path,
      message: field.errorMessage ?? "Fix this field.",
    }));
}

export function publishButtonLabel(impact: Impact | undefined): string {
  if (impact?.reach.scope === "all") {
    return `Publish to ${impact.reach.sites} sites`;
  }
  return "Publish now";
}

export function publishTitle(name: string): string {
  return `Publish "${name}"?`;
}

export function templateChangeText(change: TemplateChange): string {
  const type = change.type.toLowerCase();
  return `Changes ${change.count} ${type} ${change.count === 1 ? "page" : "pages"} on ${joinNames(change.sites)}.`;
}

export function refreshingSites(
  impact: Impact | undefined,
): string | undefined {
  if (impact?.reach.scope !== "all") return undefined;
  return `Refreshing ${impact.reach.sites} sites. The change shows within minutes.`;
}

export function hostsOf(impact: Impact): string[] {
  return impact.sites.map((site) => site.domain);
}

export function unpublishTitle(name: string, impact: Impact): string {
  if (impact.collection === "posts") {
    return `Unpublish "${name}"? It leaves ${joinNames(hostsOf(impact))} and disappears from:`;
  }
  return `Unpublish "${name}"?`;
}

export function unpublishLead(impact: Impact): string {
  const hosts = hostsOf(impact);
  const leaves = hosts.length ? ` and leaves ${joinNames(hosts)}` : "";
  return `It goes back to draft${leaves}.${
    impact.linkCount > 0
      ? ` ${plural(impact.linkCount, "link")} will show as plain text:`
      : ""
  }`;
}

export function placementText(placement: Placement): string {
  const where =
    placement.kind === "highlights"
      ? "Highlighted Updates list"
      : "hand-picked card";
  return `${placement.pageTitle} · ${where}`;
}

export function childrenRefusal(
  title: string,
  children: { title: string }[],
): string {
  return `"${title}" has ${plural(children.length, "child page")}. Move or trash them first, then trash ${title}.`;
}

export function refusalText(title: string, refusal: TrashRefusal): string {
  switch (refusal.kind) {
    case "children":
      return childrenRefusal(title, refusal.children);
    default:
      return refusal.message;
  }
}

export function trashTitle(name: string): string {
  return `Move "${name}" to the trash?`;
}

export function linkPath(paths: Record<string, string>): string {
  return paths.en ?? Object.values(paths)[0] ?? "";
}

export function publishBlockText(block: PublishBlock): string {
  return block.message;
}

export type Placed = { items?: unknown; featured?: unknown };

function idMatches(value: unknown, id: string): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "object") {
    const inner = (value as { id?: unknown; value?: unknown }).id;
    const nested = (value as { value?: unknown }).value;
    return idMatches(inner ?? nested, id);
  }
  return String(value) === id;
}

export function placementsIn(
  node: unknown,
  postId: string,
  found: Set<Placement["kind"]> = new Set(),
): Set<Placement["kind"]> {
  if (Array.isArray(node)) {
    for (const child of node) placementsIn(child, postId, found);
    return found;
  }
  if (!node || typeof node !== "object") return found;
  const record = node as Record<string, unknown>;
  const highlights = record.highlights as Placed | undefined;
  if (
    highlights &&
    Array.isArray(highlights.items) &&
    highlights.items.some((item) => idMatches(item, postId))
  ) {
    found.add("highlights");
  }
  if (
    record.blockType === "postListing" &&
    idMatches(record.featured, postId)
  ) {
    found.add("card");
  }
  const doc = record.doc as
    { relationTo?: string; value?: unknown } | undefined;
  if (doc?.relationTo === "posts" && idMatches(doc.value, postId)) {
    found.add("card");
  }
  for (const value of Object.values(record)) {
    if (value && typeof value === "object") placementsIn(value, postId, found);
  }
  return found;
}
