"use client";

import { useAuth, useDocumentDrawer } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import type { DefaultCellComponentProps } from "payload";
import { useEffect, useRef } from "react";

import { tenantColors } from "../../brandColor";
import { MaterialIcon } from "../MaterialIcon";
import { LOCALE_LABELS } from "./companies";

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function CompanyCell({ cellData, rowData }: DefaultCellComponentProps) {
  return (
    <span className="dil-company">
      <span
        aria-hidden
        className="dil-company__swatch"
        style={{ background: tenantColors(rowData.brandColor).light }}
      />
      <span className="dil-company__text">
        <span className="dil-company__name">{text(cellData)}</span>
        <code className="dil-company__slug">{text(rowData.slug)}</code>
      </span>
    </span>
  );
}

export function DomainCell({ cellData }: DefaultCellComponentProps) {
  return <code className="dil-company__mono">{text(cellData)}</code>;
}

export function LocaleCell({ cellData }: DefaultCellComponentProps) {
  const value = text(cellData);
  return <>{LOCALE_LABELS[value] ?? value}</>;
}

export function ColorCell({ cellData }: DefaultCellComponentProps) {
  const value = text(cellData);
  if (!value) return <span className="dil-company__none">Not set</span>;
  return (
    <span className="dil-company__color">
      <span
        aria-hidden
        className="dil-company__chip"
        style={{ background: value }}
      />
      <code className="dil-company__mono">{value.toUpperCase()}</code>
    </span>
  );
}

export function EditCell(props: DefaultCellComponentProps) {
  const { permissions } = useAuth();
  if (!permissions?.collections?.tenants?.update) return null;
  return <EditCompany {...props} />;
}

function EditCompany({ rowData }: DefaultCellComponentProps) {
  const router = useRouter();
  const ref = useRef<HTMLSpanElement>(null);
  const name = text(rowData.name);
  const [Drawer, , { isDrawerOpen, openDrawer, closeDrawer }] =
    useDocumentDrawer({
      collectionSlug: "tenants",
      id: rowData.id as number,
    });

  useEffect(() => {
    ref.current
      ?.closest("tr")
      ?.classList.toggle("dil-company-row--editing", isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <span className="dil-company__edit" ref={ref}>
      <button
        aria-label={`Edit ${name}`}
        className="dil-company__edit-button"
        onClick={openDrawer}
        type="button"
      >
        {isDrawerOpen ? "Editing" : "Edit"}
      </button>
      <Drawer
        Header={
          <div className="dil-company-drawer__head">
            <h2>Edit {name}</h2>
            <button
              aria-label="Close"
              className="dil-drawer__close"
              onClick={closeDrawer}
              type="button"
            >
              <MaterialIcon name="close" />
            </button>
          </div>
        }
        onSave={() => {
          closeDrawer();
          router.refresh();
        }}
      />
    </span>
  );
}
