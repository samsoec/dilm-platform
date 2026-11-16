"use client";

import Link from "next/link";
import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";

import type { LegalEntry } from "../../data/legalPages";
import {
  LEGAL_OWN_TEXT,
  LEGAL_PAGES_EMPTY,
  LEGAL_PAGES_TITLE,
  TOC_PREVIEW_TITLE,
} from "../../../legal/legalText";
import { useLegalSnapshot } from "./legalForm";

export function LegalPanel({
  pages,
  currentId,
}: {
  pages: LegalEntry[];
  currentId: string;
}) {
  const {
    config: { routes },
  } = useConfig();
  const { toc } = useLegalSnapshot();
  return (
    <>
      <section
        aria-labelledby="dil-panel-toc-preview"
        className="dil-editor-panel"
      >
        <h2 className="dil-editor-panel__title" id="dil-panel-toc-preview">
          {TOC_PREVIEW_TITLE}
        </h2>
        {toc?.on && toc.entries.length > 0 ? (
          <>
            <p className="dil-editor-panel__note">
              <b>{toc.title}</b>
            </p>
            <ol className="dil-legal-toc-list">
              {toc.entries.map((entry) => (
                <li key={entry.anchor}>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="dil-editor-panel__note">
            {toc?.on
              ? "The list is empty until the body has H2 headings."
              : "The list is off."}
          </p>
        )}
      </section>
      <section aria-labelledby="dil-panel-legal" className="dil-editor-panel">
        <h2 className="dil-editor-panel__title" id="dil-panel-legal">
          {LEGAL_PAGES_TITLE}
        </h2>
        {pages.length > 0 ? (
          <ul className="dil-editor-links">
            {pages.map((page) => (
              <li key={page.id}>
                {page.id === currentId ? (
                  <span aria-current="page">
                    {page.title}
                    <span className="dil-editor-links__note">
                      {" "}
                      {page.notes.join(" ")}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={formatAdminURL({
                      adminRoute: routes.admin,
                      path: `/collections/pages/${page.id}`,
                    })}
                    prefetch={false}
                  >
                    {page.title}
                    <span className="dil-editor-links__note">
                      {" "}
                      {page.notes.join(" ")}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="dil-editor-panel__note">{LEGAL_PAGES_EMPTY}</p>
        )}
        <p className="dil-editor-panel__note">{LEGAL_OWN_TEXT}</p>
      </section>
    </>
  );
}
