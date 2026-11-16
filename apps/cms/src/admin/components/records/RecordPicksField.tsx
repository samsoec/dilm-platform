"use client";

import { FieldLabel, useField, useFormFields, useLocale } from "@payloadcms/ui";
import type { RelationshipFieldClientProps } from "payload";
import { useEffect, useState } from "react";

import type { PickerDoc } from "../../linkPicker";
import {
  isPickCollection,
  keyMove,
  moveItem,
  OTHER_SITE_NOTE,
  toPickRow,
  type PickCollection,
  type PickRow,
} from "../../recordPicker";
import { MaterialIcon } from "../MaterialIcon";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { ReachBadge } from "../kit/ReachBadge";
import { highlightsCount } from "../publication/publication";
import { RecordPicker } from "./RecordPicker";

type Stored = number | string | { id: number | string };

function idOf(value: Stored): string {
  return String(typeof value === "object" ? value.id : value);
}

function useDocs(collection: PickCollection, ids: string[]) {
  const { code } = useLocale();
  const [docs, setDocs] = useState<Record<string, PickerDoc>>({});
  const key = ids.join(",");
  useEffect(() => {
    const missing = ids.filter((id) => !docs[id]);
    if (missing.length === 0) return;
    const params = new URLSearchParams({
      depth: "1",
      limit: String(missing.length),
      draft: "true",
      locale: code,
      trash: "true",
      "where[id][in]": missing.join(","),
    });
    fetch(`/api/${collection}?${params}`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then(({ docs: found }: { docs?: PickerDoc[] }) =>
        setDocs((current) => ({
          ...current,
          ...Object.fromEntries(
            (found ?? []).map((doc) => [String(doc.id), doc]),
          ),
        })),
      )
      .catch(() => undefined);
  }, [key, collection, code]);
  return docs;
}

export const RecordPicksField = ({
  field,
  path,
  readOnly,
  addLabel,
  limitNote,
  showCount,
}: RelationshipFieldClientProps & {
  addLabel?: string;
  limitNote?: string;
  showCount?: boolean;
}) => {
  const fieldPath = path ?? field.name;
  const relation = Array.isArray(field.relationTo)
    ? field.relationTo[0]
    : field.relationTo;
  const collection: PickCollection = isPickCollection(relation)
    ? relation
    : "posts";
  const max = "maxRows" in field ? field.maxRows : undefined;
  const { value, setValue } = useField<Stored[] | null>({ path: fieldPath });
  const { company } = useUnsavedChangesGuard();
  const pageTenant = useFormFields(([fields]) => {
    const raw = fields.tenant?.value;
    return raw === undefined || raw === null || raw === ""
      ? undefined
      : String(raw);
  });
  const ids = (value ?? []).map(idOf);
  const docs = useDocs(collection, ids);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const siteDomain = company?.domain ?? "";

  const move = (from: number, to: number) => {
    if (to < 0 || to >= ids.length) return;
    setValue(moveItem(ids, from, to));
    const title = docs[ids[from]!]?.title ?? docs[ids[from]!]?.name ?? "Item";
    setNote(`${String(title)} moved to position ${to + 1} of ${ids.length}`);
  };

  const add = (rows: PickRow[]) => {
    setValue([...ids, ...rows.map((row) => String(row.id))]);
    setOpen(false);
  };

  return (
    <div className="field-type dil-record-picks">
      <FieldLabel label={field.label} path={fieldPath} />
      {showCount && max && (
        <p className="dil-record-picks__count">{highlightsCount(ids.length)}</p>
      )}
      <ol className="dil-record-picks__list">
        {ids.map((id, index) => {
          const doc = docs[id];
          const row = doc ? toPickRow(collection, doc, siteDomain) : undefined;
          return (
            <li
              className="dil-record-picks__item"
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
                aria-label={`Move ${row?.title ?? "item"}. Use the arrow keys.`}
                className="dil-record-picks__handle"
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
              <span className="dil-record-picks__position">{index + 1}</span>
              <span className="dil-record-picks__title">
                {row?.title ?? "Loading…"}
              </span>
              {row?.meta && (
                <span className="dil-record-picks__meta">{row.meta}</span>
              )}
              {row?.company && (
                <span className="dil-record-picks__meta">{row.company}</span>
              )}
              {row && <ReachBadge compact reach={row.reach} />}
              {row?.otherSite && (
                <span className="dil-record-picks__other">
                  <MaterialIcon name="link" />
                  {OTHER_SITE_NOTE}
                </span>
              )}
              {!readOnly && (
                <button
                  aria-label={`Remove ${row?.title ?? "item"}`}
                  className="dil-record-picks__remove"
                  onClick={() =>
                    setValue(ids.filter((_, position) => position !== index))
                  }
                  type="button"
                >
                  <MaterialIcon name="close" />
                </button>
              )}
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="dil-sr-only">
        {note}
      </p>
      {!readOnly && !open && (
        <button
          className="dil-record-picks__add"
          disabled={Boolean(max) && ids.length >= max!}
          onClick={() => setOpen(true)}
          type="button"
        >
          <MaterialIcon name="add" />
          {addLabel ?? `Pick ${collection}`}
        </button>
      )}
      {limitNote && !readOnly && max && ids.length >= max && (
        <p className="dil-field-note" role="status">
          <MaterialIcon name="block" />
          {limitNote}
        </p>
      )}
      {open && (
        <RecordPicker
          collections={[collection]}
          max={max}
          onClose={() => setOpen(false)}
          onConfirm={add}
          pageTenant={pageTenant}
          siteDomain={siteDomain}
          taken={new Set(ids.map((id) => `${collection}:${id}`))}
          used={ids.length}
        />
      )}
    </div>
  );
};
