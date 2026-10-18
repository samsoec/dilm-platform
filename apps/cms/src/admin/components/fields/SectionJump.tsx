"use client";

import {
  useAllFormFields,
  useFormFields,
  useFormSubmitted,
} from "@payloadcms/ui";
import { useEffect, useState } from "react";

import { footerSectionCounts } from "../../footerSections";
import { FOOTER_SECTIONS, sectionId } from "../../layoutEditor";
import { MaterialIcon } from "../MaterialIcon";
import { useDefaultLocaleDoc } from "./useDefaultLocaleDoc";

export function SectionJump() {
  const [fields] = useAllFormFields();
  const submitted = useFormSubmitted();
  const englishDoc = useDefaultLocaleDoc();
  const partOfOn = useFormFields(([all]) =>
    Boolean(all["partOf.enabled"]?.value),
  );
  const [active, setActive] = useState<string>(FOOTER_SECTIONS[0].anchor);
  const counts = footerSectionCounts(fields, { submitted, englishDoc });

  useEffect(() => {
    const update = () => {
      let current: string = FOOTER_SECTIONS[0].anchor;
      for (const { anchor } of FOOTER_SECTIONS) {
        const heading = document.getElementById(sectionId(anchor));
        if (heading && heading.getBoundingClientRect().top < 160) {
          current = anchor;
        }
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav aria-label="Footer sections" className="dil-section-jump">
      {FOOTER_SECTIONS.map(({ anchor, title }, index) => {
        const { errors, untranslated } = counts[anchor];
        return (
          <a
            aria-current={active === anchor ? "location" : undefined}
            className={`dil-section-jump__link${active === anchor ? " dil-section-jump__link--active" : ""}`}
            href={`#${sectionId(anchor)}`}
            key={anchor}
            onClick={(event) => {
              const target = document.getElementById(sectionId(anchor));
              if (!target) return;
              event.preventDefault();
              target.scrollIntoView({ block: "start", behavior: "smooth" });
            }}
          >
            <span className="dil-section-jump__number">{index + 1}</span>
            <span className="dil-section-jump__title">{title}</span>
            {errors > 0 && (
              <span className="dil-section-jump__errors">
                <MaterialIcon name="error" />
                {errors}
                <span className="dil-sr-only">
                  {errors === 1 ? " error" : " errors"}
                </span>
              </span>
            )}
            {errors === 0 && untranslated > 0 && (
              <span className="dil-section-jump__untranslated">
                <MaterialIcon name="translate" />
                {untranslated}
                <span className="dil-sr-only"> still in English</span>
              </span>
            )}
            {anchor === "part-of" && !partOfOn && errors === 0 && (
              <span className="dil-section-jump__off">Off</span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
