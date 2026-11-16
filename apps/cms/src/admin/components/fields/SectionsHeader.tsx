"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { BlocksFieldLabelClientComponent } from "payload";
import { useEffect } from "react";

import { altArrowMove, movedText, sectionCountText } from "../../sectionRows";
import { announce } from "./announce";
import { useLockedStructure } from "./useLockedStructure";

export const SectionsHeader: BlocksFieldLabelClientComponent = ({
  field,
  path,
}) => {
  const fieldPath = path ?? field?.name ?? "layout";
  const count = useFormFields(
    ([fields]) => fields[fieldPath]?.rows?.length ?? 0,
  );
  const { moveFieldRow, setModified } = useForm();
  const locked = useLockedStructure();

  useEffect(() => {
    if (locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (!(event.target instanceof Element)) return;
      const row = event.target.closest(
        `[id^="${fieldPath.split(".").join("-")}-row-"]`,
      );
      const move = altArrowMove(event, row?.id, fieldPath, count);
      if (!move) return;
      event.preventDefault();
      const { from, to } = move;
      moveFieldRow({ moveFromIndex: from, moveToIndex: to, path: fieldPath });
      setModified(true);
      const name =
        row?.querySelector(".dil-section-row__name")?.textContent ?? "Section";
      announce(movedText(name, to, count));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, fieldPath, locked, moveFieldRow, setModified]);

  return (
    <span className="dil-sections-header">
      {sectionCountText(count, field?.maxRows)}
    </span>
  );
};
