"use client";

import { useFormFields } from "@payloadcms/ui";

import {
  postsOnPage,
  postsOnPageTotal,
  WHO_CAN_BE_PICKED,
  type LayoutBlock,
} from "../../recordPicker";

export function PostsOnPagePanel() {
  const layout = useFormFields(([fields]) => {
    const rows = Number(fields.layout?.rows?.length ?? 0);
    return Array.from({ length: rows }, (_, index) => ({
      blockType: fields[`layout.${index}.blockType`]?.value,
      source: fields[`layout.${index}.source`]?.value,
      count: Number(fields[`layout.${index}.items`]?.rows?.length ?? 0),
      title: fields[`layout.${index}.heading.title`]?.value,
    }));
  });
  const tenant = useFormFields(([fields]) => fields.tenant?.value);
  const blocks: LayoutBlock[] = layout.map((entry) => ({
    blockType: entry.blockType as string | undefined,
    source: entry.source as string | undefined,
    items: Array.from({ length: entry.count }),
    heading: { title: entry.title },
  }));
  const sections = postsOnPage(blocks);
  if (sections.length === 0) return null;
  const shared = tenant === undefined || tenant === null || tenant === "";
  return (
    <aside aria-label="Posts on this page" className="dil-posts-on-page">
      <section className="dil-editor-panel">
        <h2 className="dil-editor-panel__title">
          Posts on this page · {postsOnPageTotal(sections)}
        </h2>
        <ul className="dil-posts-on-page__list">
          {sections.map((section) => (
            <li key={section.number}>
              <span className="dil-posts-on-page__number">
                {String(section.number).padStart(2, "0")}
              </span>{" "}
              {section.title} · {section.count}
            </li>
          ))}
        </ul>
      </section>
      <section className="dil-editor-panel">
        <h2 className="dil-editor-panel__title">{WHO_CAN_BE_PICKED.title}</h2>
        <p className="dil-editor-panel__note">
          {shared ? WHO_CAN_BE_PICKED.shared : WHO_CAN_BE_PICKED.company}
        </p>
      </section>
    </aside>
  );
}
