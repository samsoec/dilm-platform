"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { BlocksFieldClientProps } from "payload";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  atSectionLimit,
  CATALOG_LIMIT_TEXT,
  catalogEntries,
  type CatalogEntry,
  groupCounts,
  insertHeading,
  matchLine,
  noResultText,
  searchCatalog,
  stepIndex,
  templateOnlyText,
  type ClientBlockLike,
} from "../../sectionCatalog";
import { MaterialIcon } from "../MaterialIcon";
import { announce } from "./announce";
import { OPEN_CATALOG_EVENT, type OpenCatalogDetail } from "./SectionRowLabel";

export function SectionCatalog({
  field,
  path,
  schemaPath,
}: Pick<BlocksFieldClientProps, "field" | "path" | "schemaPath">) {
  const fieldPath = path ?? field?.name ?? "layout";
  const entries = useMemo(
    () => catalogEntries((field?.blocks ?? []) as ClientBlockLike[]),
    [field?.blocks],
  );
  const count = useFormFields(
    ([fields]) => fields[fieldPath]?.rows?.length ?? 0,
  );
  const names = useFormFields(([fields]) =>
    Array.from(
      { length: fields[fieldPath]?.rows?.length ?? 0 },
      (_, row) => fields[`${fieldPath}.${row}.blockType`]?.value as string,
    ).join("|"),
  );
  const { addFieldRow, setModified } = useForm();
  const [at, setAt] = useState<number | null>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const full = atSectionLimit(count, field?.maxRows);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenCatalogDetail>).detail;
      if (detail.path !== fieldPath || full) return;
      setAt(detail.index);
    };
    window.addEventListener(OPEN_CATALOG_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CATALOG_EVENT, onOpen);
  }, [fieldPath, full]);

  const nameOf = (slug: string | undefined) =>
    entries.find((entry) => entry.slug === slug)?.name;
  const heading =
    at === null
      ? ""
      : insertHeading(
          at,
          names.split("|").map((slug) => nameOf(slug)),
        );

  const insert = (entry: CatalogEntry) => {
    if (at === null) return;
    addFieldRow({
      blockType: entry.slug,
      path: fieldPath,
      rowIndex: at,
      schemaPath: schemaPath ?? fieldPath,
    });
    setModified(true);
    announce(`${entry.name} added at position ${at + 1}`);
    setAt(null);
    setTimeout(() => {
      document
        .getElementById(`${fieldPath.split(".").join("-")}-row-${at}`)
        ?.scrollIntoView?.({ block: "center" });
    }, 0);
  };

  return (
    <div className="dil-catalog-add">
      <button
        className="btn btn--style-primary btn--size-medium dil-catalog-add__button"
        disabled={full}
        onClick={() => setAt(count)}
        ref={addRef}
        type="button"
      >
        <MaterialIcon name="add" />
        Add section
      </button>
      {full && <p className="dil-catalog-add__limit">{CATALOG_LIMIT_TEXT}</p>}
      {at !== null &&
        createPortal(
          <CatalogOverlay
            entries={entries}
            heading={heading}
            onClose={() => {
              setAt(null);
              addRef.current?.focus();
            }}
            onInsert={insert}
          />,
          document.body,
        )}
    </div>
  );
}

function CatalogOverlay({
  entries,
  heading,
  onClose,
  onInsert,
}: {
  entries: CatalogEntry[];
  heading: string;
  onClose: () => void;
  onInsert: (entry: CatalogEntry) => void;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rail = useMemo(() => groupCounts(entries), [entries]);
  const matches = useMemo(
    () => searchCatalog(entries, query, group),
    [entries, query, group],
  );

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const focusCard = (index: number) => cardRefs.current[index]?.focus();
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    const active = cardRefs.current.findIndex(
      (card) => card === document.activeElement,
    );
    const inSearch = document.activeElement === searchRef.current;
    if (inSearch) {
      if (event.key === "ArrowDown" && matches.length > 0) {
        event.preventDefault();
        focusCard(0);
      }
      if (event.key === "Enter" && matches.length > 0) {
        event.preventDefault();
        onInsert(matches[0].entry);
      }
      return;
    }
    if (active < 0) return;
    const next = stepIndex(event.key, active, matches.length);
    if (next === null) return;
    event.preventDefault();
    if (event.key === "ArrowUp" && active === 0) searchRef.current?.focus();
    else focusCard(next);
  };

  return (
    <div className="dil-catalog" onKeyDown={onKeyDown}>
      <div
        aria-labelledby="dil-catalog-title"
        aria-modal="true"
        className="dil-catalog__dialog"
        role="dialog"
      >
        <header className="dil-catalog__head">
          <div>
            <h2 id="dil-catalog-title">Add section</h2>
            <p className="dil-catalog__where">{heading}</p>
          </div>
          <button
            aria-label="Close"
            className="dil-catalog__close"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon name="close" />
          </button>
        </header>
        <label className="dil-catalog__search">
          <MaterialIcon name="search" />
          <span className="dil-sr-only">Search sections</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or Figma section"
            ref={searchRef}
            type="search"
            value={query}
          />
        </label>
        <div className="dil-catalog__body">
          <nav aria-label="Section groups" className="dil-catalog__rail">
            {[{ group: null, count: entries.length }, ...rail].map((item) => (
              <button
                aria-pressed={group === item.group}
                className="dil-catalog__rail-item"
                key={item.group ?? "all"}
                onClick={() => setGroup(item.group)}
                type="button"
              >
                <span>{item.group ?? "All"}</span>
                <span>{item.count}</span>
              </button>
            ))}
          </nav>
          <div className="dil-catalog__cards" role="list">
            {matches.length === 0 && (
              <p className="dil-catalog__empty" role="status">
                {noResultText(entries, query)}
              </p>
            )}
            {matches.map((match, index) => {
              const { entry } = match;
              const only = templateOnlyText(entry);
              const line = matchLine(match);
              return (
                <button
                  className="dil-catalog__card"
                  key={entry.slug}
                  onClick={() => onInsert(entry)}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="listitem"
                  type="button"
                >
                  <span aria-hidden="true" className="dil-catalog__thumb">
                    <MaterialIcon name="view_list" />
                  </span>
                  <span className="dil-catalog__name">{entry.name}</span>
                  <code className="dil-catalog__slug">{entry.slug}</code>
                  <span className="dil-catalog__purpose">{entry.purpose}</span>
                  {line && <span className="dil-catalog__match">{line}</span>}
                  {only && <span className="dil-catalog__only">{only}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
