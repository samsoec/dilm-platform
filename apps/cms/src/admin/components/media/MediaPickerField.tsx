"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  useConfig,
  useField,
  useFormFields,
  useModal,
} from "@payloadcms/ui";
import type { UploadFieldClientComponent } from "payload";
import { formatAdminURL } from "payload/shared";
import { useEffect, useId, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { MaterialIcon } from "../MaterialIcon";
import {
  MediaPickerDialog,
  type PickedMedia,
  toPicked,
} from "./MediaPickerDialog";

function relationID(value: unknown): number | string | undefined {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    return (value as { id: number | string }).id;
  }
  return undefined;
}

export const MediaPickerField: UploadFieldClientComponent = (props) => {
  const { field, path, readOnly } = props;
  const { chooseLabel } = props as { chooseLabel?: string };
  const fieldPath = path ?? field.name;
  const { value, setValue, showError } = useField<unknown>({ path: fieldPath });
  const tenantValue = useFormFields(([fields]) => fields.tenant?.value);
  const { selectedTenantID } = useTenantSelection();
  const tenant = relationID(tenantValue) ?? selectedTenantID;
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const slug = `dil-picker-${useId().replace(/:/g, "")}`;
  const id = relationID(value);
  const [media, setMedia] = useState<PickedMedia>();
  const isLogo = /logo/i.test(field.name);

  useEffect(() => {
    if (id === undefined) {
      setMedia(undefined);
      return;
    }
    if (media?.id === id) return;
    const request = new AbortController();
    fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/media/${id}?depth=0`,
      }),
      { credentials: "include", signal: request.signal },
    )
      .then((response) => (response.ok ? response.json() : undefined))
      .then((doc) => setMedia(doc ? toPicked(doc) : { id }))
      .catch(() => undefined);
    return () => request.abort();
  }, [id, media?.id, routes.api, serverURL]);

  return (
    <div
      className={`field-type dil-media-field${showError ? " error" : ""}${readOnly ? " read-only" : ""}`}
    >
      <FieldLabel
        label={field.label}
        path={fieldPath}
        required={field.required}
      />
      <div className="field-type__wrap">
        <FieldError path={fieldPath} showError={showError} />
        <div className="dil-media-field__box">
          {media ? (
            <span className="dil-media-field__preview">
              {media.thumbnail ? (
                <img alt={media.alt ?? ""} src={media.thumbnail} />
              ) : (
                <MaterialIcon name="image" />
              )}
            </span>
          ) : (
            <span className="dil-media-field__preview dil-media-field__preview--empty">
              <MaterialIcon name="add_photo_alternate" />
            </span>
          )}
          <span className="dil-media-field__text">
            <b>
              {media?.filename ??
                (id === undefined
                  ? isLogo
                    ? "No logo chosen"
                    : "No image chosen"
                  : "Image")}
            </b>
            {media?.alt && <span>{media.alt}</span>}
          </span>
          {!readOnly && (
            <span className="dil-media-field__actions">
              <ActionButton
                onClick={() => openModal(slug)}
                type="button"
                variant="secondary"
              >
                {id === undefined
                  ? (chooseLabel ?? "Choose or upload")
                  : "Change"}
              </ActionButton>
              {id !== undefined && (
                <ActionButton
                  onClick={() => {
                    setValue(null);
                    setMedia(undefined);
                  }}
                  type="button"
                  variant="text"
                >
                  Remove
                </ActionButton>
              )}
            </span>
          )}
        </div>
      </div>
      <FieldDescription
        description={field.admin?.description}
        path={fieldPath}
      />
      {!readOnly && (
        <MediaPickerDialog
          onPick={(picked) => {
            setMedia(picked);
            setValue(picked.id);
          }}
          selectedId={id}
          slug={slug}
          tenant={tenant}
          title={isLogo ? "Choose a logo" : "Choose an image"}
        />
      )}
    </div>
  );
};
