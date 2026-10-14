"use client";

import { usePreferences } from "@payloadcms/ui";
import { PREFERENCE_KEYS } from "payload/shared";
import { type ReactNode, useId, useState } from "react";

import { MaterialIcon } from "../MaterialIcon";
import type { NavSection } from "./sections";

export function NavGroup({
  section,
  initiallyOpen,
  children,
}: {
  section: NavSection;
  initiallyOpen: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const { setPreference } = usePreferences();
  const contentId = useId();

  const toggle = () => {
    const next = !open;
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
