"use client";

import { useField } from "@payloadcms/ui";
import Link from "next/link";

import { renderCopyright } from "../../layoutEditor";
import { MaterialIcon } from "../MaterialIcon";

const TOKENS = ["{year}", "{legalName}"] as const;
const MISSING = "[legal name missing]";

export function CopyrightPreviewClient({
  legalName,
  path,
  year,
  brandHref,
}: {
  legalName?: string;
  path: string;
  year: number;
  brandHref?: string;
}) {
  const { value, setValue, readOnly } = useField<string>({ path });
  const template = typeof value === "string" ? value : "";

  const insert = (token: string) => {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${path}"]`,
    );
    const start = input?.selectionStart ?? template.length;
    const end = input?.selectionEnd ?? template.length;
    const spaced =
      (start > 0 && template[start - 1] !== " " ? " " : "") + token;
    setValue(template.slice(0, start) + spaced + template.slice(end));
    requestAnimationFrame(() => {
      const caret = start + spaced.length;
      input?.focus();
      input?.setSelectionRange(caret, caret);
    });
  };

  const missingLegalName = !legalName && template.includes("{legalName}");
  const preview = renderCopyright(template, {
    year,
    legalName: legalName ?? MISSING,
  });

  return (
    <div className="dil-copyright">
      {!readOnly && (
        <p className="dil-copyright__insert">
          Insert:
          {TOKENS.map((token) => (
            <button key={token} onClick={() => insert(token)} type="button">
              + {token}
            </button>
          ))}
        </p>
      )}
      {template.trim() !== "" &&
        (missingLegalName ? (
          <p className="dil-copyright__missing" role="status">
            <MaterialIcon name="warning" />
            <span className="dil-copyright__text">
              {preview.split(MISSING).map((part, index, all) => (
                <span key={index}>
                  {part}
                  {index < all.length - 1 && <b>{MISSING}</b>}
                </span>
              ))}
            </span>
            {brandHref && (
              <Link href={brandHref} prefetch={false}>
                Set in Brand →
              </Link>
            )}
          </p>
        ) : (
          <p aria-live="polite" className="dil-copyright__preview">
            <span className="dil-copyright__label">Preview</span> {preview}
          </p>
        ))}
    </div>
  );
}
