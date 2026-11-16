"use client";

import { useDocumentInfo } from "@payloadcms/ui";

import { PreviewEntries } from "../preview/PreviewMenu";
import { categoryDrawsNote, publishingChangesText } from "./templates";

export function TemplateSidebar({
  governed,
  sites,
  categoryPaths,
  isCategory,
}: {
  governed: number;
  sites: string[];
  categoryPaths: string[];
  isCategory: boolean;
}) {
  const { id, collectionSlug } = useDocumentInfo();
  return (
    <aside aria-label="Template details" className="dil-editor-sidebar">
      <section
        aria-labelledby="dil-template-publish"
        className="dil-editor-panel"
      >
        <h2 className="dil-editor-panel__title" id="dil-template-publish">
          Publishing
        </h2>
        <p className="dil-editor-panel__note">
          {publishingChangesText(governed, sites)}
        </p>
      </section>
      {isCategory && (
        <section
          aria-labelledby="dil-template-draws"
          className="dil-editor-panel"
        >
          <h2 className="dil-editor-panel__title" id="dil-template-draws">
            Category pages it draws
          </h2>
          <ul className="dil-template-draws">
            {categoryPaths.map((path) => (
              <li key={path}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
          <p className="dil-editor-panel__note">
            {categoryDrawsNote(categoryPaths)}
          </p>
        </section>
      )}
      {id !== undefined && collectionSlug && (
        <section
          aria-labelledby="dil-template-preview"
          className="dil-editor-panel"
        >
          <h2 className="dil-editor-panel__title" id="dil-template-preview">
            Preview
          </h2>
          <PreviewEntries collection={collectionSlug} id={id} />
        </section>
      )}
    </aside>
  );
}
