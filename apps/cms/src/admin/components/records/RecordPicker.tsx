"use client";

import { useLocale } from "@payloadcms/ui";
import { useEffect, useState } from "react";

import type { PickerDoc } from "../../linkPicker";
import {
  COMPANY_PAGE_NOTE,
  footerText,
  atLimit,
  NOT_PUBLISHED_HINT,
  pickerQuery,
  PICK_NOUN,
  SHARED_PAGE_NOTE,
  showCompanyChips,
  toPickRow,
  type PickCollection,
  type PickRow,
} from "../../recordPicker";
import { MaterialIcon } from "../MaterialIcon";
import { ReachBadge } from "../kit/ReachBadge";
import { PublishBadge } from "../kit/PublishBadge";

type Company = { id: number | string; name: string };

type Page = { docs: PickerDoc[]; totalDocs: number };

const NOUNS: Record<PickCollection, string> = {
  products: "Products",
  solutions: "Solutions",
  jobs: "Jobs",
  posts: "Posts",
  categories: "Categories",
};

function useCompanies(enabled: boolean): Company[] {
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    if (!enabled) return;
    fetch("/api/tenants?limit=20&depth=0", { credentials: "include" })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then(({ docs }: { docs?: Company[] }) => setCompanies(docs ?? []))
      .catch(() => undefined);
  }, [enabled]);
  return companies;
}

export function RecordPicker({
  collections,
  pageTenant,
  siteDomain,
  taken,
  used,
  max,
  single = false,
  onConfirm,
  onClose,
}: {
  collections: readonly PickCollection[];
  pageTenant: string | undefined;
  siteDomain: string;
  taken: ReadonlySet<string>;
  used: number;
  max?: number;
  single?: boolean;
  onConfirm: (rows: PickRow[]) => void;
  onClose: () => void;
}) {
  const { code } = useLocale();
  const [collection, setCollection] = useState<PickCollection>(collections[0]!);
  const [term, setTerm] = useState("");
  const [company, setCompany] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<PickRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chosen, setChosen] = useState<PickRow[]>([]);
  const chips = showCompanyChips(collection, pageTenant);
  const companies = useCompanies(chips);

  useEffect(() => {
    setPage(1);
    setRows([]);
  }, [collection, term, company]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(
      () => {
        setLoading(true);
        fetch(
          `/api/${collection}?${pickerQuery({
            collection,
            term,
            pageTenant,
            company: chips ? company : undefined,
            page,
            locale: code,
          })}`,
          { credentials: "include", signal: controller.signal },
        )
          .then((response) =>
            response.ok ? response.json() : { docs: [], totalDocs: 0 },
          )
          .then((result: Page) => {
            const next = (result.docs ?? []).map((doc) =>
              toPickRow(collection, doc, siteDomain),
            );
            setRows((current) => (page === 1 ? next : [...current, ...next]));
            setTotal(result.totalDocs ?? 0);
            setLoading(false);
          })
          .catch(() => undefined);
      },
      page === 1 ? 200 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [collection, term, company, page, pageTenant, chips, code, siteDomain]);

  const keyOf = (row: PickRow) => `${row.collection}:${row.id}`;
  const isChosen = (row: PickRow) =>
    chosen.some((entry) => keyOf(entry) === keyOf(row));
  const full = !single && atLimit(chosen.length, used, max);

  const toggle = (row: PickRow) => {
    if (single) {
      onConfirm([row]);
      return;
    }
    setChosen((current) =>
      isChosen(row)
        ? current.filter((entry) => keyOf(entry) !== keyOf(row))
        : [...current, row],
    );
  };

  const noun = PICK_NOUN[collection];

  return (
    <div
      aria-label={`Pick ${noun}s`}
      className="dil-record-picker"
      role="dialog"
    >
      <p className="dil-record-picker__note">
        {pageTenant ? COMPANY_PAGE_NOTE : SHARED_PAGE_NOTE}
      </p>
      <div className="dil-record-picker__bar">
        <MaterialIcon name="search" />
        <input
          aria-label={`Search ${noun}s by name`}
          autoFocus
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search by title"
          type="search"
          value={term}
        />
        <button
          className="dil-record-picker__close"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
      </div>
      {collections.length > 1 && (
        <div
          aria-label="Type"
          className="dil-record-picker__chips"
          role="group"
        >
          {collections.map((option) => (
            <button
              aria-pressed={collection === option}
              className="dil-record-picker__chip"
              key={option}
              onClick={() => setCollection(option)}
              type="button"
            >
              {NOUNS[option]}
            </button>
          ))}
        </div>
      )}
      {chips && (
        <div
          aria-label="Company"
          className="dil-record-picker__chips"
          role="group"
        >
          {[{ id: "", name: "All companies" }, ...companies].map((option) => (
            <button
              aria-pressed={company === String(option.id)}
              className="dil-record-picker__chip"
              key={option.id}
              onClick={() => setCompany(String(option.id))}
              type="button"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
      <ul aria-busy={loading} className="dil-record-picker__rows">
        {!loading && rows.length === 0 && (
          <li className="dil-record-picker__empty">
            Nothing matches “{term}”.
          </li>
        )}
        {rows.map((row) => {
          const already = taken.has(keyOf(row));
          const disabled =
            !row.selectable || already || (full && !isChosen(row));
          return (
            <li key={keyOf(row)}>
              <label
                className="dil-record-picker__row"
                title={!row.selectable ? NOT_PUBLISHED_HINT : undefined}
              >
                <input
                  checked={isChosen(row) || already}
                  disabled={disabled}
                  onChange={() => toggle(row)}
                  type={single ? "radio" : "checkbox"}
                />
                <span className="dil-record-picker__title">{row.title}</span>
                {row.meta && (
                  <span className="dil-record-picker__meta">{row.meta}</span>
                )}
                {row.company && (
                  <span className="dil-record-picker__meta">{row.company}</span>
                )}
                <ReachBadge compact reach={row.reach} />
                <PublishBadge status={row.status} />
                {!row.selectable && (
                  <span className="dil-record-picker__meta">
                    {NOT_PUBLISHED_HINT}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
      {rows.length < total && (
        <button
          className="dil-record-picker__more"
          disabled={loading}
          onClick={() => setPage(page + 1)}
          type="button"
        >
          Load more ({rows.length} of {total})
        </button>
      )}
      {!single && (
        <div className="dil-record-picker__footer">
          <span role="status">{footerText(chosen.length, used, max)}</span>
          <button
            className="dil-record-picker__confirm"
            disabled={chosen.length === 0}
            onClick={() => onConfirm(chosen)}
            type="button"
          >
            Add {chosen.length || ""} {PICK_NOUN[collection]}
            {chosen.length === 1 ? "" : "s"}
          </button>
        </div>
      )}
    </div>
  );
}
