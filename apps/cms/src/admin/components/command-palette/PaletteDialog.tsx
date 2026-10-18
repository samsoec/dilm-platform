"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Spinner } from "../kit/Spinner";
import { StatusChip } from "../kit/StatusChip";
import { LocaleTag } from "../kit/Tag";
import { MaterialIcon } from "../MaterialIcon";
import {
  filterEntries,
  highlight,
  type PaletteEntry,
  type SearchSource,
  type TenantID,
} from "./search";
import { useDocumentSearch } from "./useDocumentSearch";

type Group = {
  key: string;
  heading: string;
  entries: PaletteEntry[];
  start: number;
};

function withOffsets(groups: Omit<Group, "start">[]): Group[] {
  let start = 0;
  return groups.map((group) => {
    const offset = start;
    start += group.entries.length;
    return { ...group, start: offset };
  });
}

export type PaletteCompany = { name: string; code: string };

export type PaletteDialogProps = {
  jumps: PaletteEntry[];
  sources: SearchSource[];
  tenant: TenantID | undefined;
  company: PaletteCompany | undefined;
  locale: string | undefined;
  apiURL: string;
  adminRoute: string;
  onClose: () => void;
  onSelect: (href: string) => void;
};

const FOCUSABLE = "input, button:not([disabled])";

function Highlighted({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((segment, index) =>
        segment.match ? (
          <b key={index}>{segment.text}</b>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

export function PaletteDialog({
  jumps,
  sources,
  tenant,
  company,
  locale,
  apiURL,
  adminRoute,
  onClose,
  onSelect,
}: PaletteDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const search = useDocumentSearch({
    sources,
    query,
    tenant,
    locale,
    apiURL,
    adminRoute,
    attempt,
  });
  const trimmed = query.trim();
  const companyName = company?.name ?? "this company";

  const groups = withOffsets(
    [
      {
        key: "go-to",
        heading: "Go to",
        entries: filterEntries(jumps, trimmed),
      },
      ...search.groups.map(({ source, entries }) => ({
        key: source.slug,
        heading: `${source.label} · ${entries.length}`,
        entries,
      })),
    ].filter(({ entries }) => entries.length > 0),
  );
  const options = groups.flatMap(({ entries }) => entries);
  const current = options.length ? Math.min(active, options.length - 1) : -1;

  const needsTenant = Boolean(trimmed) && tenant === undefined;
  const loading = search.status === "loading";
  const failed = search.status === "done" && search.failed;
  const empty =
    Boolean(trimmed) &&
    !needsTenant &&
    search.status === "done" &&
    !failed &&
    options.length === 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${current}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [current]);

  const choose = (index: number) => {
    const option = options[index];
    if (option) onSelect(option.href);
  };

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    } else if (event.key === "Tab") {
      event.preventDefault();
      const focusables = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );
      const at = focusables.indexOf(document.activeElement as HTMLElement);
      const step = event.shiftKey ? -1 : 1;
      focusables[(at + step + focusables.length) % focusables.length]?.focus();
    }
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = options.length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!count) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current + step + count) % count);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(current);
    }
  };

  const onBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const resultCount =
    trimmed && !loading && options.length > 0
      ? `${options.length} result${options.length === 1 ? "" : "s"}`
      : "";

  return (
    <div
      className="dil-palette"
      onMouseDown={onBackdropMouseDown}
      role="presentation"
    >
      <div
        aria-label="Search or jump to"
        aria-modal="true"
        className="dil-palette__dialog"
        onKeyDown={onDialogKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="dil-palette__field">
          <MaterialIcon name="search" />
          <input
            aria-activedescendant={current >= 0 ? optionId(current) : undefined}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={options.length > 0}
            aria-label={
              company
                ? `Search ${company.name} or jump to`
                : "Search or jump to"
            }
            autoComplete="off"
            className="dil-palette__input"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={
              company
                ? `Search ${company.name} or jump to…`
                : "Search or jump to…"
            }
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />
          {trimmed && company ? (
            <span className="dil-palette__scope">in {company.code}</span>
          ) : (
            <kbd className="dil-palette__key">Esc</kbd>
          )}
        </div>
        <div
          aria-label="Results"
          className="dil-palette__list"
          id={listId}
          ref={listRef}
          role="listbox"
        >
          {groups.map((group) => (
            <div
              aria-labelledby={`${baseId}-${group.key}`}
              className="dil-palette__group"
              key={group.key}
              role="group"
            >
              <div
                className="dil-palette__heading"
                id={`${baseId}-${group.key}`}
                role="presentation"
              >
                {group.heading}
              </div>
              {group.entries.map((entry, offset) => {
                const own = group.start + offset;
                const isActive = own === current;
                return (
                  <div
                    aria-selected={isActive}
                    className={[
                      "dil-palette__option",
                      isActive && "dil-palette__option--active",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    data-index={own}
                    id={optionId(own)}
                    key={entry.key}
                    onClick={() => choose(own)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseMove={() => setActive(own)}
                    role="option"
                  >
                    {entry.thumbnail ? (
                      <span aria-hidden className="dil-palette__thumb" />
                    ) : (
                      <MaterialIcon
                        className={`dil-palette__icon${entry.icon === "picture_as_pdf" ? " dil-palette__icon--pdf" : ""}`}
                        name={entry.icon}
                      />
                    )}
                    <span className="dil-palette__label">
                      <Highlighted query={trimmed} text={entry.label} />
                    </span>
                    {entry.detail && (
                      <span className="dil-palette__detail">
                        {entry.detail}
                      </span>
                    )}
                    {entry.locale && <LocaleTag locale={entry.locale} />}
                    {entry.published && (
                      <StatusChip set="document" status="published" />
                    )}
                    {entry.superAdmin && (
                      <span className="dil-palette__role">Super Admin</span>
                    )}
                    {isActive && (
                      <span aria-hidden className="dil-palette__enter">
                        ↵
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div aria-live="polite" className="dil-palette__states">
          {needsTenant && (
            <p className="dil-palette__state">
              Choose a company in the sidebar to search its records.
            </p>
          )}
          {loading && options.length === 0 && (
            <p className="dil-palette__state">
              <Spinner />
              Searching {companyName}…
            </p>
          )}
          {empty && (
            <div className="dil-palette__empty">
              <MaterialIcon name="search_off" />
              <b>No matches in {companyName}</b>
              <span>
                Other companies aren&apos;t searched. Switch company to look
                there.
              </span>
            </div>
          )}
          {failed && (
            <p className="dil-palette__state dil-palette__state--error">
              <MaterialIcon name="error" />
              <span className="dil-palette__state-text">
                Search isn&apos;t responding.
              </span>
              <button
                className="dil-palette__retry"
                onClick={() => {
                  setAttempt((value) => value + 1);
                  inputRef.current?.focus();
                }}
                type="button"
              >
                Try again
              </button>
            </p>
          )}
          <span className="dil-sr-only">{resultCount}</span>
        </div>
        <div aria-hidden="true" className="dil-palette__hints">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
