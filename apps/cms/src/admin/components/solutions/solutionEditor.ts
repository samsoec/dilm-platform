export const SUPPORTING_HINT =
  "Pick from every company's published products. The star marks the featured card; it must be one of these. Removing the featured product clears it, and the first product is used.";

export const MAX_SUPPORTING_PRODUCTS = 12;
export const SEARCH_LIMIT = 8;

export type Id = number | string;

export type Picked = { ids: Id[]; featured: Id | null };

export function idOf(value: unknown): Id | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object") return idOf((value as { id?: unknown }).id);
  return typeof value === "number" || typeof value === "string" ? value : null;
}

export function idList(value: unknown): Id[] {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.map(idOf).filter((id): id is Id => id !== null);
}

function same(a: Id | null, b: Id | null): boolean {
  return a !== null && b !== null && String(a) === String(b);
}

export function addSupporting(
  state: Picked,
  id: Id,
  max = MAX_SUPPORTING_PRODUCTS,
): Picked {
  if (
    state.ids.length >= max ||
    state.ids.some((existing) => same(existing, id))
  ) {
    return state;
  }
  return { ...state, ids: [...state.ids, id] };
}

export function removeSupporting(state: Picked, id: Id): Picked {
  return {
    ids: state.ids.filter((existing) => !same(existing, id)),
    featured: same(state.featured, id) ? null : state.featured,
  };
}

export function moveSupporting(
  state: Picked,
  from: number,
  to: number,
): Picked {
  if (from === to || from < 0 || to < 0) return state;
  if (from >= state.ids.length || to >= state.ids.length) return state;
  const ids = [...state.ids];
  const [moved] = ids.splice(from, 1);
  ids.splice(to, 0, moved!);
  return { ...state, ids };
}

export function toggleFeatured(state: Picked, id: Id): Picked {
  if (!state.ids.some((existing) => same(existing, id))) return state;
  return { ...state, featured: same(state.featured, id) ? null : id };
}

export function shownFeatured(state: Picked): Id | null {
  if (
    state.featured !== null &&
    state.ids.some((id) => same(id, state.featured))
  ) {
    return state.featured;
  }
  return state.ids[0] ?? null;
}

export function isShownFeatured(state: Picked, id: Id): boolean {
  return same(shownFeatured(state), id);
}

export function supportingTabText(count: number): string {
  return ` · ${count}`;
}

export function supportingCountText(count: number): string {
  return `${count} of ${MAX_SUPPORTING_PRODUCTS}`;
}

export function featuredNote(
  state: Picked,
  names: ReadonlyMap<string, string>,
): string {
  const shown = shownFeatured(state);
  if (shown === null) return "No product is featured yet.";
  const name = names.get(String(shown)) ?? "The first product";
  return state.featured === null
    ? `${name} is featured because it is first. Press a star to pick another.`
    : `${name} is featured.`;
}

export function emptySupportingText(): string {
  return "No supporting products yet. Search below to add one.";
}

export function tagCountText(count: number, max: number): string {
  return `${count} of ${max}`;
}

export function cleanTag(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function canAddTag(
  text: string,
  existing: readonly string[],
  max: number,
): boolean {
  const clean = cleanTag(text);
  if (!clean || existing.length >= max) return false;
  return !existing.some((tag) => tag.toLowerCase() === clean.toLowerCase());
}

export function productSearchQuery(search: string, locale: string): string {
  const params = new URLSearchParams();
  params.set("where[_status][equals]", "published");
  if (search.trim()) params.set("where[name][like]", search.trim());
  params.set("sort", "name");
  params.set("limit", String(SEARCH_LIMIT + MAX_SUPPORTING_PRODUCTS));
  params.set("depth", "0");
  params.set("locale", locale);
  params.set("fallback-locale", "en");
  return params.toString();
}

export function productsByIdQuery(ids: readonly Id[], locale: string): string {
  const params = new URLSearchParams();
  ids.forEach((id, index) => params.set(`where[id][in][${index}]`, String(id)));
  params.set("limit", String(MAX_SUPPORTING_PRODUCTS));
  params.set("depth", "0");
  params.set("locale", locale);
  params.set("fallback-locale", "en");
  return params.toString();
}

export function offered<T extends { id: Id }>(
  found: readonly T[],
  state: Picked,
): T[] {
  return found
    .filter((product) => !state.ids.some((id) => same(id, product.id)))
    .slice(0, SEARCH_LIMIT);
}
