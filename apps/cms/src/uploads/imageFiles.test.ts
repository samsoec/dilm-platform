import { describe, expect, it } from "vitest";

import { Media } from "../collections/Media";
import {
  checkImageUpload,
  IMAGE_MAX_UPLOAD_BYTES,
  IMAGE_TOO_LARGE,
} from "./imageFiles";

const run = (size: number, operation = "create") =>
  checkImageUpload({
    args: {},
    operation,
    req: { file: { size } },
  } as never);

describe("checkImageUpload", () => {
  it("accepts an image of exactly 4 MB", () => {
    expect(() => run(IMAGE_MAX_UPLOAD_BYTES)).not.toThrow();
  });

  it("rejects an image over 4 MB with a clear message", () => {
    expect(() => run(IMAGE_MAX_UPLOAD_BYTES + 1)).toThrow(IMAGE_TOO_LARGE);
  });

  it("is registered on the media collection", () => {
    expect(Media.hooks?.beforeOperation).toContain(checkImageUpload);
  });
});
