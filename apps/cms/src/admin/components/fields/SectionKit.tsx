"use client";

import {
  FieldLabel,
  useField,
  useFormFields,
  useRowLabel,
} from "@payloadcms/ui";
import type { SelectFieldClientProps } from "payload";
import { useEffect, useId, useRef, useState } from "react";

import type { LinkValue } from "../../layoutEditor";
import {
  BACKGROUND_IMAGE_NOTE,
  BUTTON_STYLE_OPTIONS,
  buttonStyleLabel,
  buttonSummary,
  limitReason,
  removedFromHtml,
  TITLE_HINT,
  titleNotice,
  VARIANT_KEPT_NOTE,
} from "../../sectionKit";
import { MaterialIcon } from "../MaterialIcon";
import { SegmentedControl } from "../kit/SegmentedControl";

type Choice = { value: string; label: string };

function choices(options: unknown): Choice[] {
  return (Array.isArray(options) ? options : []).map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : {
          value: String((option as Choice).value),
          label: String((option as Choice).label),
        },
  );
}

export const SegmentField = ({
  field,
  path,
  readOnly,
  tag,
  imagePath,
  order,
}: SelectFieldClientProps & {
  tag?: string;
  imagePath?: string;
  order?: readonly string[];
}) => {
  const fieldPath = path ?? field.name;
  const { value, setValue } = useField<string>({ path: fieldPath });
  const siblingImage = useFormFields(([fields]) =>
    imagePath
      ? fields[`${fieldPath.slice(0, fieldPath.lastIndexOf("."))}.${imagePath}`]
          ?.value
      : undefined,
  );
  const options = choices(field.options);
  if (order) {
    options.sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
  }
  const current = value ?? options[0]?.value ?? "";
  const needsImage = Boolean(imagePath) && current === "image" && !siblingImage;
  return (
    <div className="field-type dil-segment-field">
      <FieldLabel label={field.label} path={fieldPath} />
      {tag && <span className="dil-segment-field__tag">{tag}</span>}
      <SegmentedControl
        disabled={readOnly}
        label={typeof field.label === "string" ? field.label : field.name}
        onChange={setValue}
        options={options}
        value={current}
      />
      {needsImage && (
        <p className="dil-field-note" role="status">
          <MaterialIcon name="image" />
          {BACKGROUND_IMAGE_NOTE}
        </p>
      )}
    </div>
  );
};

export const ButtonStyleField = ({
  field,
  path,
  readOnly,
}: SelectFieldClientProps) => {
  const fieldPath = path ?? field.name;
  const id = useId();
  const { value, setValue } = useField<string>({ path: fieldPath });
  const current = value ?? "primary";
  const described = BUTTON_STYLE_OPTIONS.find(
    (option) => option.value === current,
  );
  return (
    <div className="field-type dil-button-style">
      <label className="field-label" htmlFor={id}>
        {typeof field.label === "string" ? field.label : "Style"}
      </label>
      <select
        aria-describedby={`${id}-help`}
        className="dil-button-style__select"
        disabled={readOnly}
        id={id}
        onChange={(event) => setValue(event.target.value)}
        value={current}
      >
        {BUTTON_STYLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} · {option.description}
          </option>
        ))}
      </select>
      <p className="dil-field-note" id={`${id}-help`}>
        {described?.description}
      </p>
    </div>
  );
};

export function ButtonRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    link?: LinkValue;
    style?: string;
  }>();
  const summary = buttonSummary(data?.link);
  return (
    <span className="dil-row-label">
      <span className="dil-row-label__number">
        {String((rowNumber ?? 0) + 1).padStart(2, "0")}
      </span>
      <span
        className={`dil-row-label__title${summary ? "" : " dil-row-label__title--empty"}`}
      >
        {summary || "Untitled button"}
      </span>
      <span className="dil-style-chip">{buttonStyleLabel(data?.style)}</span>
    </span>
  );
}

export const VariantField = ({
  field,
  path,
  readOnly,
  chips,
}: SelectFieldClientProps & { chips?: boolean }) => {
  const fieldPath = path ?? field.name;
  const { value, setValue } = useField<string>({ path: fieldPath });
  const options = choices(field.options);
  const current = value ?? options[0]?.value ?? "";
  const initial = useRef(current);
  const [switched, setSwitched] = useState(false);
  const name = useId();
  const choose = (next: string) => {
    setSwitched(next !== initial.current);
    setValue(next);
  };
  return (
    <div className="field-type dil-variant-field">
      <FieldLabel label={field.label} path={fieldPath} />
      <div
        aria-label={typeof field.label === "string" ? field.label : field.name}
        className={`dil-variant-field__options${chips ? " dil-variant-field__options--chips" : ""}`}
        role="radiogroup"
      >
        {options.map((option, index) => (
          <label
            className={`dil-variant-field__option${option.value === current ? " dil-variant-field__option--active" : ""}`}
            key={option.value}
          >
            <input
              checked={option.value === current}
              className="dil-sr-only"
              disabled={readOnly}
              name={name}
              onChange={() => choose(option.value)}
              type="radio"
              value={option.value}
            />
            {!chips && (
              <span aria-hidden="true" className="dil-variant-field__preview">
                {Array.from({ length: index + 2 }, (_, bar) => (
                  <span key={bar} />
                ))}
              </span>
            )}
            {option.label}
          </label>
        ))}
      </div>
      {switched && (
        <p className="dil-field-note" role="status">
          <MaterialIcon name="info" />
          {VARIANT_KEPT_NOTE}
        </p>
      )}
    </div>
  );
};

export function PasteNotice() {
  const anchor = useRef<HTMLSpanElement>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const container = anchor.current?.closest(".field-type");
    if (!container) return;
    const onPaste = (event: Event) => {
      const html = (event as ClipboardEvent).clipboardData?.getData(
        "text/html",
      );
      setNotice(titleNotice(removedFromHtml(html ?? "")));
    };
    container.addEventListener("paste", onPaste, true);
    return () => container.removeEventListener("paste", onPaste, true);
  }, []);
  return (
    <>
      <span hidden ref={anchor} />
      {notice && (
        <p className="dil-field-note dil-field-note--warn" role="status">
          <MaterialIcon name="info" />
          {notice}
        </p>
      )}
    </>
  );
}

export function TitleNotice() {
  return (
    <div className="dil-title-hint">
      <span className="dil-title-hint__key">{TITLE_HINT}</span>
      <PasteNotice />
    </div>
  );
}

export function SectionArrayNote({
  path,
  field,
}: {
  path?: string;
  field?: { name: string; maxRows?: number; labels?: { singular?: unknown } };
}) {
  const fieldPath = path ?? field?.name ?? "";
  const count = useFormFields(
    ([fields]) => fields[fieldPath]?.rows?.length ?? 0,
  );
  const singular =
    typeof field?.labels?.singular === "string"
      ? field.labels.singular.toLowerCase()
      : "item";
  const reason = limitReason(count, field?.maxRows, singular);
  if (!reason) return null;
  return (
    <p className="dil-array-note" role="status">
      <MaterialIcon name="block" />
      <span>{reason}</span>
    </p>
  );
}
