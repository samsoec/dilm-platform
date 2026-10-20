"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { useId } from "react";

import { checkBrandColor } from "../../brandColor";
import { MaterialIcon } from "../MaterialIcon";

export const BrandColorField: TextFieldClientComponent = ({
  path,
  readOnly,
}) => {
  const { value, setValue, showError } = useField<string>({ path });
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const check = checkBrandColor(value);
  const color = "color" in check ? check.color : undefined;
  const failing = check.state === "too-light" || check.state === "invalid";

  return (
    <div
      className={`field-type dil-company-field dil-brand-color${failing ? " dil-brand-color--error" : ""}`}
    >
      <FieldLabel htmlFor={inputId} label="Brand colour" path={path} />
      <div className="dil-brand-color__input">
        <input
          aria-describedby={hintId}
          aria-invalid={failing || showError || undefined}
          id={inputId}
          onChange={(event) => setValue(event.target.value)}
          placeholder="#1F6F5C"
          readOnly={readOnly}
          spellCheck={false}
          type="text"
          value={value ?? ""}
        />
        <input
          aria-label="Pick brand colour"
          className="dil-brand-color__picker"
          disabled={readOnly}
          onChange={(event) => setValue(event.target.value)}
          type="color"
          value={color ?? "#ffffff"}
        />
      </div>
      {color && (
        <div className="dil-brand-color__preview">
          <span
            className="dil-brand-color__sample"
            style={{ background: color }}
          >
            Aa White text
          </span>
          <span
            className={`dil-brand-color__ratio dil-brand-color__ratio--${check.state}`}
          >
            <MaterialIcon
              name={check.state === "passes" ? "check_circle" : "cancel"}
            />
            {"ratio" in check && check.ratio} ·{" "}
            {check.state === "passes" ? "passes" : "too light"}
          </span>
        </div>
      )}
      <p className="dil-brand-color__hint" id={hintId}>
        {check.state === "too-light" ? (
          <>
            <MaterialIcon name="error" />
            Needs at least 4.5 : 1 against white. Try a darker shade, like{" "}
            {check.suggestion}.
          </>
        ) : check.state === "invalid" ? (
          <>
            <MaterialIcon name="error" />
            {check.message}
          </>
        ) : (
          "Used for this company's card in the sidebar. Needs at least 4.5:1 against white text."
        )}
      </p>
    </div>
  );
};
