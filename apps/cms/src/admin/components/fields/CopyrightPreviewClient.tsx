"use client";

import { useFormFields } from "@payloadcms/ui";

import { renderCopyright } from "../../layoutEditor";

export function CopyrightPreviewClient({
  legalName,
  path,
  year,
}: {
  legalName?: string;
  path: string;
  year: number;
}) {
  const template = useFormFields(([fields]) => fields[path]?.value);
  if (typeof template !== "string" || template.trim() === "") return null;
  return (
    <p className="dil-copyright-preview" aria-live="polite">
      <span className="dil-copyright-preview__label">Shows as:</span>{" "}
      {renderCopyright(template, { year, legalName })}
      {!legalName && template.includes("{legalName}") && (
        <span className="dil-copyright-preview__warn">
          {" "}
          Add the legal name in Tenant settings › Brand.
        </span>
      )}
    </p>
  );
}
