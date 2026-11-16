import Link from "next/link";

import { COMPANY_SETTINGS_PATH } from "../../sectionStates";
import {
  CATEGORY_TABS_NOTE,
  PUBLICATION_DEPENDENTS,
  PUBLICATION_PANEL_TITLE,
  PUBLICATION_SET_NOTE,
  PUBLICATION_SETTINGS_LABEL,
} from "./publication";

export function PublicationPanel() {
  return (
    <>
      <section
        aria-labelledby="dil-panel-publication"
        className="dil-editor-panel"
      >
        <h2 className="dil-editor-panel__title" id="dil-panel-publication">
          {PUBLICATION_PANEL_TITLE}
        </h2>
        <ul className="dil-publication-list">
          {PUBLICATION_DEPENDENTS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="dil-editor-panel__note">{PUBLICATION_SET_NOTE}</p>
        <p className="dil-editor-panel__note">
          <Link href={COMPANY_SETTINGS_PATH} prefetch={false}>
            {PUBLICATION_SETTINGS_LABEL}
          </Link>
        </p>
      </section>
      <section
        aria-labelledby="dil-panel-category-tabs"
        className="dil-editor-panel"
      >
        <h2 className="dil-editor-panel__title" id="dil-panel-category-tabs">
          Category tabs
        </h2>
        <p className="dil-editor-panel__note">{CATEGORY_TABS_NOTE}</p>
      </section>
    </>
  );
}
