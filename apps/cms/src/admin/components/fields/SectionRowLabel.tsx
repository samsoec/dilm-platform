"use client";

import { useForm, useFormFields, useModal, useRowLabel } from "@payloadcms/ui";
import { useRef, useState, type KeyboardEvent } from "react";

import {
  cancelledText,
  clampMove,
  droppedText,
  movedText,
  pickedUpText,
  positionText,
  removeCopy,
  type SectionData,
  sectionSummary,
  variantText,
} from "../../sectionRows";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { Popover } from "../kit/Popover";
import { MaterialIcon } from "../MaterialIcon";
import { announce } from "./announce";

export const OPEN_CATALOG_EVENT = "dil:open-catalog";

export type OpenCatalogDetail = { path: string; index: number };

function openCatalog(path: string, index: number) {
  window.dispatchEvent(
    new CustomEvent<OpenCatalogDetail>(OPEN_CATALOG_EVENT, {
      detail: { path, index },
    }),
  );
}

export function SectionRowLabel({
  name,
  slug,
  record = false,
}: {
  name: string;
  slug: string;
  record?: boolean;
}) {
  const { data, path, rowNumber } = useRowLabel<SectionData>();
  const index = rowNumber ?? 0;
  const arrayPath = path.slice(0, path.lastIndexOf("."));
  const count = useFormFields(
    ([fields]) => fields[arrayPath]?.rows?.length ?? 0,
  );
  const { moveFieldRow, removeFieldRow, dispatchFields, setModified } =
    useForm();
  const { openModal } = useModal();
  const [pickedUp, setPickedUp] = useState(false);
  const origin = useRef(index);
  const dialog = `remove-section-${path}`;
  const variant = variantText(data?.variant);
  const summary = sectionSummary(data, record);
  const copy = removeCopy(name, data);

  const move = (to: number) => {
    if (to === index) return;
    moveFieldRow({ moveFromIndex: index, moveToIndex: to, path: arrayPath });
    setModified(true);
    announce(movedText(name, to, count));
  };
  const step = (delta: number) => move(clampMove(index, delta, count));

  const onHandleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!pickedUp) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        origin.current = index;
        setPickedUp(true);
        announce(pickedUpText(name, index, count));
      }
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      step(event.key === "ArrowUp" ? -1 : 1);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setPickedUp(false);
      announce(droppedText(name, index, count));
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setPickedUp(false);
      move(origin.current);
      announce(cancelledText(name, origin.current, count));
    }
  };

  return (
    <span
      className={`dil-section-row${pickedUp ? " dil-section-row--picked" : ""}`}
    >
      <button
        aria-label={`Move ${name}, position ${index + 1} of ${count}`}
        aria-pressed={pickedUp}
        className="dil-section-row__handle"
        onBlur={() => pickedUp && setPickedUp(false)}
        onKeyDown={onHandleKey}
        type="button"
      >
        <MaterialIcon name="drag_indicator" />
      </button>
      <span className="dil-section-row__number">{positionText(index)}</span>
      <span className="dil-section-row__name">{name}</span>
      <code className="dil-section-row__slug">{slug}</code>
      {variant && <span className="dil-section-row__chip">{variant}</span>}
      {summary && <span className="dil-section-row__summary">{summary}</span>}
      <span
        className="dil-section-row__menu"
        data-section-row={path}
        onClick={(event) => event.stopPropagation()}
      >
        <Popover
          align="end"
          floating
          icon="more_horiz"
          label={<span className="dil-sr-only">Section menu for {name}</span>}
          trailingIcon={null}
        >
          {(close) => {
            const item = (
              label: string,
              icon: Parameters<typeof MaterialIcon>[0]["name"],
              run: () => void,
              hint?: string,
              disabled = false,
            ) => (
              <button
                className="dil-section-row__item"
                disabled={disabled}
                onClick={() => {
                  close();
                  run();
                }}
                type="button"
              >
                <MaterialIcon name={icon} />
                {label}
                {hint && <kbd>{hint}</kbd>}
              </button>
            );
            return (
              <div className="dil-section-row__items" role="group">
                {item(
                  "Move up",
                  "expand_less",
                  () => step(-1),
                  "⌥↑",
                  index === 0,
                )}
                {item(
                  "Move down",
                  "arrow_downward",
                  () => step(1),
                  "⌥↓",
                  index >= count - 1,
                )}
                {item("Insert above", "add", () =>
                  openCatalog(arrayPath, index),
                )}
                {item("Insert below", "add", () =>
                  openCatalog(arrayPath, index + 1),
                )}
                {item("Duplicate", "view_list", () => {
                  dispatchFields({
                    type: "DUPLICATE_ROW",
                    path: arrayPath,
                    rowIndex: index,
                  });
                  setModified(true);
                })}
                {item("Remove…", "delete", () => openModal(dialog))}
              </div>
            );
          }}
        </Popover>
      </span>
      <button
        aria-label={`Insert section above ${name}`}
        className="dil-section-row__insert"
        onClick={(event) => {
          event.stopPropagation();
          openCatalog(arrayPath, index);
        }}
        type="button"
      >
        <MaterialIcon name="add" />
        Insert section here
      </button>
      <ConfirmDialog
        body={copy.body}
        confirmLabel="Remove section"
        onConfirm={() => {
          removeFieldRow({ path: arrayPath, rowIndex: index });
          setModified(true);
        }}
        slug={dialog}
        title={copy.title}
        tone="delete"
      />
    </span>
  );
}
