const MB = 1024 * 1024;

export const IMAGE_RULES = [
  { types: ["image/jpeg", "image/png", "image/webp"], maxBytes: 4 * MB },
  { types: ["image/svg+xml"], maxBytes: 1 * MB },
] as const;

export const ACCEPTED_IMAGE_TYPES = IMAGE_RULES.flatMap(({ types }) => types);

export const UPLOAD_LIMITS_TEXT = "JPG, PNG, WebP up to 4 MB · SVG up to 1 MB.";

export type FileCheck = { ok: true } | { ok: false; message: string };

export function formatMB(bytes: number): string {
  const value = bytes / MB;
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} MB`;
}

function extension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : "This file type";
}

export function checkImageFile(file: {
  name: string;
  type: string;
  size: number;
}): FileCheck {
  const rule = IMAGE_RULES.find(({ types }) =>
    (types as readonly string[]).includes(file.type),
  );
  if (!rule) {
    return {
      ok: false,
      message: `${extension(file.name)} isn't supported. Use JPG, PNG, WebP or SVG.`,
    };
  }
  if (file.size > rule.maxBytes) {
    return {
      ok: false,
      message: `${file.name} is ${formatMB(file.size)}. The limit is ${formatMB(rule.maxBytes).replace(".0", "")}. Resize it and try again.`,
    };
  }
  return { ok: true };
}

export function progressText(loaded: number, total: number): string {
  return `${(loaded / MB).toFixed(1)} of ${(total / MB).toFixed(1)} MB`;
}
