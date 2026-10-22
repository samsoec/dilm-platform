"use client";

import { useAuth } from "@payloadcms/ui";

import { ActionButton } from "../kit/ActionButton";

export function EmptyUploadImages() {
  const { permissions } = useAuth();
  if (!permissions?.collections?.media?.create) return null;
  return (
    <ActionButton
      icon="upload"
      onClick={() =>
        document
          .querySelector<HTMLInputElement>(
            ".dil-upload-launch input[type=file]",
          )
          ?.click()
      }
      type="button"
    >
      Upload images
    </ActionButton>
  );
}
