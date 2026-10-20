import { redirect } from "next/navigation";
import type { BeforeListTableServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { isTrashView } from "../trash/trash";
import {
  GRID_PATH,
  isGridView,
  MEDIA_VIEW_PREFERENCE,
  mediaView,
} from "./media";
import { MediaToolbarClient } from "./MediaToolbarClient";

function queryString(searchParams: BeforeListTableServerProps["searchParams"]) {
  const query = new URLSearchParams();
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach((item) => {
      if (typeof item === "string") query.append(key, item);
    });
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function MediaToolbar({
  params,
  payload,
  searchParams,
  user,
}: BeforeListTableServerProps) {
  if (!user || isTrashView(params)) return null;
  const base = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: "/collections/media",
  });
  const view = isGridView(params) ? "grid" : "list";
  const query = queryString(searchParams);

  if (view === "list") {
    const { docs } = await payload.find({
      collection: "payload-preferences",
      where: {
        and: [
          { key: { equals: MEDIA_VIEW_PREFERENCE } },
          { "user.relationTo": { equals: "users" } },
          { "user.value": { equals: user.id } },
        ],
      },
      depth: 0,
      limit: 1,
      overrideAccess: false,
      user,
    });
    if (mediaView(docs[0]?.value) === "grid")
      redirect(`${base}${GRID_PATH}${query}`);
  }

  return (
    <MediaToolbarClient
      gridHref={`${base}${GRID_PATH}${query}`}
      listHref={`${base}${query}`}
      view={view}
    />
  );
}
