import {
  APIError,
  type CollectionBeforeOperationHook,
  type FieldHook,
} from "payload";

import { IR_MAX_UPLOAD_BYTES, unguessableName } from "./irFiles";

export const DOCUMENT_MIME_TYPE = "application/pdf";

export function notAPdfMessage(filename: string, mimeType?: string): string {
  const isImage =
    mimeType?.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|avif|svg|heic|tiff?|bmp)$/i.test(filename);
  return isImage
    ? `${filename} is an image. Documents takes PDFs only. Add images in the Media library.`
    : `${filename} is not a PDF. Documents takes PDFs only.`;
}

export function documentTooLargeMessage(
  filename: string,
  bytes: number,
): string {
  const limit = Math.round(IR_MAX_UPLOAD_BYTES / 1024 / 1024);
  const size = Math.round(bytes / 1024 / 1024);
  return `${filename} is ${size} MB. The limit is ${limit} MB. Compress it or split it.`;
}

export const checkDocumentUpload: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if ((operation === "create" || operation === "update") && req.file?.name) {
    const { name, size, mimetype } = req.file;
    if (mimetype !== DOCUMENT_MIME_TYPE || !/\.pdf$/i.test(name)) {
      throw new APIError(notAPdfMessage(name, mimetype), 400, undefined, true);
    }
    if (size > IR_MAX_UPLOAD_BYTES) {
      throw new APIError(
        documentTooLargeMessage(name, size),
        413,
        undefined,
        true,
      );
    }
    req.file.name = unguessableName(name);
  }
  return args;
};

export function downloadFileName(title: unknown): string | null {
  if (typeof title !== "string") return null;
  const stem = title
    .replace(/[\\/:*?"<>|\p{Cc}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.pdf$/i, "")
    .trim();
  return stem ? `${stem}.pdf` : null;
}

export const downloadNameFromTitle: FieldHook = ({ siblingData }) =>
  downloadFileName(siblingData?.title);
