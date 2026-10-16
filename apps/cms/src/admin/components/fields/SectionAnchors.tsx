"use client";

import type { MouseEvent } from "react";

import { FOOTER_SECTIONS, sectionId } from "../../layoutEditor";

function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ block: "start" });
}

export function SectionAnchors() {
  return (
    <nav aria-label="Footer sections" className="dil-anchors">
      {FOOTER_SECTIONS.map(({ anchor, number, title }) => (
        <a
          className="dil-anchors__link"
          href={`#${sectionId(anchor)}`}
          key={anchor}
          onClick={(event) => jumpTo(event, sectionId(anchor))}
        >
          <span className="dil-anchors__number">{number}</span>
          {title}
        </a>
      ))}
    </nav>
  );
}
