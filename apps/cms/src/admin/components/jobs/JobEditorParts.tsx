"use client";

import {
  useConfig,
  useDocumentInfo,
  useField,
  useFormFields,
  useLocale,
  useModal,
} from "@payloadcms/ui";
import { useEffect, useId, useMemo, useState } from "react";

import { RefreshAfterSave, useLiveStatus } from "../editor/EditorHeader";
import { computeUrls, type ParentPaths } from "../editor/urls";
import { SegmentedControl } from "../kit/SegmentedControl";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import { getReach } from "../kit/reach";
import type { PublishStatus } from "../kit/publication";
import { MaterialIcon } from "../MaterialIcon";
import {
  CLOSE_LEAVES,
  CLOSE_REACHABLE,
  comboOptions,
  closeTitle,
  createLabel,
  LOCATION_HINT,
  SUGGESTIONS_HEADING,
  type Option,
  type Suggestion,
} from "./jobs";

export function JobHeader({
  status,
  domain,
  careerPaths,
  slugs,
}: {
  status: PublishStatus;
  domain: string;
  careerPaths: ParentPaths | undefined;
  slugs: Record<string, string>;
}) {
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const slug = useFormFields(([fields]) => fields.slug?.value) as
    string | undefined;
  const live = useLiveStatus(status);
  const { code } = useLocale();
  const {
    config: { localization },
  } = useConfig();
  const defaultLocale = localization ? localization.defaultLocale : code;
  const row = useMemo(
    () =>
      computeUrls({
        domain,
        locales: [code],
        defaultLocale,
        slugs: { ...slugs, [code]: slug ?? "" },
        parentPaths: careerPaths,
      })[0],
    [careerPaths, code, defaultLocale, domain, slug, slugs],
  );
  return (
    <header className="dil-editor-header">
      <RefreshAfterSave />
      <div className="dil-editor-header__row">
        <h1 className="dil-editor-title">{title?.trim() || "Untitled job"}</h1>
        <PublishBadge status={live} />
        <ReachBadge
          reach={getReach(
            { tenant: domain || "own" },
            { collection: "jobs", tenants: [{ id: domain || "own", domain }] },
          )}
        />
      </div>
      {careerPaths && row && !row.incomplete && (
        <p className="dil-product-address">
          <code className="dil-editor-urls__url">{row.display}</code>
        </p>
      )}
    </header>
  );
}

type FieldProps = { path?: string; field?: { label?: unknown } };

const CLOSE_SLUG = "dil-job-close";

const LISTING_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
] as const;

export function JobStatusField({ path = "status", field }: FieldProps) {
  const { value, setValue } = useField<string>({ path });
  const { hasSavePermission } = useDocumentInfo();
  const { openModal } = useModal();
  const title = useFormFields(([fields]) => fields.title?.value) as
    string | undefined;
  const editable = hasSavePermission !== false;
  const label = typeof field?.label === "string" ? field.label : "Listing";
  const choose = (next: "open" | "closed") => {
    if (next === value) return;
    if (next === "closed") openModal(CLOSE_SLUG);
    else setValue(next);
  };
  return (
    <div className="dil-jobs__listing field-type">
      <span className="field-label">{label}</span>
      <SegmentedControl
        disabled={!editable}
        label={label}
        onChange={choose}
        options={LISTING_OPTIONS}
        value={value === "closed" ? "closed" : "open"}
      />
      <ConfirmDialog
        body={
          <ul className="dil-editor-publish__urls">
            <li>
              <MaterialIcon name="visibility_off" /> {CLOSE_LEAVES}
            </li>
            <li>
              <MaterialIcon name="link" /> {CLOSE_REACHABLE}
            </li>
          </ul>
        }
        confirmLabel="Close job"
        onConfirm={() => setValue("closed")}
        slug={CLOSE_SLUG}
        title={closeTitle(title?.trim() || "this job")}
        tone="discard"
      />
    </div>
  );
}

function useSuggestions(field: "department" | "location"): Suggestion[] {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const { code } = useLocale();
  const tenant = useFormFields(([fields]) => fields.tenant?.value) as
    number | string | { id: number | string } | null | undefined;
  const tenantId =
    tenant && typeof tenant === "object" ? tenant.id : (tenant ?? "");
  const [found, setFound] = useState<Suggestion[]>([]);
  useEffect(() => {
    if (tenantId === "") return;
    const request = new AbortController();
    const params = new URLSearchParams({
      tenant: String(tenantId),
      locale: String(code),
    });
    fetch(`${serverURL ?? ""}${routes.api}/jobs/suggestions?${params}`, {
      credentials: "include",
      signal: request.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("suggestions");
        const all = (await response.json()) as Record<string, Suggestion[]>;
        setFound(all[field] ?? []);
      })
      .catch(() => undefined);
    return () => request.abort();
  }, [code, field, routes.api, serverURL, tenantId]);
  return found;
}

function SuggestField({
  path,
  field,
  name,
  hint,
}: FieldProps & { name: "department" | "location"; hint?: string }) {
  const { value, setValue, showError } = useField<string>({
    path: path ?? name,
  });
  const { hasSavePermission } = useDocumentInfo();
  const suggestions = useSuggestions(name);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputId = useId();
  const typed = value ?? "";
  const options = comboOptions(suggestions, typed);
  const label = typeof field?.label === "string" ? field.label : name;
  const pick = (option: Option) => {
    setValue(option.value);
    setOpen(false);
  };
  return (
    <div
      className={[
        "dil-combo field-type text",
        showError && "error",
        hasSavePermission === false && "read-only",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field-type__wrap">
        <input
          aria-activedescendant={
            open && options[active] ? `${listId}-${active}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          autoComplete="off"
          disabled={hasSavePermission === false}
          id={inputId}
          onBlur={() => setOpen(false)}
          onChange={(event) => {
            setValue(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((index) => Math.min(index + 1, options.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && open && options[active]) {
              event.preventDefault();
              pick(options[active]);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          role="combobox"
          type="text"
          value={typed}
        />
      </div>
      {hint && <span className="dil-field-hint">{hint}</span>}
      {open && options.length > 0 && (
        <ul className="dil-combo__list" id={listId} role="listbox">
          {suggestions.length > 0 && (
            <li aria-hidden className="dil-combo__heading">
              {SUGGESTIONS_HEADING}
            </li>
          )}
          {options.map((option, index) => (
            <li
              aria-selected={index === active}
              className="dil-combo__option"
              id={`${listId}-${index}`}
              key={`${option.kind}:${option.value}`}
              onMouseDown={(event) => {
                event.preventDefault();
                pick(option);
              }}
              role="option"
            >
              {option.kind === "create" ? (
                createLabel(option.value)
              ) : (
                <>
                  {option.value}
                  <span className="dil-combo__count">
                    {option.count} {option.count === 1 ? "job" : "jobs"}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DepartmentField(props: FieldProps) {
  return <SuggestField {...props} name="department" />;
}

export function LocationField(props: FieldProps) {
  return <SuggestField {...props} hint={LOCATION_HINT} name="location" />;
}
