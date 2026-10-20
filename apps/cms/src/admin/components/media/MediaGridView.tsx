import { renderListView } from "@payloadcms/next/views";
import { notFound } from "next/navigation";
import type { AdminViewServerProps } from "payload";

import { MediaGridList } from "./MediaGridList";

export async function MediaGridView(props: AdminViewServerProps) {
  try {
    const { List } = await renderListView({
      ...props,
      ComponentOverride: MediaGridList,
      enableRowSelections: false,
    });
    return List;
  } catch (error) {
    if ((error as Error).message === "not-found") notFound();
    throw error;
  }
}
