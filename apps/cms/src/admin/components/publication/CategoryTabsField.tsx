"use client";

import { FieldLabel, useField, useFormFields, useLocale } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useEffect, useId, useState } from "react";

import { keyMove, moveItem } from "../../recordPicker";
import { MaterialIcon } from "../MaterialIcon";
import {
  ALL_TAB_DEFAULT,
  ALL_TAB_NOTE,
  CATEGORY_NAMES_NOTE,
  categoryTabsCount,
  selectableCategories,
} from "./publication";

type Category = { id: number | string; name?: string | null };
type Stored = number | string | { id: number | string };

function idOf(value: Stored): string {
  return String(typeof value === "object" ? value.id : value);
}

export const CategoryTabsField: RelationshipFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const { code } = useLocale();
  const { value, setValue } = useField<Stored[] | null>({ path: fieldPath });
  const allLabel = useFormFields(
    ([fields]) =>
      fields[`${fieldPath.slice(0, fieldPath.lastIndexOf("."))}.allLabel`]
        ?.value,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const addId = useId();
  const picked = (value ?? []).map(idOf);

  useEffect(() => {
    fetch(`/api/categories?limit=200&depth=0&locale=${code}`, {
      credentials: "include",
    })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then(({ docs }: { docs?: Category[] }) => setCategories(docs ?? []))
      .catch(() => undefined);
  }, [code]);

  const nameOf = (id: string) => {
    const found = categories.find((category) => String(category.id) === id);
    return found?.name ?? `Category ${id}`;
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= picked.length) return;
    setValue(moveItem(picked, from, to));
    setNote(
      `${nameOf(picked[from]!)} moved to tab ${to + 2} of ${picked.length + 1}`,
    );
  };

  const remaining = selectableCategories(categories, picked);
  const first =
    typeof allLabel === "string" && allLabel.trim()
      ? allLabel
      : ALL_TAB_DEFAULT;

  return (
    <div className="field-type dil-category-tabs">
      <FieldLabel label={field.label} path={fieldPath} />
      <p className="dil-category-tabs__count">
        {categoryTabsCount(picked.length, categories.length)}
      </p>
      <ol className="dil-category-tabs__list">
        <li className="dil-category-tabs__item dil-category-tabs__item--locked">
          <MaterialIcon name="lock" />
          <span className="dil-category-tabs__position">1</span>
          <span className="dil-category-tabs__name">{first}</span>
          <span className="dil-category-tabs__meta">{ALL_TAB_NOTE}</span>
        </li>
        {picked.map((id, index) => (
          <li
            className="dil-category-tabs__item"
            draggable={!readOnly}
            key={id}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={() => setDragging(index)}
            onDrop={() => {
              if (dragging !== null) move(dragging, index);
              setDragging(null);
            }}
          >
            <button
              aria-label={`Move ${nameOf(id)}. Use the arrow keys.`}
              className="dil-category-tabs__handle"
              disabled={readOnly}
              onKeyDown={(event) => {
                const delta = keyMove(event.key);
                if (!delta) return;
                event.preventDefault();
                move(index, index + delta);
              }}
              type="button"
            >
              <MaterialIcon name="drag_indicator" />
            </button>
            <span className="dil-category-tabs__position">{index + 2}</span>
            <span className="dil-category-tabs__name">{nameOf(id)}</span>
            {!readOnly && (
              <button
                aria-label={`Remove ${nameOf(id)}`}
                className="dil-category-tabs__remove"
                onClick={() =>
                  setValue(picked.filter((_, position) => position !== index))
                }
                type="button"
              >
                <MaterialIcon name="close" />
              </button>
            )}
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="dil-sr-only">
        {note}
      </p>
      {!readOnly && remaining.length > 0 && (
        <div className="dil-category-tabs__add">
          <label className="dil-sr-only" htmlFor={addId}>
            Add a category tab
          </label>
          <select
            id={addId}
            onChange={(event) => {
              const next = event.target.value;
              event.target.value = "";
              if (next) setValue([...picked, next]);
            }}
            value=""
          >
            <option value="">Add a category…</option>
            {remaining.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name ?? `Category ${category.id}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <p className="dil-field-note">
        <MaterialIcon name="info" />
        {CATEGORY_NAMES_NOTE}
      </p>
    </div>
  );
};
