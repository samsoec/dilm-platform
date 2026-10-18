"use client";

import { useConfig, useListQuery, useTableColumns } from "@payloadcms/ui";
import type { Where } from "payload";
import { formatAdminURL } from "payload/shared";
import { type DragEvent, useEffect, useState } from "react";

import { Popover } from "../kit/Popover";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import {
  clearFilters,
  type FacetCount,
  type FacetField,
  filterChips,
  flatWhere,
  selectedValues,
  SYNC_LABELS,
  toggleValue,
  withValues,
} from "./cvFilters";

const ALWAYS_ON = "applicantName";

const COLUMN_NAMES: Record<string, string> = {
  applicantNotifiedAt: "Emails",
};
const COLLECTION = "cv-submissions";

type Preset = { id: number | string; title: string; where?: Where };

export function CvToolbarClient({
  positions,
  syncStates,
}: {
  positions: FacetCount[];
  syncStates: FacetCount[];
}) {
  const { query, refineListData } = useListQuery();
  const where = flatWhere(query.where as Where | undefined);
  const [search, setSearch] = useState(String(query.search ?? ""));
  const chips = filterChips(where);

  useEffect(() => {
    const current = String(query.search ?? "");
    if (search === current) return;
    const timer = setTimeout(
      () => void refineListData({ search, page: 1 }),
      300,
    );
    return () => clearTimeout(timer);
  }, [query.search, refineListData, search]);

  const setWhere = (next: Where) =>
    void refineListData({ where: next, page: 1 });

  return (
    <div className="dil-toolbar">
      <label className="dil-toolbar__search">
        <MaterialIcon name="search" />
        <span className="dil-sr-only">Search applications</span>
        <input
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by applicant name or email"
          type="search"
          value={search}
        />
        {search && (
          <button
            aria-label="Clear search"
            className="dil-toolbar__clear-search"
            onClick={() => setSearch("")}
            type="button"
          >
            <MaterialIcon name="close" />
          </button>
        )}
      </label>
      <FacetMenu
        field="position"
        label="Position"
        onChange={setWhere}
        options={positions}
        searchable
        where={where}
      />
      <FacetMenu
        field="externalSyncStatus"
        label="Job platform sync"
        onChange={setWhere}
        options={["pending", "synced", "failed"].map((value) => ({
          value,
          count: syncStates.find((state) => state.value === value)?.count ?? 0,
        }))}
        where={where}
      />
      {chips.length > 0 && (
        <span className="dil-toolbar__chips">
          {chips.map((chip) => (
            <span
              className="dil-toolbar__chip"
              key={`${chip.field}-${chip.value}`}
            >
              {chip.label}
              <button
                aria-label={`Remove ${chip.label}`}
                onClick={() =>
                  setWhere(
                    withValues(
                      where,
                      chip.field,
                      selectedValues(where, chip.field).filter(
                        (value) => value !== chip.value,
                      ),
                    ),
                  )
                }
                type="button"
              >
                <MaterialIcon name="close" />
              </button>
            </span>
          ))}
          <button
            className="dil-toolbar__clear-all"
            onClick={() => {
              setSearch("");
              void refineListData({
                where: clearFilters(where),
                search: "",
                page: 1,
                preset: "",
              });
            }}
            type="button"
          >
            Clear all
          </button>
        </span>
      )}
      <span className="dil-toolbar__end">
        <ViewsMenu activePreset={query.preset} where={where} />
        <ColumnsMenu />
      </span>
    </div>
  );
}

function FacetMenu({
  field,
  label,
  options,
  where,
  onChange,
  searchable = false,
}: {
  field: FacetField;
  label: string;
  options: FacetCount[];
  where: Where;
  onChange: (where: Where) => void;
  searchable?: boolean;
}) {
  const [find, setFind] = useState("");
  const selected = selectedValues(where, field);
  const shown = options.filter(({ value }) =>
    value.toLowerCase().includes(find.trim().toLowerCase()),
  );
  return (
    <Popover active={selected.length > 0} label={label}>
      {() => (
        <div className="dil-menu">
          {searchable && (
            <label className="dil-menu__find">
              <MaterialIcon name="search" />
              <span className="dil-sr-only">Find position</span>
              <input
                onChange={(event) => setFind(event.target.value)}
                placeholder="Find position"
                type="search"
                value={find}
              />
            </label>
          )}
          <ul className="dil-menu__list" role="group" aria-label={label}>
            {shown.map(({ value, count }) => {
              const checked = selected.includes(value);
              return (
                <li key={value}>
                  <label
                    className={`dil-menu__option${checked ? " dil-menu__option--checked" : ""}`}
                  >
                    <input
                      checked={checked}
                      onChange={() =>
                        onChange(toggleValue(where, field, value))
                      }
                      type="checkbox"
                    />
                    <span className="dil-menu__label">
                      {field === "externalSyncStatus"
                        ? (SYNC_LABELS[value] ?? value)
                        : value}
                    </span>
                    <span className="dil-menu__count">{count}</span>
                  </label>
                </li>
              );
            })}
            {shown.length === 0 && (
              <li className="dil-menu__empty">No positions match.</li>
            )}
          </ul>
        </div>
      )}
    </Popover>
  );
}

function ColumnsMenu() {
  const { columns, moveColumn, toggleColumn } = useTableColumns();
  const [dragging, setDragging] = useState<number>();
  const visible = columns.filter((column) => !column.accessor.startsWith("_"));

  const onDrop = (event: DragEvent, toIndex: number) => {
    event.preventDefault();
    if (dragging === undefined || dragging === toIndex) return;
    void moveColumn({ fromIndex: dragging, toIndex });
    setDragging(undefined);
  };

  return (
    <Popover align="end" icon="view_column" label="Columns" trailingIcon={null}>
      {() => (
        <div className="dil-menu">
          <span className="dil-menu__heading">Show columns</span>
          <ul className="dil-menu__list">
            {visible.map((column) => {
              const index = columns.indexOf(column);
              const always = column.accessor === ALWAYS_ON;
              const fieldLabel = (column.field as { label?: unknown })?.label;
              const label =
                COLUMN_NAMES[column.accessor] ??
                (typeof fieldLabel === "string" ? fieldLabel : column.accessor);
              return (
                <li
                  draggable={!always}
                  key={column.accessor}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={() => setDragging(index)}
                  onDrop={(event) => onDrop(event, index)}
                >
                  <label
                    className={`dil-menu__option${always ? " dil-menu__option--fixed" : ""}`}
                  >
                    <input
                      checked={always || column.active}
                      disabled={always}
                      onChange={() => void toggleColumn(column.accessor)}
                      type="checkbox"
                    />
                    <span className="dil-menu__label">{String(label)}</span>
                    {always ? (
                      <span className="dil-menu__count">Always</span>
                    ) : (
                      <MaterialIcon
                        className="dil-menu__drag"
                        name="drag_indicator"
                      />
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
          <span className="dil-menu__note">Remembered for you.</span>
        </div>
      )}
    </Popover>
  );
}

function ViewsMenu({
  activePreset,
  where,
}: {
  activePreset?: number | string | null;
  where: Where;
}) {
  return (
    <Popover align="end" icon="bookmark" label="Views" trailingIcon={null}>
      {(close) => (
        <ViewsPanel activePreset={activePreset} close={close} where={where} />
      )}
    </Popover>
  );
}

function ViewsPanel({
  activePreset,
  where,
  close,
}: {
  activePreset?: number | string | null;
  where: Where;
  close: () => void;
}) {
  const { refineListData } = useListQuery();
  const { columns } = useTableColumns();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [presets, setPresets] = useState<Preset[]>();
  const [naming, setNaming] = useState(false);
  const [title, setTitle] = useState("");
  const api = (path: `/${string}`) =>
    formatAdminURL({ apiRoute: routes.api, serverURL, path });

  useEffect(() => {
    const request = new AbortController();
    fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/payload-query-presets?depth=0&limit=50&sort=title&where[relatedCollection][equals]=${COLLECTION}`,
      }),
      { credentials: "include", signal: request.signal },
    )
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((body: { docs: Preset[] }) => setPresets(body.docs))
      .catch(() => undefined);
    return () => request.abort();
  }, [routes.api, serverURL]);

  const save = async () => {
    const name = title.trim();
    if (!name) return;
    const response = await fetch(api("/payload-query-presets"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: name,
        relatedCollection: COLLECTION,
        where,
        columns: columns.map(({ accessor, active }) => ({ accessor, active })),
      }),
    });
    if (!response.ok) {
      notify({
        tone: "error",
        title: "Couldn't save the view.",
        body: "Try again.",
      });
      return;
    }
    const { doc } = (await response.json()) as { doc: Preset };
    notify({ tone: "success", title: `Saved “${doc.title}”.` });
    close();
    void refineListData({ preset: doc.id, where });
  };

  return (
    <div className="dil-menu">
      <span className="dil-menu__heading">My views</span>
      <ul className="dil-menu__list">
        {presets?.map((preset) => {
          const active = String(preset.id) === String(activePreset ?? "");
          return (
            <li key={preset.id}>
              <button
                aria-current={active || undefined}
                className={`dil-menu__option${active ? " dil-menu__option--checked" : ""}`}
                onClick={() => {
                  close();
                  void refineListData({
                    preset: preset.id,
                    where: preset.where ?? {},
                    search: "",
                    page: 1,
                  });
                }}
                type="button"
              >
                <MaterialIcon name="bookmark" />
                <span className="dil-menu__label">{preset.title}</span>
                {active && <MaterialIcon name="check" />}
              </button>
            </li>
          );
        })}
        {presets?.length === 0 && (
          <li className="dil-menu__empty">No saved views yet.</li>
        )}
      </ul>
      <div className="dil-menu__divider" />
      {naming ? (
        <form
          className="dil-menu__save"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <label className="dil-sr-only" htmlFor="dil-view-name">
            View name
          </label>
          <input
            autoFocus
            id="dil-view-name"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Name this view"
            value={title}
          />
          <button disabled={!title.trim()} type="submit">
            Save
          </button>
        </form>
      ) : (
        <button
          className="dil-menu__action"
          onClick={() => setNaming(true)}
          type="button"
        >
          <MaterialIcon name="bookmark_add" />
          Save current filters…
        </button>
      )}
    </div>
  );
}
