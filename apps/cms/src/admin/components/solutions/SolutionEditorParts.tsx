"use client";

import {
  FieldLabel,
  useConfig,
  useDocumentInfo,
  useField,
  useForm,
  useFormFields,
  useLocale,
} from "@payloadcms/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useTabButtons } from "../editor/EditorTabs";
import { ActionButton } from "../kit/ActionButton";
import { MaterialIcon } from "../MaterialIcon";
import { tabCountText } from "../products/productEditor";
import {
  addSupporting,
  canAddTag,
  cleanTag,
  emptySupportingText,
  featuredNote,
  idList,
  isShownFeatured,
  idOf,
  moveSupporting,
  offered,
  productSearchQuery,
  productsByIdQuery,
  removeSupporting,
  SUPPORTING_HINT,
  supportingCountText,
  tagCountText,
  toggleFeatured,
  MAX_SUPPORTING_PRODUCTS,
  type Id,
  type Picked,
} from "./solutionEditor";

type Found = { id: Id; name: string; tenant: Id | null; group: string };

type RawProduct = {
  id: Id;
  name?: string | null;
  productGroup?: string | null;
  tenant?: unknown;
};

function toFound(doc: RawProduct): Found {
  return {
    id: doc.id,
    name: doc.name ?? "",
    tenant: idOf(doc.tenant),
    group: doc.productGroup ?? "",
  };
}

export function SolutionTabMarks() {
  const buttons = useTabButtons();
  const supporting = useFormFields(([fields]) =>
    idList(fields.supportingProducts?.value),
  ).length;
  const applications = useFormFields(
    ([fields]) => fields.applications?.rows?.length ?? 0,
  );
  const tabNamed = (label: string) =>
    buttons.find((button) =>
      (button.textContent ?? "").trim().startsWith(label),
    );
  const supportingTab = tabNamed("Supporting products");
  const applicationsTab = tabNamed("Applications");
  return (
    <>
      {supportingTab &&
        createPortal(
          <span className="dil-tab-count">{tabCountText(supporting)}</span>,
          supportingTab,
        )}
      {applicationsTab &&
        createPortal(
          <span className="dil-tab-count">{tabCountText(applications)}</span>,
          applicationsTab,
        )}
    </>
  );
}

export function TagListField({
  path,
  field,
}: {
  path?: string;
  field?: { label?: unknown; maxRows?: number };
}) {
  const arrayPath = path ?? "";
  const max = field?.maxRows ?? 10;
  const { addFieldRow, removeFieldRow } = useForm();
  const { hasSavePermission } = useDocumentInfo();
  const [draft, setDraft] = useState("");
  const tags = useFormFields(([fields]) => {
    const count = fields[arrayPath]?.rows?.length ?? 0;
    return Array.from({ length: count }, (_, index) =>
      String(fields[`${arrayPath}.${index}.text`]?.value ?? ""),
    );
  }).join("\u0000");
  const list = tags === "" ? [] : tags.split("\u0000");
  const rows = useFormFields(
    ([fields]) => fields[arrayPath]?.rows?.length ?? 0,
  );
  const editable = hasSavePermission !== false;
  const label = typeof field?.label === "string" ? field.label : "Tags";

  const add = () => {
    if (!canAddTag(draft, list, max)) return;
    const value = cleanTag(draft);
    const cell = { initialValue: value, valid: true, value };
    addFieldRow({
      path: arrayPath,
      rowIndex: rows,
      schemaPath: arrayPath,
      subFieldState: { text: cell },
    });
    setDraft("");
  };

  return (
    <div className="dil-tags field-type">
      <span className="dil-tags__head">
        <FieldLabel label={label} />
        <span className="dil-array-count">{tagCountText(rows, max)}</span>
      </span>
      <ul className="dil-tags__list">
        {Array.from({ length: rows }, (_, index) => (
          <li className="dil-tags__tag" key={`${index}:${list[index]}`}>
            {list[index]}
            {editable && (
              <button
                aria-label={`Remove ${list[index]}`}
                className="dil-tags__remove"
                onClick={() =>
                  removeFieldRow({ path: arrayPath, rowIndex: index })
                }
                type="button"
              >
                <MaterialIcon name="close" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {editable && (
        <div className="dil-tags__add">
          <input
            aria-label={`Add to ${label}`}
            className="dil-tags__input"
            disabled={rows >= max}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            placeholder="Type and press Enter"
            value={draft}
          />
          <ActionButton
            icon="add"
            onClick={add}
            type="button"
            unavailableReason={
              rows >= max
                ? `The list holds ${max}.`
                : canAddTag(draft, list, max)
                  ? undefined
                  : "Type something new to add."
            }
            variant="secondary"
          >
            Add
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function useApi(): string {
  const {
    config: { routes, serverURL },
  } = useConfig();
  return `${serverURL ?? ""}${routes.api}`;
}

function useCompanies(api: string): Map<string, string> {
  const [names, setNames] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    let live = true;
    fetch(`${api}/tenants?limit=100&depth=0`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((body: { docs?: { id: Id; name?: string }[] }) => {
        if (!live) return;
        setNames(
          new Map(
            (body.docs ?? []).map(({ id, name }) => [String(id), name ?? ""]),
          ),
        );
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [api]);
  return names;
}

export function SupportingProductsField({ path }: { path?: string }) {
  const fieldPath = path ?? "supportingProducts";
  const api = useApi();
  const { code } = useLocale();
  const { hasSavePermission } = useDocumentInfo();
  const supporting = useField<Id[]>({ path: fieldPath });
  const featured = useField<Id | null>({ path: "featuredProduct" });
  const companies = useCompanies(api);
  const ids = idList(supporting.value);
  const state: Picked = { ids, featured: idOf(featured.value) };
  const editable = hasSavePermission !== false;
  const [known, setKnown] = useState<Map<string, Found>>(new Map());
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Found[]>([]);
  const [failed, setFailed] = useState(false);
  const idKey = ids.join(",");
  const asked = useRef(new Set<string>());

  useEffect(() => {
    const missing = (idKey === "" ? [] : idKey.split(",")).filter(
      (id) => !known.has(id) && !asked.current.has(id),
    );
    if (missing.length === 0) return;
    missing.forEach((id) => asked.current.add(id));
    fetch(`${api}/products?${productsByIdQuery(missing, code)}`, {
      credentials: "include",
    })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((body: { docs?: RawProduct[] }) => {
        setKnown((current) => {
          const next = new Map(current);
          (body.docs ?? []).forEach((doc) =>
            next.set(String(doc.id), toFound(doc)),
          );
          return next;
        });
      })
      .catch(() => undefined);
  }, [api, code, idKey, known]);

  useEffect(() => {
    if (!editable) return;
    let live = true;
    const timer = setTimeout(() => {
      fetch(`${api}/products?${productSearchQuery(search, code)}`, {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .then((body: { docs?: RawProduct[] }) => {
          if (!live) return;
          setFailed(false);
          const docs = (body.docs ?? []).map(toFound);
          setResults(docs);
          setKnown((current) => {
            const next = new Map(current);
            docs.forEach((doc) => next.set(String(doc.id), doc));
            return next;
          });
        })
        .catch(() => live && setFailed(true));
    }, 200);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [api, code, search, editable]);

  const names = useMemo(
    () => new Map([...known].map(([id, found]) => [id, found.name])),
    [known],
  );
  const apply = (next: Picked) => {
    supporting.setValue(next.ids);
    if (idOf(featured.value) !== next.featured)
      featured.setValue(next.featured);
  };
  const choices = offered(results, state);

  return (
    <div className="dil-supporting field-type">
      <span className="dil-tags__head">
        <FieldLabel label="Supporting products" />
        <span className="dil-array-count">
          {supportingCountText(ids.length)}
        </span>
      </span>
      <p className="dil-supporting__hint">{SUPPORTING_HINT}</p>
      {ids.length === 0 ? (
        <p className="dil-supporting__empty">{emptySupportingText()}</p>
      ) : (
        <ol className="dil-supporting__list">
          {ids.map((id, index) => {
            const found = known.get(String(id));
            const star = isShownFeatured(state, id);
            return (
              <li className="dil-supporting__row" key={String(id)}>
                <span className="dil-row-label__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="dil-supporting__name">
                  {found?.name || `Product ${id}`}
                  {found?.group && (
                    <span className="dil-row-label__meta">{found.group}</span>
                  )}
                </span>
                <span className="dil-supporting__owner">
                  {(found?.tenant !== null && found?.tenant !== undefined
                    ? companies.get(String(found.tenant))
                    : undefined) ?? ""}
                </span>
                <button
                  aria-label={
                    star
                      ? `Featured: ${found?.name ?? id}`
                      : `Feature ${found?.name ?? id}`
                  }
                  aria-pressed={star}
                  className={`dil-supporting__star${star ? " is-on" : ""}`}
                  disabled={!editable}
                  onClick={() => apply(toggleFeatured(state, id))}
                  type="button"
                >
                  <MaterialIcon name="star" />
                </button>
                {editable && (
                  <>
                    <button
                      aria-label={`Move ${found?.name ?? id} up`}
                      className="dil-supporting__move"
                      disabled={index === 0}
                      onClick={() =>
                        apply(moveSupporting(state, index, index - 1))
                      }
                      type="button"
                    >
                      <MaterialIcon name="expand_less" />
                    </button>
                    <button
                      aria-label={`Move ${found?.name ?? id} down`}
                      className="dil-supporting__move"
                      disabled={index === ids.length - 1}
                      onClick={() =>
                        apply(moveSupporting(state, index, index + 1))
                      }
                      type="button"
                    >
                      <MaterialIcon name="expand_more" />
                    </button>
                    <button
                      aria-label={`Remove ${found?.name ?? id}`}
                      className="dil-supporting__move"
                      onClick={() => apply(removeSupporting(state, id))}
                      type="button"
                    >
                      <MaterialIcon name="close" />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      )}
      {ids.length > 0 && (
        <p aria-live="polite" className="dil-supporting__note">
          {featuredNote(state, names)}
        </p>
      )}
      {editable && (
        <div className="dil-supporting__picker">
          <input
            aria-label="Search published products"
            className="dil-tags__input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search published products from every company"
            type="search"
            value={search}
          />
          {failed && (
            <p className="dil-supporting__note" role="alert">
              Couldn&apos;t load products. Try again.
            </p>
          )}
          {ids.length >= MAX_SUPPORTING_PRODUCTS && (
            <p className="dil-supporting__note">
              A solution holds {MAX_SUPPORTING_PRODUCTS} supporting products.
            </p>
          )}
          <ul className="dil-supporting__choices">
            {choices.map((product) => (
              <li className="dil-supporting__choice" key={String(product.id)}>
                <span className="dil-supporting__name">{product.name}</span>
                <span className="dil-supporting__owner">
                  {product.tenant !== null
                    ? (companies.get(String(product.tenant)) ?? "")
                    : ""}
                </span>
                <ActionButton
                  icon="add"
                  onClick={() => apply(addSupporting(state, product.id))}
                  type="button"
                  unavailableReason={
                    ids.length >= MAX_SUPPORTING_PRODUCTS
                      ? "The list is full."
                      : undefined
                  }
                  variant="secondary"
                >
                  Add
                </ActionButton>
              </li>
            ))}
            {choices.length === 0 && !failed && (
              <li className="dil-supporting__note">
                No published products match.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
