"use client";

import { useAuth, useConfig, useListQuery } from "@payloadcms/ui";
import type { Where } from "payload";
import { formatAdminURL } from "payload/shared";
import { useId } from "react";

import { ActionButton } from "../kit/ActionButton";
import { MaterialIcon } from "../MaterialIcon";
import { type IrFilters, irFilters, irWhere } from "./irList";

type Option = { value: string; label: string };

export function UploadPdfButton() {
  const { permissions } = useAuth();
  const {
    config: {
      routes: { admin },
    },
  } = useConfig();
  if (!permissions?.collections?.["ir-documents"]?.create) return null;
  return (
    <ActionButton
      className="dil-upload-pdf"
      el="link"
      icon="upload_file"
      url={formatAdminURL({
        adminRoute: admin,
        path: "/collections/ir-documents/create",
      })}
    >
      Upload PDF
    </ActionButton>
  );
}

export function IrToolbarClient({
  types,
  languages,
}: {
  types: Option[];
  languages: Option[];
}) {
  const { query, refineListData } = useListQuery();
  const filters = irFilters(query.where as Where | undefined);
  const languageId = useId();

  const apply = (next: IrFilters) =>
    void refineListData({ where: irWhere(next), page: 1 });

  const chips: (Option & { selected: boolean })[] = [
    { value: "", label: "All", selected: !filters.type },
    ...types.map((type) => ({
      ...type,
      selected: filters.type === type.value,
    })),
  ];

  return (
    <div className="dil-ir-toolbar">
      <div aria-label="Document type" className="dil-filter-chips" role="group">
        {chips.map((chip) => (
          <button
            aria-pressed={chip.selected}
            className="dil-filter-chip"
            key={chip.value || "all"}
            onClick={() => apply({ ...filters, type: chip.value || undefined })}
            type="button"
          >
            {chip.label}
          </button>
        ))}
      </div>
      <label className="dil-ir-toolbar__language" htmlFor={languageId}>
        <span className="dil-sr-only">Language</span>
        <select
          id={languageId}
          onChange={(event) =>
            apply({ ...filters, locale: event.target.value || undefined })
          }
          value={filters.locale ?? ""}
        >
          <option value="">Language: all</option>
          {languages.map((language) => (
            <option key={language.value} value={language.value}>
              Language: {language.label}
            </option>
          ))}
        </select>
        <MaterialIcon name="expand_more" />
      </label>
    </div>
  );
}
