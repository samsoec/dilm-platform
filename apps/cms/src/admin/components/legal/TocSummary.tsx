"use client";

import { Banner } from "../kit/Banner";
import { TOC_EMPTY_NOTICE, tocSummary } from "../../../legal/legalText";
import { useLegalSnapshot } from "./legalForm";

export function TocSummary({ path }: { path?: string }) {
  const { toc, headings } = useLegalSnapshot(path);
  if (!toc?.on) return null;
  return (
    <div className="dil-legal-toc">
      <p className="dil-field-note">{tocSummary(headings)}</p>
      {headings === 0 && <Banner tone="warning">{TOC_EMPTY_NOTICE}</Banner>}
    </div>
  );
}
