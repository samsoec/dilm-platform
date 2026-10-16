"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { MaterialIcon } from "../MaterialIcon";
import {
  filterEntries,
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

export type PaletteDialogProps = {
  jumps: PaletteEntry[];
  sources: SearchSource[];
  tenant: TenantID | undefined;
  locale: string | undefined;
  apiURL: string;
  adminRoute: string;
  onClose: () => void;
  onSelect: (href: string) => void;
};

function statusText({
  query,
  count,
  loading,
  failed,
  needsTenant,
}: {
  query: string;
  count: number;
  loading: boolean;
  failed: boolean;
  needsTenant: boolean;
}): string | undefined {
  if (!query) return undefined;
  if (needsTenant)
    return "Choose a tenant in the sidebar to search its documents.";
  if (loading) return "Searching…";
  if (failed) return "Some results couldn't load. Try again in a moment.";
  if (count === 0) return `No matches for “${query}”.`;
  return undefined;
}

export function PaletteDialog({
  jumps,
  sources,
  tenant,
  locale,
  apiURL,
  adminRoute,
  onClose,
  onSelect,
}: PaletteDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
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
  });
  const trimmed = query.trim();

  const groups = withOffsets(
    [
      {
        key: "jump",
        heading: "Jump to",
        entries: filterEntries(jumps, trimmed),
      },
      ...search.groups.map(({ source, entries }) => ({
        key: source.slug,
        heading: source.label,
        entries,
      })),
    ].filter(({ entries }) => entries.length > 0),
  );
  const options = groups.flatMap(({ entries }) => entries);
  const current = options.length ? Math.min(active, options.length - 1) : -1;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${current}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [current]);

  const status = statusText({
    query: trimmed,
    count: options.length,
    loading: search.status === "loading",
    failed: search.failed,
    needsTenant: tenant === undefined && sources.length > 0,
  });

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
      inputRef.current?.focus();
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
            aria-label="Search or jump to"
            autoComplete="off"
            className="dil-palette__input"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search or jump to…"
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />
          <kbd className="dil-palette__key">Esc</kbd>
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
                return (
                  <div
                    aria-selected={own === current}
                    className={[
                      "dil-palette__option",
                      own === current && "dil-palette__option--active",
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
                    <MaterialIcon
                      className="dil-palette__icon"
                      name={entry.icon}
                    />
                    <span className="dil-palette__label">{entry.label}</span>
                    {entry.detail && (
                      <span className="dil-palette__detail">
                        {entry.detail}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p
          aria-live="polite"
          className={status ? "dil-palette__status" : "dil-sr-only"}
        >
          {status ??
            (trimmed
              ? `${options.length} result${options.length === 1 ? "" : "s"}`
              : "")}
        </p>
        <div aria-hidden="true" className="dil-palette__hints">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
