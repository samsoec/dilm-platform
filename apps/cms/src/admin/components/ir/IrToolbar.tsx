import type { BeforeListTableServerProps } from "payload";

import { localization } from "../../../localization";
import {
  IR_DOCUMENT_TYPE_OPTIONS,
  IR_LANGUAGE_LABELS,
} from "../../../irDocumentTypes";
import { TitleTag } from "../lists/TitleTag";
import { isTrashView } from "../trash/trash";
import { IrToolbarClient, UploadPdfButton } from "./IrToolbarClient";

export function IrToolbar({ params, user }: BeforeListTableServerProps) {
  if (!user || isTrashView(params)) return null;
  return (
    <>
      <TitleTag>
        <UploadPdfButton />
      </TitleTag>
      <IrToolbarClient
        languages={localization.locales.map((locale) => {
          const value = String(locale);
          return {
            value,
            label: IR_LANGUAGE_LABELS[value] ?? value.toUpperCase(),
          };
        })}
        types={IR_DOCUMENT_TYPE_OPTIONS.map(({ value, label }) => ({
          value,
          label,
        }))}
      />
    </>
  );
}
