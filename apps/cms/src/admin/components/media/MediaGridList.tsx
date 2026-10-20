"use client";

import { DefaultListView } from "@payloadcms/ui";
import type { ListViewClientProps } from "payload";

import { MediaGrid } from "./MediaGrid";

export function MediaGridList(props: ListViewClientProps) {
  return <DefaultListView {...props} Table={<MediaGrid />} />;
}
