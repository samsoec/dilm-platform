"use client";

import { useFormFields } from "@payloadcms/ui";
import { useEffect, useId, useRef } from "react";

import {
  COMPLETENESS_PATHS,
  completenessFromValues,
  type LaunchItem,
  launchItems,
  type LocalizedCompletenessValues,
  SETTINGS_TABS,
  settingsCompleteness,
} from "../../data/completeness";
import {
  SETTINGS_USED_BY,
  settingsTabStates,
  TAB_STATE_ICON,
  TAB_STATE_TEXT,
} from "../../data/settingsTabs";
import { MaterialIcon } from "../MaterialIcon";

const TAB_BUTTON = ".tabs-field__tab-button";
const FOCUSABLE = "input, textarea, button, [tabindex]";

function fieldElementId(path: string): string {
  return `field-${path.replace(/\./g, "__")}`;
}

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
  const statuses = settingsCompleteness(
    completenessFromValues((path) => byPath.get(path), defaultLocaleValues),
  );
  const states = settingsTabStates(statuses);
  const items = launchItems(statuses);
  const stateKey = states.join(",");

  useEffect(() => {
    const current = stateKey.split(",") as (keyof typeof TAB_STATE_ICON)[];
    const buttons =
      panel.current
        ?.closest("form")
        ?.querySelectorAll<HTMLElement>(TAB_BUTTON) ?? [];
    buttons.forEach((button, index) => {
      const state = current[index];
      if (!state) return;
      button.dataset.dilStatus = state;
      button.dataset.dilIcon = TAB_STATE_ICON[state];
      button.setAttribute(
        "aria-label",
        `${SETTINGS_TABS[index]?.label ?? ""}, ${TAB_STATE_TEXT[state]}`,
      );
    });
  }, [stateKey]);

  const tabButtons = () =>
    panel.current?.closest("form")?.querySelectorAll<HTMLElement>(TAB_BUTTON) ??
    [];

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("tab");
    const index = SETTINGS_TABS.findIndex(({ section }) => section === wanted);
    if (index < 0) return;
    const timer = window.setTimeout(() => {
      panel.current
        ?.closest("form")
        ?.querySelectorAll<HTMLElement>(TAB_BUTTON)
        [index]?.click();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function fix(item: LaunchItem) {
    const index = SETTINGS_TABS.findIndex(
      ({ section }) => section === item.section,
    );
    tabButtons()[index]?.click();
    window.setTimeout(() => {
      const target = document.getElementById(fieldElementId(item.path));
      const focusable = target?.matches(FOCUSABLE)
        ? target
        : target?.querySelector<HTMLElement>(FOCUSABLE);
      focusable?.scrollIntoView({ block: "center" });
      focusable?.focus();
    }, 50);
  }

  const required = statuses.length;
  const done = statuses.filter(({ complete }) => complete).length;

  return (
    <section
      aria-labelledby={headingId}
      className="dil-completeness"
      ref={panel}
    >
      <h3 className="dil-completeness__title" id={headingId}>
        Ready for launch · {done} of {required}
      </h3>
      {items.length > 0 ? (
        <ul className="dil-completeness__list">
          {items.map((item) => (
            <li
              className={`dil-completeness__item dil-completeness__item--${item.severity}`}
              key={item.path}
            >
              <MaterialIcon name={TAB_STATE_ICON[item.severity]} />
              <span className="dil-completeness__label">{item.label}</span>
              <button
                aria-label={`Fix ${item.label}`}
                className="dil-completeness__fix"
                onClick={() => fix(item)}
                type="button"
              >
                Fix
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dil-completeness__item dil-completeness__item--complete">
          <MaterialIcon name="check_circle" />
          <span className="dil-completeness__label">
            Everything needed for launch is set.
          </span>
        </p>
      )}
      <p className="dil-completeness__used">
        <b>Used by</b> {SETTINGS_USED_BY}
      </p>
      <p className="dil-completeness__note">
        Only Super Admins can delete this settings document.
      </p>
    </section>
  );
}
