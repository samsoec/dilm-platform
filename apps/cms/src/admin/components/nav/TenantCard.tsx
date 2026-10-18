"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { ConfirmationModal, useModal, useTranslation } from "@payloadcms/ui";
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
import { MaterialIcon } from "../MaterialIcon";
import { listboxKey, typeaheadIndex } from "./listbox";

const CONFIRM_SWITCH_SLUG = "dil-confirm-tenant-switch";
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
}: {
  tenant?: SidebarTenant;
  name?: string;
  switchable: boolean;
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
        <MaterialIcon className="dil-tenant-card__switch" name="unfold_more" />
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
  const { entityType, modified, options, selectedTenantID, setTenant } =
    useTenantSelection();
  const { closeModal, openModal } = useModal();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState<TenantOption>();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: "", at: 0 });
  const listId = useId();

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
    if (entityType === "global" && modified) {
      setPending(option);
      openModal(CONFIRM_SWITCH_SLUG);
    } else {
      switchTo(option);
    }
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
        <TenantFace name={selected?.label} switchable tenant={shown} />
      </button>
      {open && (
        <ul
          aria-activedescendant={optionId(active)}
          aria-label="Switch company"
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
              <span>{option.label}</span>
              {option.value === selectedTenantID && (
                <MaterialIcon name="check" />
              )}
            </li>
          ))}
        </ul>
      )}
      <ConfirmationModal
        body={t("general:changesNotSaved")}
        cancelLabel={t("general:stayOnThisPage")}
        confirmLabel={t("general:leaveAnyway")}
        heading={t("general:leaveWithoutSaving")}
        modalSlug={CONFIRM_SWITCH_SLUG}
        onCancel={() => closeModal(CONFIRM_SWITCH_SLUG)}
        onConfirm={() => switchTo(pending)}
      />
    </div>
  );
}
