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

export type EntityMapItem = {
  entity?: EntityRef;
  image?: unknown;
  label?: string | null;
  title?: string | null;
  description?: string | null;
  regions?: readonly { name?: string | null }[] | null;
  pin?: { x?: number | null; y?: number | null } | null;
};

export const FALLBACK_FIELDS = [
  "image",
  "label",
  "title",
  "description",
  "regions",
  "pinX",
  "pinY",
] as const;

export type FallbackField = (typeof FALLBACK_FIELDS)[number];

export type FallbackSource = "item" | "company" | "none";

export type EntityCardValues = {
  image: unknown;
  label: string | null;
  title: string | null;
  description: string | null;
  regions: string[];
  pinX: number | null;
  pinY: number | null;
};

export type ResolvedEntityItem = {
  values: EntityCardValues;
  placeholders: EntityCardValues;
  source: Record<FallbackField, FallbackSource>;
};

export function entityIdOf(ref: EntityRef): string | null {
  if (ref === null || ref === undefined || ref === "") return null;
  const id = typeof ref === "object" ? ref.id : ref;
  return id === null || id === undefined || id === "" ? null : String(id);
}

function text(value: string | null | undefined): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function names(
  regions: readonly { name?: string | null }[] | null | undefined,
): string[] {
  return (regions ?? []).flatMap((region) => text(region?.name) ?? []);
}

function present(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "";
}

function axis(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function entityPlaceholders(
  entity: EntityRecord | null | undefined,
): EntityCardValues {
  const profile = entity?.profile;
  return {
    image: present(profile?.coverImage) ? profile?.coverImage : null,
    label: text(profile?.hubLabel),
    title: text(entity?.name) ?? text(entity?.brand?.legalName),
    description: text(profile?.shortDescription),
    regions: names(profile?.regions),
    pinX: axis(profile?.mapPin?.x),
    pinY: axis(profile?.mapPin?.y),
  };
}

export function resolveEntityFallbacks(
  item: EntityMapItem | null | undefined,
  entity: EntityRecord | null | undefined,
): ResolvedEntityItem {
  const own: EntityCardValues = {
    image: present(item?.image) ? item?.image : null,
    label: text(item?.label),
    title: text(item?.title),
    description: text(item?.description),
    regions: names(item?.regions),
    pinX: axis(item?.pin?.x),
    pinY: axis(item?.pin?.y),
  };
  const placeholders = entityPlaceholders(entity);
  const empty = (field: FallbackField) =>
    field === "regions" ? own.regions.length === 0 : own[field] === null;
  const values = { ...own };
  const source = {} as Record<FallbackField, FallbackSource>;
  for (const field of FALLBACK_FIELDS) {
    if (!empty(field)) {
      source[field] = "item";
    } else if (
      field === "regions"
        ? placeholders.regions.length > 0
        : placeholders[field] !== null
    ) {
      (values as Record<FallbackField, unknown>)[field] = placeholders[field];
      source[field] = "company";
    } else {
      source[field] = "none";
    }
  }
  return { values, placeholders, source };
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
