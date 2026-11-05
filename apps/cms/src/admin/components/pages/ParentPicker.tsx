"use client";

import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { MaterialIcon } from "../MaterialIcon";
import {
  matchesQuery,
  NO_PARENT_LABEL,
  orderedParents,
  SHARED_PARENT_NOTE,
  type ParentOption,
} from "./newPage";

const NONE: ParentOption = {
  id: "",
  collection: "pages",
  title: NO_PARENT_LABEL,
  paths: {},
  shared: false,
};

type Entry =
  { key: "none"; option?: undefined } | { key: string; option: ParentOption };

export type ParentPickerProps = {
  label: string;
  options: readonly ParentOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;
  describedBy?: string;
};

export function ParentPicker({
  label,
  options,
  value,
  onChange,
  disabled,
  describedBy,
}: ParentPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const listId = useId();
  const searchId = useId();
  const selected = options.find((option) => option.id === value);

  const entries = useMemo<Entry[]>(() => {
    const shown = orderedParents(options).filter((option) =>
      matchesQuery(option, query),
    );
    const none = matchesQuery(NONE, query);
    return [
      ...(none ? [{ key: "none" } as Entry] : []),
      ...shown.map((option) => ({
        key: `${option.collection}:${option.id}`,
        option,
      })),
    ];
  }, [options, query]);

  const firstEnabled = (text: string) => {
    const shown = orderedParents(options).filter((option) =>
      matchesQuery(option, text),
    );
    const none = matchesQuery(NONE, text);
    const list = [
      ...(none ? [undefined] : []),
      ...shown.map((option) => option),
    ];
    return Math.max(
      0,
      list.findIndex((option) => !option?.shared),
    );
  };

  const enabled = entries
    .map((entry, at) => ({ entry, at }))
    .filter(({ entry }) => !entry.option?.shared);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const close = (refocus: boolean) => {
    setOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  };

  const choose = (entry: Entry | undefined) => {
    if (!entry || entry.option?.shared) return;
    onChange(entry.option ? entry.option.id : null);
    close(true);
  };

  const move = (step: 1 | -1) => {
    if (enabled.length === 0) return;
    const at = enabled.findIndex((item) => item.at === active);
    const next =
      at === -1
        ? step === 1
          ? 0
          : enabled.length - 1
        : (at + step + enabled.length) % enabled.length;
    setActive(enabled[next].at);
  };

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Enter":
        event.preventDefault();
        choose(entries[active]);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
    }
  };

  const optionId = (key: string) => `${listId}-${key.replace(/\W/g, "_")}`;

  return (
    <div
      className="dil-picker"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          setQuery("");
        }
      }}
      ref={rootRef}
    >
      <span className="dil-newpage__label" id={labelId}>
        {label}
      </span>
      <button
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${listId}-value`}
        className="dil-picker__trigger"
        disabled={disabled}
        onClick={() => {
          if (open) return close(false);
          setActive(
            Math.max(
              0,
              entries.findIndex(
                (entry) => (entry.option?.id ?? null) === value,
              ),
            ),
          );
          setOpen(true);
        }}
        ref={triggerRef}
        type="button"
      >
        <MaterialIcon name="folder_open" />
        <span className="dil-picker__value" id={`${listId}-value`}>
          {selected ? selected.title : NO_PARENT_LABEL}
        </span>
        <MaterialIcon name="expand_more" />
      </button>
      {open && (
        <div className="dil-picker__panel">
          <label className="dil-picker__search" htmlFor={searchId}>
            <MaterialIcon name="search" />
            <input
              aria-activedescendant={
                entries[active] ? optionId(entries[active].key) : undefined
              }
              aria-controls={listId}
              aria-label="Search pages"
              autoComplete="off"
              id={searchId}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(firstEnabled(event.target.value));
              }}
              onKeyDown={onSearchKey}
              placeholder="Search pages"
              ref={searchRef}
              role="combobox"
              aria-expanded="true"
              type="search"
              value={query}
            />
          </label>
          <ul
            aria-label={label}
            className="dil-picker__list"
            id={listId}
            role="listbox"
          >
            {entries.map((entry, at) => {
              const option = entry.option;
              const shared = Boolean(option?.shared);
              const chosen = (option?.id ?? null) === value && !shared;
              return (
                <li
                  aria-disabled={shared || undefined}
                  aria-selected={chosen}
                  className={[
                    "dil-picker__option",
                    at === active && "dil-picker__option--active",
                    shared && "dil-picker__option--disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  id={optionId(entry.key)}
                  key={entry.key}
                  onClick={() => choose(entry)}
                  onMouseDown={(event) => event.preventDefault()}
                  role="option"
                >
                  <MaterialIcon
                    name={
                      !option
                        ? "block"
                        : shared
                          ? "hub"
                          : chosen
                            ? "check"
                            : "folder"
                    }
                  />
                  <span className="dil-picker__text">
                    <span className="dil-picker__title">
                      {option ? option.title : NO_PARENT_LABEL}
                    </span>
                    {option && (
                      <span className="dil-picker__path">
                        {shared ? SHARED_PARENT_NOTE : option.paths.en}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
            {entries.length === 0 && (
              <li className="dil-picker__none" role="presentation">
                No pages match.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
