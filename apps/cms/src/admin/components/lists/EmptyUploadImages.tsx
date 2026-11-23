"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useAuth } from "@payloadcms/ui";

import { PICK_COMPANY_REASON } from "../documents/DocumentsUploader";
import { ActionButton } from "../kit/ActionButton";

export function EmptyUploadImages() {
  const { permissions } = useAuth();
  const { selectedTenantID } = useTenantSelection();
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
      unavailableReason={
        selectedTenantID === undefined ? PICK_COMPANY_REASON : undefined
      }
    >
      Upload images
    </ActionButton>
  );
}
