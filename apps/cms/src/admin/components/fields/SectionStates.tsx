"use client";

import {
  entityIdOf,
  type EntityRecord,
  type EntityRef,
} from "@dilm/shared-types";
import {
  useDocumentInfo,
  useForm,
  useFormFields,
  useLocale,
} from "@payloadcms/ui";
import { useEffect, useState } from "react";

import {
  CONSENT_LINKS_HINT,
  FORM_FIELDS_NOTE,
  formFieldRows,
  overrideState,
  pickedCount,
  pinNote,
  sectionNotes,
  type Overridable,
} from "../../sectionStates";
import { Banner } from "../kit/Banner";

function parentOf(path: string): string {
  return path.slice(0, path.lastIndexOf("."));
}

export function SectionStateNote({
  slug,
  group,
}: {
  slug: string;
  group: string;
}) {
  const { collectionSlug } = useDocumentInfo();
  const recordType = useFormFields(([fields]) => fields.recordType?.value) as
    string | undefined;
  const notes = sectionNotes(slug, group, {
    collection: collectionSlug,
    recordType,
  });
  if (notes.length === 0) return null;
  return (
    <div className="dil-section-states">
      {notes.map((note) => (
        <Banner key={note.text} tone={note.tone}>
          {note.text}
          {note.link && (
            <>
              {" "}
              <a href={note.link.href}>{note.link.label}</a>
            </>
          )}
        </Banner>
      ))}
    </div>
  );
}

type Loaded = { key: string; entity: EntityRecord | null };

export function useCompany(ref: EntityRef): EntityRecord | null {
  const { code } = useLocale();
  const id = entityIdOf(ref);
  const key = id ? `${id}:${code}` : "";
  const [loaded, setLoaded] = useState<Loaded>();

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    const get = (url: string) =>
      fetch(url, { credentials: "include", signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null);
    Promise.all([
      get(`/api/tenants/${id}?depth=0&locale=${code}`),
      get(
        `/api/tenant-settings?where[tenant][equals]=${id}&limit=1&depth=0&locale=${code}`,
      ),
    ]).then(([tenant, settings]) => {
      if (controller.signal.aborted) return;
      const row = settings?.docs?.[0];
      setLoaded({
        key,
        entity: tenant
          ? { ...tenant, brand: row?.brand, profile: row?.profile }
          : null,
      });
    });
    return () => controller.abort();
  }, [key, id, code]);

  return loaded?.key === key ? loaded.entity : null;
}

function useSiblingCompany(path: string) {
  const parent = parentOf(path);
  const ref = useFormFields(
    ([fields]) => fields[`${parent}.entity`]?.value,
  ) as EntityRef;
  return {
    parent,
    hasCompany: Boolean(entityIdOf(ref)),
    entity: useCompany(ref),
  };
}

export function ProfileFallback({
  path,
  name,
}: {
  path: string;
  name: Overridable | "regions";
}) {
  const { dispatchFields, setModified } = useForm();
  const own = useFormFields(([fields]) =>
    name === "regions" ? fields[path]?.rows?.length : fields[path]?.value,
  );
  const { hasCompany, entity } = useSiblingCompany(path);
  if (!hasCompany) return null;
  const state = overrideState(
    name,
    name === "regions" ? (own ? [own] : []) : own,
    entity,
  );
  if (state.kind === "none") return null;
  if (state.kind === "profile") {
    return <span className="dil-override-fallback">{state.placeholder}</span>;
  }
  if (name === "regions") return null;
  return (
    <span className="dil-override-state">
      Overridden ·{" "}
      <button
        className="dil-override-state__reset"
        onClick={() => {
          dispatchFields({ type: "UPDATE", path, value: "" });
          setModified(true);
        }}
        type="button"
      >
        Use profile value
      </button>
    </span>
  );
}

export function PinNote({ path }: { path: string }) {
  const { dispatchFields, setModified } = useForm();
  const x = useFormFields(([fields]) => fields[`${path}.x`]?.value);
  const y = useFormFields(([fields]) => fields[`${path}.y`]?.value);
  const { hasCompany, entity } = useSiblingCompany(path);
  if (!hasCompany) return null;
  const note = pinNote({ x, y }, entity);
  return (
    <p className="dil-override-fallback dil-pin-note">
      {note.text}
      {note.canReset && (
        <>
          {" · "}
          <button
            className="dil-override-state__reset"
            onClick={() => {
              dispatchFields({
                type: "UPDATE",
                path: `${path}.x`,
                value: null,
              });
              dispatchFields({
                type: "UPDATE",
                path: `${path}.y`,
                value: null,
              });
              setModified(true);
            }}
            type="button"
          >
            Use profile pin
          </button>
        </>
      )}
    </p>
  );
}

export function PickCount({ path, max }: { path?: string; max: number }) {
  const value = useFormFields(([fields]) =>
    path ? fields[path]?.value : undefined,
  );
  return (
    <p className="dil-array-note" role="status">
      {pickedCount(value, max)} companies picked
    </p>
  );
}

export function FormFieldTable({
  path,
  names,
  labels,
}: {
  path: string;
  names: readonly string[];
  labels: Record<string, string>;
}) {
  const prefix = parentOf(path);
  const labelValues = useFormFields(([fields]) =>
    names.map((name) => fields[`${prefix}.fields.${name}.label`]?.value),
  );
  const placeholderValues = useFormFields(([fields]) =>
    names.map((name) => fields[`${prefix}.fields.${name}.placeholder`]?.value),
  );
  const values = Object.fromEntries(
    names.map((name, index) => [
      name,
      { label: labelValues[index], placeholder: placeholderValues[index] },
    ]),
  );
  const rows = formFieldRows(names, labels, values);
  return (
    <div className="dil-form-fields">
      <p className="dil-form-fields__note">{FORM_FIELDS_NOTE}</p>
      <table className="dil-form-fields__table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Label</th>
            <th>Placeholder</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.field}</td>
              <td>{row.label}</td>
              <td>{row.placeholder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConsentHint() {
  return <p className="dil-form-fields__note">{CONSENT_LINKS_HINT}</p>;
}
