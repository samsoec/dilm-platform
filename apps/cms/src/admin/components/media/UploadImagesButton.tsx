"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { ACCEPTED_IMAGE_TYPES } from "./uploadRules";
import { UPLOAD_DIALOG_SLUG, UploadDialog } from "./UploadDialog";

export function UploadImagesButton() {
  const { selectedTenantID } = useTenantSelection();
  const { openModal } = useModal();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="dil-upload-launch">
      <ActionButton
        icon="upload"
        onClick={() => input.current?.click()}
        type="button"
        unavailableReason={
          selectedTenantID === undefined
            ? "Pick a company in the sidebar first."
            : undefined
        }
      >
        Upload images
      </ActionButton>
      <input
        accept={[...ACCEPTED_IMAGE_TYPES, "image/*"].join(",")}
        className="dil-sr-only"
        multiple
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (picked.length === 0) return;
          setFiles(picked);
          openModal(UPLOAD_DIALOG_SLUG);
        }}
        ref={input}
        tabIndex={-1}
        type="file"
      />
      <UploadDialog
        files={files}
        onUploaded={() => router.refresh()}
        tenant={selectedTenantID}
      />
    </div>
  );
}
