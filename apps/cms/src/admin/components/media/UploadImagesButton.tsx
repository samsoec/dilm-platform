"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { MaterialIcon } from "../MaterialIcon";
import { ACCEPTED_IMAGE_TYPES } from "./uploadRules";
import { UPLOAD_DIALOG_SLUG, UploadDialog } from "./UploadDialog";

function carriesFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

export function UploadImagesButton() {
  const { options, selectedTenantID } = useTenantSelection();
  const { isModalOpen, openModal } = useModal();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const label = options.find(
    ({ value }) => String(value) === String(selectedTenantID),
  )?.label;
  const company = typeof label === "string" ? label : "this company";
  const canDrop = selectedTenantID !== undefined;
  const dialogOpen = isModalOpen(UPLOAD_DIALOG_SLUG);

  useEffect(() => {
    if (!canDrop || dialogOpen) return;
    let depth = 0;
    const enter = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      depth += 1;
      setDragging(true);
    };
    const over = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };
    const leave = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const drop = (event: DragEvent) => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      depth = 0;
      setDragging(false);
      const dropped = Array.from(event.dataTransfer?.files ?? []);
      if (dropped.length === 0) return;
      setFiles(dropped);
      openModal(UPLOAD_DIALOG_SLUG);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, [canDrop, dialogOpen, openModal]);

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
      {dragging && (
        <div aria-live="polite" className="dil-dropzone">
          <MaterialIcon name="upload" />
          Drop images to upload to {company}
        </div>
      )}
      <UploadDialog
        files={files}
        onUploaded={() => router.refresh()}
        tenant={selectedTenantID}
      />
    </div>
  );
}
