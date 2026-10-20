"use client";

import { useListQuery } from "@payloadcms/ui";
import type { Where } from "payload";
import { useState } from "react";

import { CONSENT_TYPES } from "../../../collections/ConsentLogs";
import { flatWhere } from "../lists/cvFilters";
import { Popover } from "../kit/Popover";
import { MaterialIcon } from "../MaterialIcon";
import {
  CONSENT_TYPE_LABELS,
  type DayRange,
  matchingPreset,
  presetRange,
  RANGE_PRESETS,
  rangeFromWhere,
  rangeText,
  recordCount,
  withRange,
} from "./consent";

export function ConsentToolbar() {
  const { data, query, refineListData } = useListQuery();
  const where = flatWhere(query.where as Where | undefined);
  const setWhere = (next: Where) =>
    void refineListData({ where: next, page: 1 });
  const range = rangeFromWhere(where);
  const hasRange = Boolean(range.from || range.to);
  const consentType = (where.consentType as { equals?: string } | undefined)
    ?.equals;

  return (
    <div className="dil-toolbar">
      <Popover
        active={Boolean(consentType)}
        label={
          <>
            Consent type{" "}
            <b>{consentType ? CONSENT_TYPE_LABELS[consentType] : "All"}</b>
          </>
        }
      >
        {(close) => (
          <ul aria-label="Consent type" className="dil-menu dil-menu__list">
            {[undefined, ...CONSENT_TYPES].map((value) => {
              const checked = value === consentType;
              return (
                <li key={value ?? "all"}>
                  <button
                    aria-pressed={checked}
                    className={`dil-menu__option${checked ? " dil-menu__option--checked" : ""}`}
                    onClick={() => {
                      const next: Where = { ...where };
                      if (value) next.consentType = { equals: value };
                      else delete next.consentType;
                      close();
                      setWhere(next);
                    }}
                    type="button"
                  >
                    <span className="dil-menu__label">
                      {value ? CONSENT_TYPE_LABELS[value] : "All"}
                    </span>
                    {checked && <MaterialIcon name="check" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Popover>
      <span
        className={`dil-consent-range${hasRange ? " dil-consent-range--active" : ""}`}
      >
        <Popover
          active={hasRange}
          icon="calendar_today"
          label={hasRange ? rangeText(range) : "Any date"}
          trailingIcon={hasRange ? null : "expand_more"}
        >
          {(close) => (
            <RangePanel
              initial={range}
              onApply={(next) => {
                close();
                setWhere(withRange(where, next));
              }}
            />
          )}
        </Popover>
        {hasRange && (
          <button
            aria-label="Remove date range"
            className="dil-consent-range__clear"
            onClick={() => setWhere(withRange(where, {}))}
            type="button"
          >
            <MaterialIcon name="close" />
          </button>
        )}
      </span>
      {data && (
        <span className="dil-toolbar__end dil-consent__count">
          {recordCount(data.totalDocs)}
        </span>
      )}
    </div>
  );
}

function RangePanel({
  initial,
  onApply,
}: {
  initial: DayRange;
  onApply: (range: DayRange) => void;
}) {
  const [draft, setDraft] = useState<DayRange>(initial);
  const [now] = useState(() => new Date());
  const active = matchingPreset(draft, now);
  const invalid = Boolean(draft.from && draft.to && draft.from > draft.to);
  return (
    <form
      className="dil-range"
      onSubmit={(event) => {
        event.preventDefault();
        if (!invalid) onApply(draft);
      }}
    >
      <div className="dil-range__presets">
        {RANGE_PRESETS.map(({ key, label }) => (
          <button
            aria-pressed={active === key}
            className={`dil-range__preset${active === key ? " dil-range__preset--active" : ""}`}
            key={key}
            onClick={() => setDraft(presetRange(key, now))}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="dil-range__fields">
        <label>
          From
          <input
            max={draft.to}
            onChange={(event) =>
              setDraft({ ...draft, from: event.target.value })
            }
            type="date"
            value={draft.from ?? ""}
          />
        </label>
        <label>
          To
          <input
            min={draft.from}
            onChange={(event) => setDraft({ ...draft, to: event.target.value })}
            type="date"
            value={draft.to ?? ""}
          />
        </label>
      </div>
      <div className="dil-range__actions">
        <button
          className="dil-range__clear"
          onClick={() => setDraft({})}
          type="button"
        >
          Clear
        </button>
        <button className="dil-range__apply" disabled={invalid} type="submit">
          Apply
        </button>
      </div>
    </form>
  );
}
