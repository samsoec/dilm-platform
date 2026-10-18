"use client";

import { useAllFormFields, useFormSubmitted } from "@payloadcms/ui";

import {
  navItemTitle,
  type NavItemValue,
  rowNumberText,
} from "../../layoutEditor";
import { MaterialIcon } from "../MaterialIcon";
import { errorEntries, type ErrorEntry } from "./validationErrors";

function expandAndFocus(entry: ErrorEntry) {
  const segments = entry.path.split(".");
  segments.forEach((segment, index) => {
    if (!/^\d+$/.test(segment)) return;
    const arrayPath = segments.slice(0, index).join("-");
    const row = document.getElementById(`${arrayPath}-row-${segment}`);
    const toggle = row?.querySelector<HTMLButtonElement>(
      ".collapsible__toggle",
    );
    if (toggle?.classList.contains("collapsible__toggle--collapsed")) {
      toggle.click();
    }
  });
  window.setTimeout(() => {
    const id = entry.path.replace(/\./g, "__");
    const input = document.querySelector<HTMLElement>(
      `[name="${entry.path}"], #field-${id}`,
    );
    const target =
      input?.closest<HTMLElement>(".field-type") ??
      document.querySelector<HTMLElement>(`.field-${id}`) ??
      document.getElementById(`${entry.path.replace(/\./g, "-")}-row-0`)
        ?.parentElement ??
      undefined;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  }, 150);
}

export function ValidationSummary() {
  const [fields] = useAllFormFields();
  const submitted = useFormSubmitted();
  if (!submitted) return null;
  const entries = errorEntries(fields, (path) => {
    const value: NavItemValue = {
      type: fields[`${path}.type`]?.value as NavItemValue["type"],
      label: fields[`${path}.label`]?.value as string,
      link: { label: fields[`${path}.link.label`]?.value as string },
    };
    const index = Number(path.split(".").pop());
    return `${rowNumberText(index)} ${navItemTitle(value) || "Untitled"}`;
  });
  if (entries.length === 0) return null;

  return (
    <div className="dil-banner dil-banner--error dil-validation" role="alert">
      <MaterialIcon className="dil-banner__icon" name="error" />
      <div className="dil-banner__body">
        <p className="dil-banner__text">
          <b>
            Not saved. Fix {entries.length}{" "}
            {entries.length === 1 ? "thing" : "things"} first:
          </b>
        </p>
        <ul className="dil-validation__list">
          {entries.map((entry) => (
            <li key={entry.path}>
              <button onClick={() => expandAndFocus(entry)} type="button">
                → {entry.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
