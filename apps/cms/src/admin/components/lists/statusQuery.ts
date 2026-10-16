export const STATUS_PARAM = "where[status][equals]";

export type SearchParams = Record<string, string | string[] | undefined>;

export function toURLSearchParams(searchParams: SearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) params.append(key, item);
    }
  }
  return params;
}

export function activeStatus(searchParams: SearchParams): string | undefined {
  const params = toURLSearchParams(searchParams);
  const statusKeys = [...params.keys()].filter((key) =>
    key.startsWith("where[status]"),
  );
  if (statusKeys.length !== 1 || statusKeys[0] !== STATUS_PARAM) {
    return statusKeys.length === 0 ? undefined : "";
  }
  return params.get(STATUS_PARAM) ?? undefined;
}

export function statusTabHref(
  pathname: string,
  searchParams: SearchParams,
  status: string | undefined,
): string {
  const params = toURLSearchParams(searchParams);
  for (const key of [...params.keys()]) {
    if (key.startsWith("where[status]") || key === "page") params.delete(key);
  }
  if (status) params.set(STATUS_PARAM, status);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
