"use client";

import { useDocumentInfo, useField } from "@payloadcms/ui";
import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "../MaterialIcon";
import {
  insertAt,
  tokenChoices,
  tokenKindOf,
  TOKEN_MEANINGS,
  tokenPieces,
  tokenProblem,
} from "./publication";

type Props = { path?: string; readOnly?: boolean };

export function TokenChips({ path = "", readOnly: given }: Props) {
  const { hasSavePermission } = useDocumentInfo();
  const readOnly = Boolean(given) || hasSavePermission === false;
  const kind = tokenKindOf(path);
  const { value, setValue } = useField<string>({ path });
  const [open, setOpen] = useState(false);
  const typedBrace = useRef(false);
  const text = value ?? "";
  const problem = tokenProblem(text, kind);
  const pieces = tokenPieces(text, kind);
  const inputId = `field-${path.replace(/\./g, "__")}`;

  useEffect(() => {
    const box = document.getElementById(inputId);
    if (!box) return;
    const onInput = (event: Event) => {
      if ((event as InputEvent).data === "{") {
        typedBrace.current = true;
        setOpen(true);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    box.addEventListener("input", onInput);
    box.addEventListener("keydown", onKey);
    return () => {
      box.removeEventListener("input", onInput);
      box.removeEventListener("keydown", onKey);
    };
  }, [inputId]);

  const insert = (name: string) => {
    const box = document.getElementById(inputId) as
      HTMLInputElement | HTMLTextAreaElement | null;
    const caret = box?.selectionStart ?? text.length;
    const next = insertAt(text, caret, name, typedBrace.current);
    typedBrace.current = false;
    setOpen(false);
    setValue(next.text);
    requestAnimationFrame(() => {
      box?.focus();
      box?.setSelectionRange(next.caret, next.caret);
    });
  };

  return (
    <div className="dil-token-chips">
      <div className="dil-token-chips__bar">
        {!readOnly && (
          <button
            aria-expanded={open}
            className="dil-token-chips__insert"
            onClick={() => setOpen((current) => !current)}
            onMouseDown={(event) => event.preventDefault()}
            type="button"
          >
            <MaterialIcon name="add" />
            Insert
          </button>
        )}
        {pieces.some((piece) => piece.chip) && (
          <span className="dil-token-chips__preview">
            {pieces.map((piece, index) =>
              piece.chip ? (
                <span
                  className={`dil-token-chip${piece.bad ? " dil-token-chip--bad" : ""}`}
                  key={index}
                >
                  {piece.text}
                </span>
              ) : (
                <span key={index}>{piece.text}</span>
              ),
            )}
          </span>
        )}
      </div>
      {open && (
        <div className="dil-token-chips__list" role="listbox">
          {tokenChoices(kind).map((name) => (
            <button
              aria-selected={false}
              className="dil-token-chips__option"
              key={name}
              onClick={() => insert(name)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
              type="button"
            >
              <span className="dil-token-chip">{name}</span>
              <span>{TOKEN_MEANINGS[name]}</span>
            </button>
          ))}
        </div>
      )}
      {problem && (
        <p className="dil-token-chips__error" role="alert">
          <MaterialIcon name="error" />
          {problem}
        </p>
      )}
    </div>
  );
}
