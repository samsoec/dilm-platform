"use client";

import { usePreferences } from "@payloadcms/ui";
import { PREFERENCE_KEYS } from "payload/shared";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import type { NavPreferences } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import type { NavSection } from "./sections";

export function NavGroup({
  section,
  children,
}: {
  section: NavSection;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const touched = useRef(false);
  const { getPreference, setPreference } = usePreferences();
  const contentId = useId();

  useEffect(() => {
    let current = true;
    void getPreference<NavPreferences>(PREFERENCE_KEYS.NAV).then((saved) => {
      const savedOpen = saved?.groups?.[section.label]?.open;
      if (current && !touched.current && savedOpen !== undefined) {
        setOpen(savedOpen);
      }
    });
    return () => {
      current = false;
    };
  }, [getPreference, section.label]);

  const toggle = () => {
    const next = !open;
    touched.current = true;
    setOpen(next);
    void setPreference(
      PREFERENCE_KEYS.NAV,
      { groups: { [section.label]: { open: next } } },
      true,
    );
  };

  return (
    <div className="dil-nav__group">
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className="dil-nav__group-toggle"
        onClick={toggle}
        type="button"
      >
        <span className="dil-nav__group-label">
          {section.label}
          {section.superAdminOnly && (
            <span className="dil-nav__tag">Super Admin</span>
          )}
        </span>
        <MaterialIcon name={open ? "expand_more" : "chevron_right"} />
      </button>
      <div className="dil-nav__group-items" hidden={!open} id={contentId}>
        {section.hint && <p className="dil-nav__hint">{section.hint}</p>}
        {children}
      </div>
    </div>
  );
}
