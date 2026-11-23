"use client";

import { useField, useFormFields } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";

import { slugify } from "../../../slugRules";
import { MaterialIcon } from "../MaterialIcon";

export const GENERATE_SLUG_LABEL = "Generate slug from the name";

export function GenerateSlugButton({ path }: TextFieldClientProps) {
  const name = useFormFields(([fields]) => {
    const own = fields.title?.value ?? fields.name?.value;
    return typeof own === "string" ? own : "";
  });
  const { setValue } = useField<string>({ path: path ?? "slug" });
  const generated = slugify(name);

  return (
    <span className="dil-slug-generate">
      <button
        type="button"
        className="dil-slug-generate__button"
        aria-label={GENERATE_SLUG_LABEL}
        title={GENERATE_SLUG_LABEL}
        disabled={!generated}
        onClick={() => setValue(generated)}
      >
        <MaterialIcon name="bolt" />
      </button>
    </span>
  );
}
