export const CONTENT_ERROR_KINDS = [
  "timeout",
  "unavailable",
  "not-found",
  "contract",
] as const;

export type ContentErrorKind = (typeof CONTENT_ERROR_KINDS)[number];

export class ContentError extends Error {
  readonly kind: ContentErrorKind;

  constructor(kind: ContentErrorKind, message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ContentError";
    this.kind = kind;
  }
}
