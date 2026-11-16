"use client";

import { FieldLabel, useField, useFormFields, useLocale } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useEffect, useId, useState } from "react";

import {
  REFERENCE_COLLECTIONS,
  type ReferenceCollection,
} from "../../../fields/link";
import {
  groupRows,
  isOtherCompany,
  LINK_STATE_LOST,
  NOT_SELECTABLE,
  OTHER_COMPANY_NOTE,
  REFERENCE_INFO,
  referenceTitle,
  searchQuery,
  shownUrl,
  targetState,
  toRow,
  type PickerDoc,
  type PickerRow,
} from "../../linkPicker";
import { MaterialIcon } from "../MaterialIcon";
import { PublishBadge } from "../kit/PublishBadge";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { type LinkTargetRef, useLinkTarget } from "./useLinkTarget";

type Filter = ReferenceCollection | "all";

function useResults(term: string, tenant: string | undefined, active: boolean) {
  const { code } = useLocale();
  const [rows, setRows] = useState<PickerRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      Promise.all(
        REFERENCE_COLLECTIONS.map((relationTo) =>
          fetch(
            `/api/${relationTo}?${searchQuery(relationTo, term, tenant)}&locale=${code}`,
            { credentials: "include", signal: controller.signal },
          )
            .then((response) => (response.ok ? response.json() : { docs: [] }))
            .then(({ docs }: { docs?: PickerDoc[] }) =>
              (docs ?? []).map((doc) => toRow(relationTo, doc, code)),
            )
            .catch(() => [] as PickerRow[]),
        ),
      ).then((all) => {
        if (controller.signal.aborted) return;
        setRows(all.flat());
        setLoading(false);
      });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, tenant, active, code]);

  return { rows, loading };
}

function Picker({
  tenant,
  onPick,
  onClose,
}: {
  tenant: string | undefined;
  onPick: (row: PickerRow) => void;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { rows, loading } = useResults(term, tenant, true);
  const groups = groupRows(rows, filter);

  return (
    <div
      className="dil-link-picker"
      role="dialog"
      aria-label="Pick a page or record"
    >
      <div className="dil-link-picker__bar">
        <MaterialIcon name="search" />
        <input
          aria-label="Search pages and records"
          autoFocus
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search by name"
          type="search"
          value={term}
        />
        <button
          className="dil-link-picker__close"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
      </div>
      <div className="dil-link-picker__filters" role="group" aria-label="Type">
        {(["all", ...REFERENCE_COLLECTIONS] as Filter[]).map((option) => (
          <button
            aria-pressed={filter === option}
            className={`dil-link-picker__filter${filter === option ? " dil-link-picker__filter--active" : ""}`}
            key={option}
            onClick={() => setFilter(option)}
            type="button"
          >
            {option === "all" ? "All" : `${REFERENCE_INFO[option].noun}s`}
          </button>
        ))}
      </div>
      <div className="dil-link-picker__results" aria-busy={loading}>
        {!loading && groups.length === 0 && (
          <p className="dil-link-picker__empty">Nothing matches “{term}”.</p>
        )}
        {groups.map((group) => (
          <section key={group.relationTo}>
            <h4 className="dil-link-picker__group">{group.label}</h4>
            {group.rows.map((row) => (
              <button
                className="dil-link-picker__row"
                disabled={!row.selectable}
                key={`${row.relationTo}:${row.id}`}
                onClick={() => onPick(row)}
                title={row.selectable ? undefined : NOT_SELECTABLE}
                type="button"
              >
                <span className="dil-link-picker__title">{row.title}</span>
                {row.path && (
                  <span className="dil-link-picker__path">{row.path}</span>
                )}
                {row.company && (
                  <span className="dil-link-picker__company">
                    {row.company}
                  </span>
                )}
                <PublishBadge status={row.status} />
                {!row.selectable && (
                  <span className="dil-link-picker__hint">
                    {NOT_SELECTABLE}
                  </span>
                )}
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export const LinkTargetField: RelationshipFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const { value, setValue } = useField<LinkTargetRef>({ path: fieldPath });
  const { company } = useUnsavedChangesGuard();
  const { code } = useLocale();
  const tenant = useFormFields(([fields]) => {
    const raw = fields.tenant?.value;
    return raw === undefined || raw === null || raw === ""
      ? undefined
      : String(raw);
  });
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const { doc, loading } = useLinkTarget(value);
  const hasValue = Boolean(value?.value);
  const state = targetState(value?.relationTo, doc, hasValue);
  const siteDomain = company?.domain ?? "";

  const pick = (row: PickerRow) => {
    setValue({ relationTo: row.relationTo, value: row.id });
    setOpen(false);
  };

  return (
    <div className="field-type dil-link-target" aria-labelledby={labelId}>
      <span id={labelId}>
        <FieldLabel label={field.label} path={fieldPath} />
      </span>
      {hasValue && !loading && doc && value?.relationTo && (
        <div
          className={`dil-link-target__card${state === "lost" ? " dil-link-target__card--lost" : ""}`}
        >
          <MaterialIcon name="link" />
          <span className="dil-link-target__name">
            {referenceTitle(value.relationTo, doc)}
          </span>
          <span className="dil-link-target__url">
            {shownUrl(doc, { siteDomain, locale: code })}
          </span>
          {state === "lost" && (
            <p className="dil-link-target__note">{LINK_STATE_LOST}</p>
          )}
          {state === "ready" && isOtherCompany(doc, siteDomain) && (
            <p className="dil-link-target__note">{OTHER_COMPANY_NOTE}</p>
          )}
        </div>
      )}
      {hasValue && !loading && !doc && (
        <div className="dil-link-target__card dil-link-target__card--lost">
          <p className="dil-link-target__note">{LINK_STATE_LOST}</p>
        </div>
      )}
      {!readOnly && (
        <button
          className="dil-link-target__change"
          onClick={() => setOpen(true)}
          type="button"
        >
          {hasValue ? "Change" : "Pick a page or record"}
        </button>
      )}
      {open && (
        <Picker onClose={() => setOpen(false)} onPick={pick} tenant={tenant} />
      )}
    </div>
  );
};
