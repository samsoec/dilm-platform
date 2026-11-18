import { APIError, type CollectionBeforeOperationHook } from "payload";

export const IMAGE_MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const IMAGE_TOO_LARGE =
  "The limit is 4 MB. Resize or compress the image and try again.";

export const checkImageUpload: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (
    (operation === "create" || operation === "update") &&
    req.file &&
    req.file.size > IMAGE_MAX_UPLOAD_BYTES
  ) {
    throw new APIError(IMAGE_TOO_LARGE, 413, undefined, true);
  }
  return args;
};
