"use client";

import {
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
} from "@payloadcms/ui";
import type { BlocksFieldClient } from "payload";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MAX_LAYOUT_BLOCKS } from "@dilm/shared-types";

import { Banner } from "../kit/Banner";
import { MaterialIcon } from "../MaterialIcon";
import { sectionCountText, sectionsKeptNote, sectionsTabText } from "./editor";
import { seoView, type SeoDefaults } from "./seo";
import { useLocale } from "@payloadcms/ui";

const TAB_BUTTONS = ".dil-editor-tabs .tabs-field__tab-button";

function useTabButtons(): HTMLElement[] {
  const [buttons, setButtons] = useState<HTMLElement[]>([]);
  useEffect(() => {
    const find = () => {
      const found = [...document.querySelectorAll<HTMLElement>(TAB_BUTTONS)];
      setButtons((current) =>
        current.length === found.length &&
        current.every((button, index) => button === found[index])
          ? current
          : found,
      );
    };
    find();
    const observer = new MutationObserver(find);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return buttons;
}

export function useSectionCount(initial: number): number {
  const rows = useFormFields(([fields]) => fields.layout?.rows?.length);
  return rows ?? initial;
}

export function TabMarks({
  sections,
  defaults,
}: {
  sections: number;
  defaults: SeoDefaults;
}) {
  const buttons = useTabButtons();
  const { code } = useLocale();
  const {
    config: { localization },
  } = useConfig();
  const count = useSectionCount(sections);
  const title = useFormFields(([fields]) => fields["meta.title"]?.value) as
    string | undefined;
  const description = useFormFields(
    ([fields]) => fields["meta.description"]?.value,
  ) as string | undefined;
  const image = useFormFields(([fields]) => fields["meta.image"]?.value);
  const issues = seoView({ title, description, image }, defaults, {
    locale: code,
    defaultLocale: localization ? localization.defaultLocale : code,
  }).issues;

  const [sectionsTab, , seoTab] = buttons;
  return (
    <>
      {sectionsTab &&
        createPortal(
          <span className="dil-tab-count">{sectionsTabText(count)}</span>,
          sectionsTab,
        )}
      {seoTab &&
        issues.length > 0 &&
        createPortal(
          <span
            className="dil-tab-dot"
            role="img"
            aria-label={`${issues.length} ${issues.length === 1 ? "issue" : "issues"}: ${issues.join(" ")}`}
            title={issues.join(" ")}
          />,
          seoTab,
        )}
    </>
  );
}

type Row = { id: string; blockType?: string; collapsed?: boolean };

function blockLabel(
  blocks: BlocksFieldClient["blocks"],
  slug: string | undefined,
  language: string,
): string {
  const block = blocks.find((candidate) => candidate.slug === slug);
  const singular = block?.labels?.singular;
  if (typeof singular === "string") return singular;
  if (singular && typeof singular === "object") {
    const byLanguage = singular as Record<string, string>;
    return byLanguage[language] ?? byLanguage.en ?? slug ?? "Section";
  }
  return slug ?? "Section";
}

export function SectionsPanel({ sections }: { sections: number }) {
  const forwards = useFormFields(([fields]) => Boolean(fields.forwards?.value));
  const rows = useFormFields(([fields]) => fields.layout?.rows) as
    Row[] | undefined;
  const { dispatchFields } = useForm();
  const { collectionSlug, setDocFieldPreferences } = useDocumentInfo();
  const { getEntityConfig } = useConfig();
  const { code } = useLocale();
  const selectId = useId();
  const count = rows?.length ?? sections;

  if (forwards) return <SectionsKept count={sections} />;
  if (!rows) return null;

  const layout = getEntityConfig({
    collectionSlug: collectionSlug as never,
  })?.fields.find((field) => "name" in field && field.name === "layout") as
    BlocksFieldClient | undefined;
  const allCollapsed = rows.length > 0 && rows.every((row) => row.collapsed);

  const setAll = (collapsed: boolean) => {
    dispatchFields({
      type: "SET_ALL_ROWS_COLLAPSED",
      path: "layout",
      updatedRows: rows.map((row) => ({ ...row, collapsed })),
    });
    void setDocFieldPreferences("layout", {
      collapsed: collapsed ? rows.map((row) => row.id) : [],
    });
  };

  const jump = (index: number) => {
    const row = document.getElementById(`layout-row-${index}`);
    if (!row) return;
    row.scrollIntoView({ block: "start", behavior: "smooth" });
    row
      .querySelector<HTMLElement>('[role="button"], button, [tabindex="0"]')
      ?.focus({ preventScroll: true });
  };

  return (
    <div className="dil-sections-bar">
      <span className="dil-sections-bar__count">
        {sectionCountText(count, MAX_LAYOUT_BLOCKS)}
      </span>
      {rows.length > 1 && (
        <span className="dil-sections-bar__jump">
          <label htmlFor={selectId}>Jump to</label>
          <select
            id={selectId}
            onChange={(event) => {
              const index = Number(event.target.value);
              event.target.value = "";
              if (!Number.isNaN(index)) jump(index);
            }}
            value=""
          >
            <option value="">Section…</option>
            {rows.map((row, index) => (
              <option key={row.id} value={index}>
                {String(index + 1).padStart(2, "0")}{" "}
                {layout
                  ? blockLabel(layout.blocks, row.blockType, code)
                  : row.blockType}
              </option>
            ))}
          </select>
        </span>
      )}
      {rows.length > 0 && (
        <button
          className="dil-sections-bar__toggle"
          onClick={() => setAll(!allCollapsed)}
          type="button"
        >
          <MaterialIcon name={allCollapsed ? "unfold_more" : "unfold_less"} />
          {allCollapsed ? "Expand all" : "Collapse all"}
        </button>
      )}
    </div>
  );
}

function SectionsKept({ count }: { count: number }) {
  return (
    <Banner icon="visibility_off" tone="info">
      {sectionsKeptNote(count)}
    </Banner>
  );
}
