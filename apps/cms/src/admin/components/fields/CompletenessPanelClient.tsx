"use client";

import { useFormFields } from "@payloadcms/ui";
import { useEffect, useId, useRef } from "react";

import {
  COMPLETENESS_PATHS,
  completenessFromValues,
  type LocalizedCompletenessValues,
  SETTINGS_TABS,
  settingsCompleteness,
} from "../../data/completeness";
import {
  SECTION_HINTS,
  SETTINGS_USED_BY,
  settingsTabStates,
  type TabState,
} from "../../data/settingsTabs";
import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";

const STATE_ICON: Record<TabState, IconName> = {
  complete: "check_circle",
  warning: "warning",
  error: "error",
  optional: "radio_button_unchecked",
};

const STATE_TEXT: Record<TabState, string> = {
  complete: "Done",
  warning: "Missing",
  error: "Required",
  optional: "Optional",
};

const TAB_BUTTON = ".tabs-field__tab-button";

export function CompletenessPanelClient({
  defaultLocaleValues,
}: {
  defaultLocaleValues?: LocalizedCompletenessValues;
}) {
  const panel = useRef<HTMLElement>(null);
  const headingId = useId();
  const values = useFormFields(([fields]) =>
    COMPLETENESS_PATHS.map((path) => fields[path]?.value),
  );

  const byPath = new Map(
    COMPLETENESS_PATHS.map((path, index) => [path, values[index]]),
  );
  const states = settingsTabStates(
    settingsCompleteness(
      completenessFromValues((path) => byPath.get(path), defaultLocaleValues),
    ),
  );
  const stateKey = states.join(",");

  useEffect(() => {
    const current = stateKey.split(",");
    const buttons =
      panel.current
        ?.closest("form")
        ?.querySelectorAll<HTMLElement>(TAB_BUTTON) ?? [];
    buttons.forEach((button, index) => {
      const state = current[index];
      if (state === "warning" || state === "error") {
        button.dataset.dilStatus = state;
        button.setAttribute(
          "aria-label",
          `${SETTINGS_TABS[index]?.label ?? ""}, needs attention before launch`,
        );
      } else {
        delete button.dataset.dilStatus;
        button.removeAttribute("aria-label");
      }
    });
  }, [stateKey]);

  const required = states.filter((state) => state !== "optional");
  const done = required.filter((state) => state === "complete").length;

  function openTab(index: number) {
    panel.current
      ?.closest("form")
      ?.querySelectorAll<HTMLElement>(TAB_BUTTON)
      [index]?.click();
  }

  return (
    <section
      aria-labelledby={headingId}
      className="dil-completeness"
      ref={panel}
    >
      <header className="dil-completeness__header">
        <h3 className="dil-completeness__title" id={headingId}>
          Ready for launch
        </h3>
        <span className="dil-completeness__count">
          {done} of {required.length} done
        </span>
      </header>
      <ul className="dil-completeness__list">
        {SETTINGS_TABS.map(({ section, label }, index) => {
          const state = states[index];
          return (
            <li key={section}>
              <button
                className={`dil-completeness__item dil-completeness__item--${state}`}
                onClick={() => openTab(index)}
                type="button"
              >
                <MaterialIcon name={STATE_ICON[state]} />
                <span className="dil-completeness__label">
                  {label}
                  {state !== "complete" && (
                    <span className="dil-completeness__hint">
                      {SECTION_HINTS[section]}
                    </span>
                  )}
                </span>
                <span className="dil-completeness__state">
                  {STATE_TEXT[state]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="dil-completeness__used">
        <span className="dil-completeness__used-label">Used by</span>
        <ul className="dil-chips">
          {SETTINGS_USED_BY.map((use) => (
            <li className="dil-chip" key={use}>
              {use}
            </li>
          ))}
        </ul>
      </div>
      <p className="dil-completeness__note">
        One settings document per tenant. Only Super Admins can delete it.
      </p>
    </section>
  );
}
