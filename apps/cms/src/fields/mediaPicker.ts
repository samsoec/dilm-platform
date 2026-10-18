import type { UploadField } from "payload";

export const MEDIA_PICKER_FIELD =
  "/admin/components/media/MediaPickerField#MediaPickerField";

export function withMediaPicker<T extends UploadField>(field: T): T {
  return {
    ...field,
    admin: {
      ...field.admin,
      components: { ...field.admin?.components, Field: MEDIA_PICKER_FIELD },
    },
  };
}
