"use client";

import {
  FieldLabel,
  useDocumentInfo,
  useForm,
  useFormFields,
  useLocale,
  useModal,
  useRowLabel,
} from "@payloadcms/ui";
import { useConfig } from "@payloadcms/ui";
import { useState } from "react";
import { createPortal } from "react-dom";

import { VERSIONS_DRAWER_SLUG } from "../document/VersionsDrawer";
import { RefreshAfterSave, useLiveStatus } from "../editor/EditorHeader";
import { useTabButtons } from "../editor/EditorTabs";
import { publishingLines } from "../editor/editor";
import { ActionButton } from "../kit/ActionButton";
import { PublishBadge } from "../kit/PublishBadge";
import { ReachBadge } from "../kit/ReachBadge";
import { UsedInPanel } from "../kit/UsedInPanel";
import type { UsedInData } from "../kit/usedIn";
import type { PublishStatus } from "../kit/publication";
import { allSitesLabel, ALL_SITES_COUNT } from "../kit/reach";
import { MaterialIcon } from "../MaterialIcon";
import {
  documentUses,
  droppedText,
  inheritedFrom,
  MAX_SPEC_ROWS,
  MAX_VARIANTS,
  ownerPanelText,
  hiddenRowsText,
  parseSpecs,
  PREVIEW_ROWS,
  specRowState,
  specsSchemaPath,
  PASTE_HINT,
  previewSpecs,
  sameOnSitesText,
  specsCountText,
  tabCountText,
  usedByText,
  variantSummary,
  variantsCountText,
  type VariantRow,
} from "./productEditor";

const ALL_REACH = {
  scope: "all" as const,
  sites: ALL_SITES_COUNT,
  label: allSitesLabel(),
};

export function ProductHeader({
  status,
  domains,
  path,
}: {
  status: PublishStatus;
  domains: string[];
  path: string;
}) {
  const name = useFormFields(([fields]) => fields.name?.value) as
    string | undefined;
  const live = useLiveStatus(status);
  const slug = useFormFields(([fields]) => fields.slug?.value) as
    string | undefined;
  const shown = path || (slug ? `/${slug}` : "");
  return (
    <header className="dil-editor-header">
      <RefreshAfterSave />
      <div className="dil-editor-header__row">
        <h1 className="dil-editor-title">
          {typeof name === "string" && name.trim()
            ? name.trim()
            : "Untitled product"}
        </h1>
        <PublishBadge status={live} />
        <ReachBadge reach={ALL_REACH} />
      </div>
      <p className="dil-product-address">
        {shown && <code className="dil-editor-urls__url">{shown}</code>}
        <span className="dil-product-address__note">
          {sameOnSitesText(domains)}
        </span>
      </p>
    </header>
  );
}

export function ProductTabMarks() {
  const buttons = useTabButtons();
  const variants = useFormFields(
    ([fields]) => fields.variants?.rows?.length ?? 0,
  );
  const applications = useFormFields(
    ([fields]) => fields.applications?.rows?.length ?? 0,
  );
  const tabNamed = (label: string) =>
    buttons.find((button) =>
      (button.textContent ?? "").trim().startsWith(label),
    );
  const variantsTab = tabNamed("Variants");
  const applicationsTab = tabNamed("Applications");
  return (
    <>
      {variantsTab &&
        createPortal(
          <span className="dil-tab-count">{tabCountText(variants)}</span>,
          variantsTab,
        )}
      {applicationsTab &&
        createPortal(
          <span className="dil-tab-count">{tabCountText(applications)}</span>,
          applicationsTab,
        )}
    </>
  );
}

function useRows(path: string): number {
  return useFormFields(([fields]) => fields[path]?.rows?.length ?? 0);
}

export function VariantsLabel({ path }: { path?: string }) {
  const count = useRows(path ?? "variants");
  return (
    <span className="dil-array-count">
      Variants {variantsCountText(count, MAX_VARIANTS)}
    </span>
  );
}

export function SpecsLabel({ path }: { path?: string }) {
  const count = useRows(path ?? "specs");
  return (
    <span className="dil-array-count">
      Specifications {specsCountText(count, MAX_SPEC_ROWS)}
    </span>
  );
}

export function VariantRowLabel() {
  const { data, rowNumber } = useRowLabel<VariantRow>();
  const productFormula = useFormFields(([fields]) => fields.formula?.value);
  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const parts = variantSummary(data ?? {}, productFormula);
  return (
    <span className="dil-row-label">
      <span className="dil-row-label__number">
        {rowNumber === undefined ? "" : String(rowNumber + 1).padStart(2, "0")}
      </span>
      <span
        className={`dil-row-label__title${name ? "" : " dil-row-label__title--empty"}`}
      >
        {name || "Untitled variant"}
      </span>
      {parts.map((part) => (
        <span className="dil-row-label__meta" key={part}>
          {part}
        </span>
      ))}
    </span>
  );
}

export function InheritedNote({
  path,
  field,
}: {
  path?: string;
  field?: { name?: string };
}) {
  const own = useFormFields(([fields]) => (path ? fields[path]?.value : ""));
  const product = useFormFields(([fields]) =>
    field?.name ? fields[field.name]?.value : "",
  );
  const { empty, text } = inheritedFrom(own, product);
  if (!empty) return null;
  return (
    <span className="dil-inherited">
      · from product{text ? `: ${text}` : ""}
    </span>
  );
}

export function DocumentUsage({
  path,
  field,
}: {
  path?: string;
  field?: { name?: string };
}) {
  const name = field?.name === "sdsFile" ? "sdsFile" : "pdsFile";
  const value = useFormFields(([fields]) => (path ? fields[path]?.value : ""));
  const uses = useFormFields(([fields]) => {
    const count = fields.variants?.rows?.length ?? 0;
    return documentUses(
      Array.from({ length: count }, (_, index) => ({
        [name]: fields[`variants.${index}.${name}`]?.value,
      })),
      name,
      value,
    );
  });
  return (
    <p className="dil-document-slot">
      <MaterialIcon name={value ? "picture_as_pdf" : "upload_file"} />
      {value ? usedByText(uses) : "Pick from Documents, or upload a PDF here."}
    </p>
  );
}

export function SpecsPaste({ path }: { path?: string }) {
  const arrayPath = path ?? "specs";
  const { addFieldRow } = useForm();
  const { code } = useLocale();
  const { hasSavePermission } = useDocumentInfo();
  const {
    config: { localization },
  } = useConfig();
  const existing = useRows(arrayPath);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const defaultLocale = localization ? localization.defaultLocale : code;
  if (code !== defaultLocale || hasSavePermission === false) return null;

  const pasted = parseSpecs(text);
  const preview = previewSpecs(existing, pasted, MAX_SPEC_ROWS);
  const apply = () => {
    preview.accepted.forEach((row, offset) => {
      addFieldRow({
        path: arrayPath,
        rowIndex: existing + offset,
        schemaPath: specsSchemaPath(arrayPath),
        subFieldState: specRowState(row),
      });
    });
    setText("");
    setOpen(false);
  };

  return (
    <div className="dil-spec-paste">
      <ActionButton
        icon="add"
        onClick={() => setOpen((current) => !current)}
        type="button"
        variant="secondary"
      >
        Paste from spreadsheet
      </ActionButton>
      {open && (
        <div className="dil-spec-paste__panel">
          <label className="dil-spec-paste__label">
            <span>{PASTE_HINT}</span>
            <textarea
              className="dil-spec-paste__input"
              onChange={(event) => setText(event.target.value)}
              rows={6}
              value={text}
            />
          </label>
          {pasted.length > 0 && (
            <>
              <table className="dil-spec-paste__table">
                <thead>
                  <tr>
                    <th scope="col">Parameter</th>
                    <th scope="col">Method</th>
                    <th scope="col">Guaranteed value</th>
                  </tr>
                </thead>
                <tbody>
                  {pasted.slice(0, PREVIEW_ROWS).map((row, index) => (
                    <tr
                      className={
                        index >= preview.accepted.length ? "is-over" : ""
                      }
                      key={`${index}:${row.parameter}`}
                    >
                      {(["parameter", "method", "value"] as const).map(
                        (column) => (
                          <td
                            className={
                              row.missing.includes(column) ? "is-missing" : ""
                            }
                            key={column}
                          >
                            {row[column] || "Missing"}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {pasted.length > PREVIEW_ROWS && (
                <p className="dil-spec-paste__summary">
                  {hiddenRowsText(pasted.length)}
                </p>
              )}
              <p aria-live="polite" className="dil-spec-paste__summary">
                {preview.text}
              </p>
              {preview.dropped > 0 && (
                <p className="dil-spec-paste__summary" role="alert">
                  {droppedText(preview.dropped, MAX_SPEC_ROWS)}
                </p>
              )}
            </>
          )}
          <div className="dil-spec-paste__actions">
            <ActionButton
              onClick={apply}
              type="button"
              unavailableReason={
                preview.accepted.length === 0
                  ? "Paste at least one row."
                  : undefined
              }
            >
              Add rows
            </ActionButton>
            <ActionButton
              onClick={() => setOpen(false)}
              type="button"
              variant="text"
            >
              Cancel
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

export function ShortDescriptionLabel({
  path,
  field,
  limit,
}: {
  path?: string;
  field?: { label?: string };
  limit: number;
}) {
  const length = useFormFields(([fields]) => {
    const value = path ? fields[path]?.value : "";
    return typeof value === "string" ? value.length : 0;
  });
  return (
    <span className="dil-counted-label">
      <FieldLabel label={field?.label} localized path={path} />
      <span
        aria-live="polite"
        className={`dil-char-count__value${length > limit ? " dil-char-count__value--over" : ""}`}
      >
        {length} / {limit}
      </span>
    </span>
  );
}

export type ProductSidebarProps = {
  status: PublishStatus;
  owner: string;
  canEdit: boolean;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  versions: number;
  usedIn: UsedInData;
};

function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="dil-editor-panel">
      <h2 className="dil-editor-panel__title" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ProductSidebar(props: ProductSidebarProps) {
  const status = useLiveStatus(props.status);
  const { id } = useDocumentInfo();
  const { openModal } = useModal();
  const live = status === "published" || status === "changed";
  const lines = publishingLines({
    status,
    liveSince: props.liveSince,
    savedAt: props.savedAt,
    savedBy: props.savedBy,
  });
  return (
    <aside aria-label="Product details" className="dil-editor-sidebar">
      <Panel id="dil-panel-owner" title="Owner">
        <p className="dil-editor-fact">
          <MaterialIcon name={props.canEdit ? "domain" : "lock"} />
          {props.owner}
        </p>
        <p className="dil-editor-panel__note">
          {ownerPanelText({ company: props.owner, canEdit: props.canEdit })}
        </p>
      </Panel>
      <UsedInPanel data={props.usedIn} />
      <Panel id="dil-panel-publishing" title="Publishing">
        {id === undefined ? (
          <p className="dil-editor-panel__note">
            Nothing is saved yet. Save a draft to start the history, or publish
            to put the product on all {ALL_SITES_COUNT} sites.
          </p>
        ) : (
          <>
            <p
              className={`dil-editor-fact ${live ? "dil-editor-fact--ok" : "dil-editor-fact--muted"}`}
            >
              <MaterialIcon name={live ? "check_circle" : "schedule"} />
              {lines.live}
            </p>
            <p
              className={`dil-editor-fact dil-editor-fact--${lines.state.tone}`}
            >
              <MaterialIcon
                name={lines.state.tone === "ok" ? "task_alt" : "edit_note"}
              />
              {lines.state.text}
            </p>
            {lines.saved && (
              <p className="dil-editor-panel__note">{lines.saved}</p>
            )}
            <p className="dil-editor-panel__note">Version {props.versions}</p>
            <ActionButton
              icon="history"
              onClick={() => openModal(VERSIONS_DRAWER_SLUG)}
              type="button"
              variant="secondary"
            >
              History
            </ActionButton>
          </>
        )}
      </Panel>
    </aside>
  );
}
