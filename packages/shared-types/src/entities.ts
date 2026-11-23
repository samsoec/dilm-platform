import type { EntityContactSource } from "./page-blocks";

export type EntityId = number | string;

export type EntityRef = EntityId | { id: EntityId } | null | undefined;

export type EntityRecord = {
  id: EntityId;
  name?: string | null;
  domain?: string | null;
  brand?: {
    legalName?: string | null;
    logoOnDark?: unknown;
  } | null;
  profile?: {
    hubLabel?: string | null;
    shortDescription?: string | null;
    coverImage?: unknown;
    regions?: readonly { name?: string | null }[] | null;
    mapPin?: { x?: number | null; y?: number | null } | null;
    mapLocation?: {
      latitude?: number | null;
      longitude?: number | null;
    } | null;
    googleMapsUrl?: string | null;
  } | null;
};

export function entityIdOf(ref: EntityRef): string | null {
  if (ref === null || ref === undefined || ref === "") return null;
  const id = typeof ref === "object" ? ref.id : ref;
  return id === null || id === undefined || id === "" ? null : String(id);
}

function text(value: string | null | undefined): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function present(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "";
}

export type GroupTile = {
  id: string;
  name: string | null;
  coverImage: unknown;
  logo: unknown;
  href: string | null;
};

export function resolveGroupTile(entity: EntityRecord): GroupTile {
  const domain = entity.domain ? normalizeHost(entity.domain) : null;
  return {
    id: String(entity.id),
    name: text(entity.brand?.legalName) ?? text(entity.name),
    coverImage: present(entity.profile?.coverImage)
      ? entity.profile?.coverImage
      : null,
    logo: present(entity.brand?.logoOnDark) ? entity.brand?.logoOnDark : null,
    href: domain ? `https://${domain}/` : null,
  };
}

export type EntityDomains = Record<string, string>;

export function normalizeHost(value: string): string {
  return value
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "")
    .toLowerCase();
}

function withoutWww(host: string): string {
  return host.replace(/^www\./, "");
}

export function resolveCurrentEntity(
  host: string | null | undefined,
  domains: EntityDomains,
): string | null {
  if (!host) return null;
  const viewed = normalizeHost(host);
  if (viewed === "") return null;
  const known = Object.entries(domains).map(
    ([id, domain]) => [id, normalizeHost(domain)] as const,
  );
  const exact = known.find(([, domain]) => domain === viewed);
  if (exact) return exact[0];
  const loose = known.find(
    ([, domain]) => withoutWww(domain) === withoutWww(viewed),
  );
  return loose ? loose[0] : null;
}

export function resolveBlockEntity(
  picked: EntityRef,
  currentEntityId: EntityRef,
): string | null {
  return entityIdOf(picked) ?? entityIdOf(currentEntityId);
}

export function resolveContactEntityIds({
  source,
  picked,
  allIds,
  currentEntityId,
}: {
  source: EntityContactSource | null | undefined;
  picked?: readonly EntityRef[] | null;
  allIds: readonly EntityId[];
  currentEntityId: EntityRef;
}): string[] {
  const unique = (ids: (string | null)[]) => [
    ...new Set(ids.flatMap((id) => id ?? [])),
  ];
  if (source === "manual") return unique((picked ?? []).map(entityIdOf));
  const current = entityIdOf(currentEntityId);
  return unique(allIds.map(entityIdOf)).filter((id) => id !== current);
}
