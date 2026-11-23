"use client";

import { useDocumentInfo, useForm, useFormFields } from "@payloadcms/ui";

import {
  CONSENT_LINKS_HINT,
  FORM_FIELDS_NOTE,
  formFieldRows,
  pickedCount,
  sectionNotes,
} from "../../sectionStates";
import { Banner } from "../kit/Banner";

function parentOf(path: string): string {
  return path.slice(0, path.lastIndexOf("."));
}

export function SectionStateNote({
  slug,
  group,
  path,
}: {
  slug: string;
  group: string;
  path?: string;
}) {
  const { collectionSlug } = useDocumentInfo();
  const recordType = useFormFields(([fields]) => fields.recordType?.value) as
    string | undefined;
  const highlights = useFormFields(([fields]) =>
    path && slug === "postArticle"
      ? fields[`${parentOf(path)}.highlights.items`]?.value
      : undefined,
  );
  const source = useFormFields(([fields]) =>
    path && slug === "postListing"
      ? fields[`${parentOf(path)}.source`]?.value
      : undefined,
  );
  const { dispatchFields, setModified } = useForm();
  const notes = sectionNotes(slug, group, {
    collection: collectionSlug,
    recordType,
    highlights,
    source,
  });
  if (notes.length === 0) return null;
  return (
    <div className="dil-section-states">
      {notes.map((note) => (
        <Banner key={note.text} tone={note.tone}>
          {note.text}
          {note.setCurrentCategory && path && (
            <>
              {" "}
              <button
                className="dil-override-state__reset"
                onClick={() => {
                  dispatchFields({
                    type: "UPDATE",
                    path: `${parentOf(path)}.source`,
                    value: "currentCategory",
                  });
                  setModified(true);
                }}
                type="button"
              >
                Use This category
              </button>
            </>
          )}
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
