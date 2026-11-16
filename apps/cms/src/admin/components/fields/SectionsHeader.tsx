"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { BlocksFieldLabelClientComponent } from "payload";
import { useEffect } from "react";

import { clampMove, movedText, sectionCountText } from "../../sectionRows";
import { announce } from "./announce";

const ROW_ID = /^(.+)-row-(\d+)$/;

export const SectionsHeader: BlocksFieldLabelClientComponent = ({
  field,
  path,
}) => {
  const fieldPath = path ?? field?.name ?? "layout";
  const count = useFormFields(
    ([fields]) => fields[fieldPath]?.rows?.length ?? 0,
  );
  const { moveFieldRow, setModified } = useForm();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        !event.altKey ||
        (event.key !== "ArrowUp" && event.key !== "ArrowDown") ||
        !(event.target instanceof Element)
      ) {
        return;
      }
      const row = event.target.closest(
        `[id^="${fieldPath.split(".").join("-")}-row-"]`,
      );
      const match = row ? ROW_ID.exec(row.id) : null;
      if (!match) return;
      event.preventDefault();
      const from = Number(match[2]);
      const to = clampMove(from, event.key === "ArrowUp" ? -1 : 1, count);
      if (to === from) return;
      moveFieldRow({ moveFromIndex: from, moveToIndex: to, path: fieldPath });
      setModified(true);
      const name =
        row?.querySelector(".dil-section-row__name")?.textContent ?? "Section";
      announce(movedText(name, to, count));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, fieldPath, moveFieldRow, setModified]);

  return (
    <span className="dil-sections-header">
      {sectionCountText(count, field?.maxRows)}
    </span>
  );
};
