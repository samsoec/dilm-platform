"use client";

import { useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Banner } from "../kit/Banner";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import { MaterialIcon } from "../MaterialIcon";
import { TrashActions } from "../trash/TrashActions";
import { TRASH_EMPTY } from "../trash/trash";
import { NewPageButton } from "./NewPageHost";
import { PageRowMenu } from "./PageRowMenu";
import {
  canCreatePage,
  EMPTY_TEXT,
  EMPTY_TITLE,
  FILTER_LABELS,
  FILTERS,
  type Filter,
  filterCounts,
  footerText,
  type PageRow,
  parentKeys,
  rowActions,
  type TrashRow,
  trashActions,
  type Viewer,
  VIEWER_BANNER,
  visibleRows,
} from "./pagesModel";

export type PagesTreeProps = {
  rows: PageRow[];
  trash: TrashRow[];
  company: { name: string; initials: string };
  locale: string;
  viewer: Viewer;
  initialFilter: Filter;
  noCompany: boolean;
};

function initialExpanded(rows: PageRow[]): Set<string> {
  return new Set(
    parentKeys(rows.filter(({ shared, depth }) => !shared && depth === 0)),
  );
}

export function PagesTree({
  rows,
  trash,
  company,
  locale,
  viewer,
  initialFilter,
  noCompany,
}: PagesTreeProps) {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(() => initialExpanded(rows));
  const [active, setActive] = useState<string>();
  const treeRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  const counts = useMemo(
    () => filterCounts(rows, trash.length),
    [rows, trash.length],
  );
  const allParents = useMemo(() => parentKeys(rows), [rows]);
  const narrowed = filter !== "all" || query.trim() !== "";
  const { rows: shown, context } = useMemo(
    () => visibleRows(rows, { expanded, filter, query }),
    [rows, expanded, filter, query],
  );
  const everyOpen =
    allParents.length > 0 && allParents.every((key) => expanded.has(key));
  const own = rows.filter(({ shared }) => !shared).length;
  const empty = own === 0 && !narrowed && !noCompany;
  const inTrash = filter === "trash";
  const childCounts = useMemo(() => {
    const byParent = new Map<string, number>();
    for (const { parentKey } of rows) {
      if (parentKey)
        byParent.set(parentKey, (byParent.get(parentKey) ?? 0) + 1);
    }
    return byParent;
  }, [rows]);

  const activeKey = shown.some(({ key }) => key === active)
    ? active
    : shown[0]?.key;

  useEffect(() => {
    const mark = () => {
      treeRef.current
        ?.querySelectorAll<HTMLElement>("[data-full]")
        .forEach((element) => {
          element.dataset.clipped = String(
            element.scrollWidth > element.clientWidth,
          );
        });
    };
    mark();
    window.addEventListener("resize", mark);
    return () => window.removeEventListener("resize", mark);
  }, [shown]);

  const focusRow = (key: string | undefined) => {
    if (!key) return;
    setActive(key);
    [
      ...(treeRef.current?.querySelectorAll<HTMLElement>('[role="treeitem"]') ??
        []),
    ]
      .find((element) => element.dataset.key === key)
      ?.focus();
  };

  const toggle = (key: string, open: boolean) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (open) next.add(key);
      else next.delete(key);
      return next;
    });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const key = target.dataset.key;
    if (!key || target.getAttribute("role") !== "treeitem") return;
    const at = shown.findIndex((row) => row.key === key);
    const row = shown[at];
    if (!row) return;
    const open = !narrowed && expanded.has(key);
    const expandable = !narrowed && row.hasChildren;
    let handled = true;
    switch (event.key) {
      case "ArrowDown":
        focusRow(shown[at + 1]?.key);
        break;
      case "ArrowUp":
        focusRow(shown[at - 1]?.key);
        break;
      case "Home":
        focusRow(shown[0]?.key);
        break;
      case "End":
        focusRow(shown[shown.length - 1]?.key);
        break;
      case "ArrowRight":
        if (expandable && !open) toggle(key, true);
        else if (expandable && open) focusRow(shown[at + 1]?.key);
        break;
      case "ArrowLeft":
        if (expandable && open) toggle(key, false);
        else if (row.parentKey && shown.some((r) => r.key === row.parentKey)) {
          focusRow(row.parentKey);
        }
        break;
      case "Enter":
        router.push(
          formatAdminURL({
            adminRoute: admin,
            path: `/collections/${row.collection}/${row.id}`,
          }),
        );
        break;
      default:
        handled = false;
    }
    if (handled) event.preventDefault();
  };

  const createHref = formatAdminURL({
    adminRoute: admin,
    path: "/collections/pages/create",
  });

  return (
    <div className="dil-pages">
      {!viewer.canEdit && (
        <Banner className="dil-pages__banner" tone="readonly">
          {VIEWER_BANNER(company.initials)}
        </Banner>
      )}
      {noCompany && (
        <Banner className="dil-pages__banner" icon="domain" tone="info">
          Pick a company in the sidebar to see its pages. Shared pages are
          listed below.
        </Banner>
      )}
      {!(empty && trash.length === 0) && (
        <div className="dil-pages__toolbar">
          <label className="dil-toolbar__search" htmlFor={searchId}>
            <MaterialIcon name="search" />
            <input
              autoComplete="off"
              id={searchId}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or URL"
              type="search"
              value={query}
            />
            {query && (
              <button
                aria-label="Clear search"
                className="dil-toolbar__clear-search"
                onClick={() => setQuery("")}
                type="button"
              >
                <MaterialIcon name="close" />
              </button>
            )}
          </label>
          <div
            aria-label="Filter pages"
            className="dil-filter-chips"
            role="group"
          >
            {FILTERS.map((name) => (
              <button
                aria-pressed={filter === name}
                className="dil-filter-chip"
                key={name}
                onClick={() => setFilter(name)}
                type="button"
              >
                {name === "trash" && <MaterialIcon name="delete" />}
                {FILTER_LABELS[name]} · {counts[name]}
              </button>
            ))}
          </div>
          {!inTrash && (
            <button
              className="dil-toolbar__clear-all dil-pages__expand"
              disabled={narrowed || allParents.length === 0}
              onClick={() =>
                setExpanded(everyOpen ? new Set() : new Set(allParents))
              }
              type="button"
            >
              {everyOpen ? "Collapse all" : "Expand all"}
            </button>
          )}
        </div>
      )}

      {inTrash ? (
        <TrashList rows={trash} viewer={viewer} company={company.name} />
      ) : empty ? (
        <section className="dil-empty">
          <span aria-hidden className="dil-empty__icon">
            <MaterialIcon name="account_tree" />
          </span>
          <h3 className="dil-empty__title">{EMPTY_TITLE(company.name)}</h3>
          <p className="dil-empty__text">{EMPTY_TEXT}</p>
          {canCreatePage(viewer) && !noCompany && (
            <NewPageButton fallbackHref={createHref} />
          )}
        </section>
      ) : (
        <>
          <div className="dil-pages__card">
            <div aria-hidden="true" className="dil-page-row dil-page-row--head">
              <span>Title</span>
              <span>URL ({locale.toUpperCase()})</span>
              <span>Status</span>
              <span>Reach</span>
              <span>Last saved</span>
              <span />
            </div>
            {shown.length === 0 ? (
              <p className="dil-pages__none">No pages match these filters.</p>
            ) : (
              <div
                aria-label="Pages"
                onKeyDown={onKeyDown}
                ref={treeRef}
                role="tree"
              >
                {shown.map((row) => {
                  const actions = rowActions(row, viewer);
                  const open = !narrowed && expanded.has(row.key);
                  const isActive = row.key === activeKey;
                  const href = formatAdminURL({
                    adminRoute: admin,
                    path: `/collections/${row.collection}/${row.id}`,
                  });
                  return (
                    <div
                      aria-expanded={
                        !narrowed && row.hasChildren ? open : undefined
                      }
                      aria-level={row.depth + 1}
                      className={`dil-page-row${context.has(row.key) ? " dil-page-row--context" : ""}`}
                      data-key={row.key}
                      key={row.key}
                      onFocus={(event) => {
                        if (event.target === event.currentTarget) {
                          setActive(row.key);
                        }
                      }}
                      role="treeitem"
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span
                        className="dil-page-row__title"
                        style={{ paddingInlineStart: row.depth * 26 }}
                      >
                        <span
                          aria-hidden="true"
                          className="dil-page-row__chevron"
                          onClick={() =>
                            row.hasChildren && !narrowed
                              ? toggle(row.key, !open)
                              : undefined
                          }
                        >
                          {!narrowed && row.hasChildren && (
                            <MaterialIcon
                              name={open ? "expand_more" : "chevron_right"}
                            />
                          )}
                        </span>
                        <MaterialIcon
                          className="dil-page-row__icon"
                          name={
                            row.icon === "folder" && open
                              ? "folder_open"
                              : row.icon
                          }
                        />
                        <Link
                          className="dil-page-row__name"
                          data-full={row.title}
                          href={href}
                          prefetch={false}
                          tabIndex={isActive ? 0 : -1}
                          title={row.title}
                        >
                          {row.title}
                        </Link>
                        {row.tags.map((tag) => (
                          <span
                            className={`dil-page-row__tag dil-page-row__tag--${tag.kind}`}
                            key={tag.kind}
                            title={tag.label}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </span>
                      <span className="dil-page-row__url" title={row.url}>
                        {row.url}
                      </span>
                      <span>
                        <PublishBadge status={row.status} />
                      </span>
                      <span>
                        <ReachBadge compact reach={row.reach} />
                      </span>
                      <span className="dil-page-row__saved">
                        <span>{row.savedLabel}</span>
                        {row.savedBy && <span>{row.savedBy}</span>}
                      </span>
                      <span className="dil-page-row__end">
                        {actions.menu ? (
                          <PageRowMenu
                            actions={actions}
                            childCount={childCounts.get(row.key) ?? 0}
                            row={row}
                            tabIndex={isActive ? 0 : -1}
                          />
                        ) : actions.locked ? (
                          <span
                            className="dil-page-row__lock"
                            title="Shared pages: only a Super Admin can change them."
                          >
                            <MaterialIcon name="lock" />
                            <span className="dil-sr-only">
                              Locked. Only a Super Admin can change shared
                              pages.
                            </span>
                          </span>
                        ) : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="dil-pages__footer">
            <span>{footerText(rows, company.name)}</span>
            <span>
              <MaterialIcon name="lock" />
              Shared pages: only a Super Admin can change them.
            </span>
            <span>
              <MaterialIcon name="subdirectory_arrow_right" />
              Forwards = container page, visitors go to its target.
            </span>
          </div>
        </>
      )}
      <p aria-live="polite" className="dil-sr-only" role="status">
        {inTrash
          ? `${trash.length} pages in the trash`
          : `${shown.length} of ${rows.length} pages shown`}
      </p>
    </div>
  );
}

function TrashList({
  rows,
  viewer,
  company,
}: {
  rows: TrashRow[];
  viewer: Viewer;
  company: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="dil-trash">
        <p className="dil-pages__none">{TRASH_EMPTY}</p>
      </div>
    );
  }
  return (
    <div className="dil-trash">
      <table className="dil-trash__table">
        <thead>
          <tr>
            <th scope="col">Page</th>
            <th scope="col">Trashed</th>
            <th scope="col">By</th>
            <th scope="col">
              <span className="dil-sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const actions = trashActions(row, viewer);
            return (
              <tr key={row.key}>
                <td>
                  <span className="dil-pages__trashed">
                    <span className="dil-pages__trashed-title">
                      {row.title}
                    </span>
                    <span className="dil-pages__trashed-url">
                      was {row.url}
                    </span>
                  </span>
                </td>
                <td>{row.trashedLabel}</td>
                <td>{row.trashedBy}</td>
                <td>
                  {actions.restore && (
                    <TrashActions
                      canDelete={actions.remove}
                      collectionSlug={row.collection}
                      company={row.shared ? "all sites" : company}
                      id={Number(row.id)}
                      restoreData={row.restore}
                      title={row.title}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="dil-trash__note">
        Restored pages come back as drafts under their old parent (or top level
        if it&apos;s gone). &quot;Delete permanently&quot; shows for Super
        Admins only.
      </p>
    </div>
  );
}
