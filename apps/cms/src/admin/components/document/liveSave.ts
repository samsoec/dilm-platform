import { useSyncExternalStore } from "react";

export type SavedVersion = { version: number; at: number };

const saved = new Map<string, SavedVersion>();
const listeners = new Set<() => void>();

export function documentKey(slug: string | undefined, id: unknown): string {
  return `${slug ?? ""}:${String(id ?? "")}`;
}

export function markSaved(key: string, version: number, at = Date.now()) {
  saved.set(key, { version, at });
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSavedVersion(key: string): SavedVersion | undefined {
  return useSyncExternalStore(
    subscribe,
    () => saved.get(key),
    () => undefined,
  );
}

export function savedAgo(at: number, now = Date.now()): string {
  const minutes = Math.floor((now - at) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} h ago`;
}

export type LiveCollection = "header" | "footer" | "tenant-settings";

export function savedToast(
  slug: LiveCollection,
  version: number,
  domain: string | undefined,
): { title: string; body: string } {
  const site = domain ?? "the live site";
  if (slug === "tenant-settings") {
    return {
      title: `Company settings saved · v${version}.`,
      body: `The header and footer on ${site} refresh too.`,
    };
  }
  const name = slug === "header" ? "Header" : "Footer";
  return {
    title: `${name} saved · version ${version}.`,
    body: `${site} will show it within minutes.`,
  };
}

export function viewerNotice(slug: LiveCollection): string {
  const name =
    slug === "tenant-settings"
      ? "company settings"
      : slug === "header"
        ? "header"
        : "footer";
  return `You can view the ${name} as a Tenant Viewer. Save and Restore aren't shown.`;
}
