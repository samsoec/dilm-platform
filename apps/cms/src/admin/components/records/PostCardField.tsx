"use client";

import { FieldLabel, useField, useFormFields, useLocale } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useState } from "react";

import { isReferenceCollection, referenceTitle } from "../../linkPicker";
import {
  cardLinkLine,
  isPickCollection,
  OTHER_SITE_NOTE,
  rowMeta,
  toPickRow,
  type PickCollection,
  type PickRow,
} from "../../recordPicker";
import { MaterialIcon } from "../MaterialIcon";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { ReachBadge } from "../kit/ReachBadge";
import { type LinkTargetRef, useLinkTarget } from "../fields/useLinkTarget";
import { RecordPicker } from "./RecordPicker";

export const PostCardField: RelationshipFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const { code } = useLocale();
  const { value, setValue } = useField<LinkTargetRef>({ path: fieldPath });
  const { company } = useUnsavedChangesGuard();
  const pageTenant = useFormFields(([fields]) => {
    const raw = fields.tenant?.value;
    return raw === undefined || raw === null || raw === ""
      ? undefined
      : String(raw);
  });
  const { doc, loading } = useLinkTarget(value);
  const [open, setOpen] = useState(false);
  const siteDomain = company?.domain ?? "";
  const relation = value?.relationTo;
  const collection: PickCollection | undefined = isPickCollection(relation)
    ? relation
    : undefined;
  const row: PickRow | undefined =
    doc && collection ? toPickRow(collection, doc, siteDomain) : undefined;
  const hasValue = Boolean(value?.value);
  const collections = (
    Array.isArray(field.relationTo) ? field.relationTo : [field.relationTo]
  ).filter(isPickCollection);

  return (
    <div className="field-type dil-post-card">
      <FieldLabel label={field.label} path={fieldPath} />
      {hasValue && !loading && doc && collection && (
        <div className="dil-post-card__picked">
          <strong>
            {isReferenceCollection(collection)
              ? referenceTitle(collection, doc)
              : String(doc.id)}
          </strong>
          {row && rowMeta(collection, doc) && (
            <span className="dil-post-card__meta">{row.meta}</span>
          )}
          {row && <ReachBadge compact reach={row.reach} />}
          <span className="dil-post-card__link">
            <MaterialIcon name="link" />
            {cardLinkLine(doc, siteDomain, code)}
          </span>
          {row?.otherSite && (
            <span className="dil-post-card__link">{OTHER_SITE_NOTE}</span>
          )}
          <span className="dil-post-card__link">
            {doc.coverImage
              ? "Using the post cover · Override"
              : "No cover image"}
          </span>
        </div>
      )}
      {!readOnly && !open && (
        <button
          className="dil-post-card__swap"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MaterialIcon name="swap_horiz" />
          {hasValue ? "Swap" : "Pick a post"}
        </button>
      )}
      {open && (
        <RecordPicker
          collections={collections}
          onClose={() => setOpen(false)}
          onConfirm={([picked]) => {
            if (picked) {
              setValue({ relationTo: picked.collection, value: picked.id });
            }
            setOpen(false);
          }}
          pageTenant={pageTenant}
          single
          siteDomain={siteDomain}
          taken={new Set()}
          used={0}
        />
      )}
    </div>
  );
};
