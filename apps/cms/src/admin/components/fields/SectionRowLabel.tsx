"use client";

import { MAX_LAYOUT_BLOCKS } from "@dilm/shared-types";
import { useForm, useFormFields, useModal, useRowLabel } from "@payloadcms/ui";
import { useState, type KeyboardEvent } from "react";

import {
  menuActions,
  type MenuActionId,
  type PickupState,
  movedText,
  pickupKey,
  positionText,
  removeCopy,
  runMenuAction,
  type SectionData,
  sectionSummary,
  variantText,
} from "../../sectionRows";
import { CATALOG_LIMIT_TEXT } from "../../sectionCatalog";
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
  const [pickup, setPickup] = useState<PickupState>({
    pickedUp: false,
    origin: index,
  });
  const pickedUp = pickup.pickedUp;
  const limit = arrayPath === "layout" ? MAX_LAYOUT_BLOCKS : undefined;
  const dialog = `remove-section-${path}`;
  const variant = variantText(data?.variant);
  const summary = sectionSummary(data, record);
  const copy = removeCopy(name, data);

  const move = (to: number, say = true) => {
    if (to === index) return;
    moveFieldRow({ moveFromIndex: index, moveToIndex: to, path: arrayPath });
    setModified(true);
    if (say) announce(movedText(name, to, count));
  };
  const onHandleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const result = pickupKey(pickup, event.key, index, count, name);
    if (!result.handled) return;
    event.preventDefault();
    if (event.key === "Escape") event.stopPropagation();
    setPickup(result.state);
    if (result.moveTo !== undefined) move(result.moveTo, false);
    if (result.announce) announce(result.announce);
  };

  const handlers = {
    move,
    openCatalog: (at: number) => openCatalog(arrayPath, at),
    duplicate: () => {
      dispatchFields({
        type: "DUPLICATE_ROW",
        path: arrayPath,
        rowIndex: index,
      });
      setModified(true);
    },
    confirmRemove: () => openModal(dialog),
  };
  const icons: Record<
    MenuActionId,
    Parameters<typeof MaterialIcon>[0]["name"]
  > = {
    up: "expand_less",
    down: "arrow_downward",
    insertAbove: "add",
    insertBelow: "add",
    duplicate: "view_list",
    remove: "delete",
  };

  return (
    <span
      className={`dil-section-row${pickedUp ? " dil-section-row--picked" : ""}`}
    >
      <button
        aria-label={`Move ${name}, position ${index + 1} of ${count}`}
        aria-pressed={pickedUp}
        className="dil-section-row__handle"
        onBlur={() => setPickup((current) => ({ ...current, pickedUp: false }))}
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
          {(close) => (
            <div className="dil-section-row__items" role="group">
              {menuActions(index, count, limit).map((action) => (
                <button
                  className="dil-section-row__item"
                  disabled={action.disabled}
                  title={
                    action.id === "duplicate" && action.disabled
                      ? CATALOG_LIMIT_TEXT
                      : undefined
                  }
                  key={action.id}
                  onClick={() => {
                    close();
                    runMenuAction(action.id, index, count, handlers);
                  }}
                  type="button"
                >
                  <MaterialIcon name={icons[action.id]} />
                  {action.label}
                  {action.hint && <kbd>{action.hint}</kbd>}
                </button>
              ))}
            </div>
          )}
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
