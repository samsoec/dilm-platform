import type { UploadField } from "payload";

export const MEDIA_PICKER_FIELD =
  "/admin/components/media/MediaPickerField#MediaPickerField";

export type MediaPickerOptions = { chooseLabel?: string };

export function withMediaPicker<T extends UploadField>(
  field: T,
  options: MediaPickerOptions = {},
): T {
  return {
    ...field,
    admin: {
      ...field.admin,
      components: {
        ...field.admin?.components,
        Field: { path: MEDIA_PICKER_FIELD, clientProps: options },
      },
    },
  };
}
