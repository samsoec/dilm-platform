import { formatAdminURL } from "payload/shared";

export async function refreshStatusOf(
  apiRoute: string,
  serverURL: string,
  collection: string | undefined,
  id: number | string | undefined,
): Promise<string | undefined> {
  if (!collection || id === undefined) return undefined;
  const url = formatAdminURL({
    apiRoute,
    serverURL,
    path: `/refresh-status?where[collection][equals]=${collection}&where[docId][equals]=${id}&limit=1&depth=0`,
  });
  const response = await fetch(url, { credentials: "include" }).catch(
    () => undefined,
  );
  if (!response?.ok) return undefined;
  const body = (await response.json().catch(() => undefined)) as
    { docs?: { status?: string }[] } | undefined;
  return body?.docs?.[0]?.status;
}
