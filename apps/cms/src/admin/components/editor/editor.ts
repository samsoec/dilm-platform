import type { Referrer } from "../../../routeIndex";
import type { PublishStatus } from "../kit/publication";
import { VIEWER_BANNER, savedText } from "../pages/pagesModel";
import type { TranslationCount } from "../dashboard/model";
import { percent } from "../dashboard/model";

export const EDITOR_TABS = ["sections", "settings", "seo"] as const;

export type EditorTab = (typeof EDITOR_TABS)[number];

export const TAB_LABELS: Record<EditorTab, string> = {
  sections: "Sections",
  settings: "Page settings",
  seo: "SEO",
};

export function sectionsTabText(count: number): string {
  return ` · ${count}`;
}

export function sectionCountText(count: number, max: number): string {
  return `${count} of ${max} sections`;
}

export const VISITOR_MODES = ["see", "forward"] as const;

export type VisitorMode = (typeof VISITOR_MODES)[number];

export const VISITOR_LABELS: Record<VisitorMode, string> = {
  see: "See this page",
  forward: "Forward to another page",
};

export type RedirectValue = {
  type?: string | null;
  internalPath?: string | null;
  externalUrl?: string | null;
  reference?: { value?: unknown } | null;
};

export const REDIRECT_PATHS = [
  "redirectTo.type",
  "redirectTo.internalPath",
  "redirectTo.externalUrl",
  "redirectTo.reference",
] as const;

export function forwardNote(input: {
  url: string;
  target: string | undefined;
  children: number;
}): string {
  const target = input.target ?? "the page you pick";
  const stay =
    input.children === 0
      ? "The page keeps its URL."
      : `The page keeps its URL, so its ${
          input.children === 1
            ? "1 child page stays"
            : `${input.children} child pages stay`
        } under ${input.url}.`;
  return `Visitors to ${input.url} go straight to ${target}. ${stay} Its sections are hidden and kept, in case you switch back.`;
}

export function sectionsKeptNote(count: number): string {
  if (count === 0) {
    return "This page forwards visitors. It has no sections to hide.";
  }
  return `This page forwards visitors, so its ${
    count === 1 ? "1 section is" : `${count} sections are`
  } hidden and kept. Switch Visitors back to "See this page" to show ${count === 1 ? "it" : "them"} again.`;
}

export type EditorAccess = {
  canEdit: boolean;
  readOnly: boolean;
};

export function editorAccess(input: {
  hasSavePermission: boolean | undefined;
}): EditorAccess {
  const canEdit = input.hasSavePermission !== false;
  return { canEdit, readOnly: !canEdit };
}

export const viewerNotice = VIEWER_BANNER;

export type PublishingLines = {
  live: string;
  state: { tone: "ok" | "changed" | "draft"; text: string };
  saved: string | undefined;
};

export function publishingLines(input: {
  status: PublishStatus;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  now?: Date;
}): PublishingLines {
  const since = input.liveSince
    ? savedText(input.liveSince, input.now, true)
    : undefined;
  const live =
    input.status === "published" || input.status === "changed"
      ? since
        ? `Live since ${since}`
        : "Live"
      : "Not live yet";
  const state: PublishingLines["state"] =
    input.status === "changed"
      ? { tone: "changed", text: "Draft changes not live yet" }
      : input.status === "published"
        ? { tone: "ok", text: "Everything is live" }
        : { tone: "draft", text: "Draft · not public" };
  const when = input.savedAt
    ? savedText(input.savedAt, input.now).replace(/^Today, /, "today ")
    : undefined;
  const saved = when
    ? `Saved ${when}${input.savedBy ? ` by ${input.savedBy}` : ""}.${
        input.status === "changed"
          ? " Visitors still see the published version."
          : ""
      }`
    : undefined;
  return { live, state, saved };
}

export type TranslationLine = {
  percent: number;
  untranslated: number;
  complete: boolean;
  text: string;
};

export function translationLine(
  count: TranslationCount,
  language = "ID",
): TranslationLine {
  const untranslated = count.total - count.translated;
  const done = percent(count);
  const complete = untranslated === 0;
  return {
    percent: done,
    untranslated,
    complete,
    text: complete
      ? `${language} ${done}% · everything is translated`
      : `${language} ${done}% · ${untranslated} ${untranslated === 1 ? "text" : "texts"} still "Same as EN"`,
  };
}

export type LinkEntry = {
  key: string;
  collection: string;
  id: string;
  title: string;
  kind: "section" | "forward";
  note: string;
};

export type LinkInput = {
  self: { collection: string; id: string };
  tenant: string | null;
  referrers: readonly Referrer[];
  forwarders: readonly { collection: string; id: string }[];
  titles: ReadonlyMap<string, string>;
};

export function linkEntries(input: LinkInput): LinkEntry[] {
  const entries = new Map<string, LinkEntry>();
  const same = (collection: string, id: string) =>
    collection === input.self.collection && id === input.self.id;
  for (const referrer of input.referrers) {
    if (same(referrer.collection, referrer.id)) continue;
    if (referrer.tenant !== null && referrer.tenant !== input.tenant) continue;
    const key = `${referrer.collection}:${referrer.id}`;
    entries.set(key, {
      key,
      collection: referrer.collection,
      id: referrer.id,
      title: input.titles.get(key) ?? "Untitled",
      kind: "section",
      note: "links here from a section",
    });
  }
  for (const forwarder of input.forwarders) {
    if (same(forwarder.collection, forwarder.id)) continue;
    const key = `${forwarder.collection}:${forwarder.id}`;
    entries.set(key, {
      key,
      collection: forwarder.collection,
      id: forwarder.id,
      title: input.titles.get(key) ?? "Untitled",
      kind: "forward",
      note: "forwards here",
    });
  }
  return [...entries.values()].sort(
    (a, b) =>
      Number(a.kind === "forward") - Number(b.kind === "forward") ||
      a.title.localeCompare(b.title),
  );
}

export const LINKS_NOTE = "They follow the page if you rename or move it.";

export type Placement = { inMenu: boolean; text: string };

export function placement(input: {
  inMenu: boolean;
  forwards: boolean;
}): Placement {
  if (input.forwards) {
    return {
      inMenu: input.inMenu,
      text: input.inMenu
        ? "In the header or footer menu. Visitors are forwarded."
        : "Not in the header or footer menu. Visitors are forwarded.",
    };
  }
  return {
    inMenu: input.inMenu,
    text: input.inMenu
      ? "In the header or footer menu."
      : "Not in the header or footer menu.",
  };
}

export type TrashGuard = { live: boolean; children: number };

export function trashBody(input: TrashGuard & { where: string }): string {
  const kids =
    input.children > 0
      ? ` Its ${input.children === 1 ? "child page stays" : `${input.children} child pages stay`} as ${input.children === 1 ? "it is" : "they are"} but ${input.children === 1 ? "is" : "are"} listed at the top level until it's restored.`
      : "";
  return `${
    input.live
      ? `It's published, so it will be removed from ${input.where}.`
      : "It isn't on the website."
  }${kids} You can restore it from Trash.`;
}

export const DOCUMENT_ACTIONS_ID = "dil-document-actions";

export const PREVIEW_UNAVAILABLE = "Preview isn't available yet.";

export const PUBLISH_FOLLOW_UP =
  "It's on the website within minutes. Visitors keep seeing the previous version until then.";
