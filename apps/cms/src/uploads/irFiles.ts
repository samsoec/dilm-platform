import { randomBytes } from "node:crypto";

import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeOperationHook,
} from "payload";

export const PUBLISHED_FILE_LOCKED =
  "This document has been published, so its PDF can't be replaced. Publish the correction as a new document.";

export function unguessableName(
  filename: string,
  random = randomBytes(12).toString("hex"),
): string {
  const dot = filename.lastIndexOf(".");
  const base =
    (dot > 0 ? filename.slice(0, dot) : filename)
      .normalize("NFKD")
      .replace(/[^\w-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 80) || "document";
  const extension = dot > 0 ? filename.slice(dot).toLowerCase() : "";
  return `${base}-${random}${extension}`;
}

export const IR_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export const PDF_TOO_LARGE =
  "The limit is 50 MB. Compress the PDF and try again.";

export const randomiseUploadName: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if ((operation === "create" || operation === "update") && req.file?.name) {
    if (req.file.size > IR_MAX_UPLOAD_BYTES) {
      throw new APIError(PDF_TOO_LARGE, 413, undefined, true);
    }
    req.file.name = unguessableName(req.file.name);
  }
  return args;
};

export const stampFirstPublished: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
}) => {
  if (data?._status === "published" && !originalDoc?.firstPublishedAt) {
    return { ...data, firstPublishedAt: new Date().toISOString() };
  }
  return data;
};

export const keepPublishedFile: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || !originalDoc?.firstPublishedAt) return data;
  const replaced =
    Boolean(req.file) ||
    (typeof data?.filename === "string" &&
      data.filename !== originalDoc.filename);
  if (replaced) throw new APIError(PUBLISHED_FILE_LOCKED, 400, undefined, true);
  return data;
};
