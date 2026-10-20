"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";

import { localization } from "../../../localization";
import { SegmentedControl } from "../kit/SegmentedControl";
import { LOCALE_LABELS } from "./companies";

const OPTIONS = localization.locales.map((value) => ({
  value,
  label: LOCALE_LABELS[value] ?? value,
}));

export const LocaleField: SelectFieldClientComponent = ({ path, readOnly }) => {
  const { value, setValue } = useField<string>({ path });
  return (
    <div className="field-type dil-company-field">
      <FieldLabel label="Default language" path={path} />
      <SegmentedControl
        disabled={readOnly}
        label="Default language"
        onChange={(next) => setValue(next)}
        options={OPTIONS}
        value={value ?? localization.defaultLocale}
      />
    </div>
  );
};
