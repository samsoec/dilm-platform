"use client";

import { useAuth, useListQuery, usePreferences } from "@payloadcms/ui";
import { useRouter } from "next/navigation";

import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";
import { imageCount, MEDIA_VIEW_PREFERENCE, type MediaView } from "./media";
import { UploadImagesButton } from "./UploadImagesButton";

const VIEWS: { view: MediaView; icon: IconName; label: string }[] = [
  { view: "grid", icon: "grid_view", label: "Grid view" },
  { view: "list", icon: "view_list", label: "List view" },
];

export function MediaToolbarClient({
  view,
  gridHref,
  listHref,
}: {
  view: MediaView;
  gridHref: string;
  listHref: string;
}) {
  const { data } = useListQuery();
  const { permissions } = useAuth();
  const { setPreference } = usePreferences();
  const router = useRouter();
  const canUpload = Boolean(permissions?.collections?.media?.create);

  const choose = async (next: MediaView) => {
    if (next === view) return;
    await setPreference(MEDIA_VIEW_PREFERENCE, next).catch(() => undefined);
    router.push(next === "grid" ? gridHref : listHref);
  };

  return (
    <div className="dil-media-toolbar">
      <p aria-live="polite" className="dil-media-toolbar__count">
        {imageCount(data?.totalDocs ?? 0)}
      </p>
      <div
        aria-label="Layout"
        className="dil-media-toolbar__views"
        role="group"
      >
        {VIEWS.map((option) => (
          <button
            aria-label={option.label}
            aria-pressed={option.view === view}
            className="dil-media-toolbar__view"
            key={option.view}
            onClick={() => void choose(option.view)}
            title={option.label}
            type="button"
          >
            <MaterialIcon name={option.icon} />
          </button>
        ))}
      </div>
      {canUpload && <UploadImagesButton />}
    </div>
  );
}
