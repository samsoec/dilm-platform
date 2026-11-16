"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import type { DetailRecordType } from "@dilm/shared-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "../MaterialIcon";
import {
  badToken,
  chunksOf,
  insertToken,
  isTemplateCollection,
  isTokenField,
  TOKEN_OPEN_NOTE,
  tokenHint,
} from "./templates";

type Box = HTMLInputElement | HTMLTextAreaElement;

type Target = { box: Box; top: number; left: number; width: number };

function asBox(node: EventTarget | null): Box | null {
  if (node instanceof HTMLTextAreaElement) return node;
  if (node instanceof HTMLInputElement && node.type === "text") return node;
  return null;
}

function setValue(box: Box, text: string, caret: number) {
  const proto =
    box instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(box, text);
  box.dispatchEvent(new Event("input", { bubbles: true }));
  box.setSelectionRange(caret, caret);
  box.focus();
}

export function TokenHelper() {
  const { collectionSlug } = useDocumentInfo();
  const recordType = useFormFields(([fields]) => fields.recordType?.value) as
    DetailRecordType | undefined;
  const active = isTemplateCollection(collectionSlug);
  const [target, setTarget] = useState<Target>();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const typed = useRef(false);
  const panel = useRef<HTMLDivElement>(null);

  const place = useCallback((box: Box) => {
    const rect = box.getBoundingClientRect();
    setTarget({
      box,
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
    setText(box.value);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onFocus = (event: FocusEvent) => {
      const box = asBox(event.target);
      if (box && isTokenField(box.id)) {
        setOpen(false);
        place(box);
      }
    };
    const onInput = (event: Event) => {
      const box = asBox(event.target);
      if (!box || !isTokenField(box.id)) return;
      place(box);
      typed.current = (event as InputEvent).data === "{";
      if (typed.current) setOpen(true);
    };
    const onBlur = (event: FocusEvent) => {
      if (panel.current?.contains(event.relatedTarget as Node | null)) return;
      if (asBox(event.target)) {
        setTarget(undefined);
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("input", onInput);
    document.addEventListener("focusout", onBlur);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("input", onInput);
      document.removeEventListener("focusout", onBlur);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, place]);

  if (!active || !target) return null;

  const insert = () => {
    const { box } = target;
    const caret = box.selectionStart ?? box.value.length;
    const next = insertToken(box.value, caret, typed.current);
    typed.current = false;
    setOpen(false);
    setValue(box, next.text, next.caret);
  };

  const problem = badToken(text);
  const chips = chunksOf(text);
  const hasChip = chips.some((chunk) => chunk.chip);

  return createPortal(
    <div
      className="dil-token-helper"
      ref={panel}
      style={{ top: target.top, left: target.left, maxWidth: target.width }}
    >
      <div className="dil-token-helper__bar">
        <button
          aria-expanded={open}
          className="dil-token-helper__insert"
          onClick={() => setOpen((value) => !value)}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <MaterialIcon name="add" />
          Insert placeholder
        </button>
        {hasChip && (
          <span className="dil-token-helper__preview">
            {chips.map((chunk, index) =>
              chunk.chip ? (
                <span className="dil-token-chip" key={index}>
                  {chunk.text}
                </span>
              ) : (
                <span key={index}>{chunk.text}</span>
              ),
            )}
          </span>
        )}
      </div>
      {open && (
        <div className="dil-token-helper__list" role="listbox">
          <button
            aria-selected={false}
            className="dil-token-helper__option"
            onClick={insert}
            onMouseDown={(event) => event.preventDefault()}
            role="option"
            type="button"
          >
            <span className="dil-token-chip">title</span>
            <span>{tokenHint(recordType)}</span>
          </button>
          <p className="dil-token-helper__note">{TOKEN_OPEN_NOTE}</p>
        </div>
      )}
      {problem && (
        <p className="dil-token-helper__error" role="alert">
          <MaterialIcon name="error" />
          {problem}
        </p>
      )}
    </div>,
    document.body,
  );
}
