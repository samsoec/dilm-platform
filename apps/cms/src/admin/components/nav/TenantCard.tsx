"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { useConfig, useTranslation } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import type { ViewTypes } from "payload";
import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { type TenantColors, tenantColors } from "../../brandColor";
import type { SidebarTenant } from "../../data/sidebar";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { MaterialIcon } from "../MaterialIcon";
import { type CompanyDetail, useCompanyDetails } from "./companyDetails";
import { listboxKey, typeaheadIndex } from "./listbox";

const TYPEAHEAD_RESET_MS = 600;

type TenantOption = { label: string; value: number | string };

function colorStyle({ light, dark }: TenantColors): CSSProperties {
  return {
    "--dil-tenant": light,
    "--dil-tenant-dark": dark,
  } as CSSProperties;
}

function TenantFace({
  tenant,
  name,
  switchable,
  open = false,
}: {
  tenant?: SidebarTenant;
  name?: string;
  switchable: boolean;
  open?: boolean;
}) {
  return (
    <>
      <span className="dil-tenant-card__logo">
        {tenant?.logo ? (
          <img alt={tenant.logo.alt} src={tenant.logo.url} />
        ) : (
          <MaterialIcon name="domain" />
        )}
      </span>
      <span className="dil-tenant-card__text">
        <span className="dil-tenant-card__eyebrow">
          {name ? "Editing" : "Viewing"}
        </span>
        <span className="dil-tenant-card__name">{name ?? "All companies"}</span>
        <span className="dil-tenant-card__domain">
          {name ? tenant?.domain : "Choose a company to edit its site"}
        </span>
      </span>
      {switchable && (
        <MaterialIcon
          className="dil-tenant-card__switch"
          name={open ? "unfold_less" : "unfold_more"}
        />
      )}
    </>
  );
}

export function TenantCard({
  tenant,
  viewType,
}: {
  tenant?: SidebarTenant;
  viewType?: ViewTypes;
}) {
  const { entityType, options, selectedTenantID, setTenant } =
    useTenantSelection();
  const { guard, setCompany } = useUnsavedChangesGuard();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: "", at: 0 });
  const listId = useId();
  const headingId = useId();
  const details = useCompanyDetails(open);
  const landingName = useLandingDocumentName();

  const tenantOptions = options as TenantOption[];
  const selectedIndex = tenantOptions.findIndex(
    ({ value }) => value === selectedTenantID,
  );
  const selected = tenantOptions[selectedIndex];
  const shown =
    tenant && selected && tenant.id === selected.value ? tenant : undefined;
  const colors = shown?.colors ?? tenantColors(undefined);
  const lockedToDocument =
    entityType !== "global" &&
    (viewType === "document" || viewType === "version");
  const switchable = tenantOptions.length > 1 && !lockedToDocument;

  const companySlug = shown?.slug;
  const companyColor = colors.light;
  useEffect(() => {
    const root = document.documentElement.style;
    if (!companySlug) return;
    root.setProperty("--dil-company-slug", JSON.stringify(companySlug));
    root.setProperty("--dil-company-color", companyColor);
    return () => {
      root.removeProperty("--dil-company-slug");
      root.removeProperty("--dil-company-color");
    };
  }, [companyColor, companySlug]);

  const companyName = selected?.label;
  const companyDomain = shown?.domain;
  useEffect(() => {
    setCompany(
      companyName
        ? { name: String(companyName), domain: companyDomain }
        : undefined,
    );
  }, [companyDomain, companyName, setCompany]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const closeOnOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!switchable) {
    return (
      <div
        className="dil-tenant-card"
        style={colorStyle(colors)}
        title={
          lockedToDocument && tenantOptions.length > 1
            ? "Leave this document to switch company."
            : undefined
        }
      >
        <TenantFace name={selected?.label} switchable={false} tenant={shown} />
      </div>
    );
  }

  const openList = () => {
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const switchTo = (option: TenantOption | undefined) => {
    if (option) setTenant({ id: option.value, refresh: true });
  };

  const choose = (index: number) => {
    const option = tenantOptions[index];
    close();
    if (!option || option.value === selectedTenantID) return;
    guard("company", () => switchTo(option));
  };

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const move = listboxKey(event.key, active, tenantOptions.length);
    if (move) {
      if (event.key !== "Tab") event.preventDefault();
      if ("index" in move) setActive(move.index);
      else if ("select" in move) choose(active);
      else setOpen(false);
      if ("close" in move && event.key === "Escape") buttonRef.current?.focus();
      return;
    }
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      const now = Date.now();
      const query =
        now - typeahead.current.at > TYPEAHEAD_RESET_MS
          ? event.key
          : typeahead.current.query + event.key;
      typeahead.current = { query, at: now };
      const found = typeaheadIndex(
        tenantOptions.map(({ label }) => label),
        query,
        query.length > 1 ? active - 1 : active,
      );
      if (found !== undefined) setActive(found);
    }
  };

  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <div className="dil-tenant-switch" ref={rootRef}>
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Editing ${selected?.label ?? "all companies"}. Switch company`}
        className="dil-tenant-card"
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKeyDown}
        ref={buttonRef}
        style={colorStyle(colors)}
        type="button"
      >
        <TenantFace
          name={selected?.label}
          open={open}
          switchable
          tenant={shown}
        />
      </button>
      {open && (
        <div className="dil-tenant-switch__popover">
          <span className="dil-tenant-switch__heading" id={headingId}>
            Switch company
          </span>
          <ul
            aria-activedescendant={optionId(active)}
            aria-labelledby={headingId}
            className="dil-tenant-switch__list"
            id={listId}
            onKeyDown={onListKeyDown}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
          >
            {tenantOptions.map((option, index) => (
              <li
                aria-selected={option.value === selectedTenantID}
                className={[
                  "dil-tenant-switch__option",
                  index === active && "dil-tenant-switch__option--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-index={index}
                id={optionId(index)}
                key={option.value}
                onClick={() => choose(index)}
                onMouseMove={() => setActive(index)}
                role="option"
              >
                <CompanyTile detail={details?.get(String(option.value))} />
                <span className="dil-tenant-switch__text">
                  <b className="dil-tenant-switch__name">{option.label}</b>
                  {details?.get(String(option.value))?.domain && (
                    <span className="dil-tenant-switch__domain">
                      {details.get(String(option.value))?.domain}
                    </span>
                  )}
                </span>
                {option.value === selectedTenantID ? (
                  <MaterialIcon
                    className="dil-tenant-switch__check"
                    name="check"
                  />
                ) : (
                  index === active && (
                    <span
                      aria-hidden="true"
                      className="dil-tenant-switch__enter"
                    >
                      ↵
                    </span>
                  )
                )}
              </li>
            ))}
          </ul>
          {entityType === "global" && landingName && (
            <p className="dil-tenant-switch__footer">
              You&apos;ll stay on <b>{landingName}</b>, for the company you
              pick.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CompanyTile({ detail }: { detail?: CompanyDetail }) {
  return (
    <span
      aria-hidden="true"
      className="dil-tenant-switch__tile"
      style={detail ? colorStyle(detail.colors) : undefined}
    >
      {detail?.logo ? (
        <img alt="" src={detail.logo} />
      ) : (
        <MaterialIcon name="domain" />
      )}
    </span>
  );
}

function labelText(label: unknown, language: string): string | undefined {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const byLanguage = label as Record<string, string>;
    return byLanguage[language] ?? byLanguage.en;
  }
  return undefined;
}

function useLandingDocumentName(): string | undefined {
  const pathname = usePathname();
  const { getEntityConfig } = useConfig();
  const { i18n } = useTranslation();
  const slug = pathname.match(/\/collections\/([^/]+)/)?.[1];
  if (!slug) return undefined;
  const entity = getEntityConfig({ collectionSlug: slug });
  return labelText(
    (entity as { labels?: { singular?: unknown } } | undefined)?.labels
      ?.singular,
    i18n.language,
  );
}
