"use client";

import { SelectInput, useField, useFormFields } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";

import { SOCIAL_PLATFORM_OPTIONS } from "../../data/socialPlatforms";

const PLATFORM_PATH = /^(.*)\.(\d+)\.platform$/;

export const PlatformSelect: SelectFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const { value, setValue, showError } = useField<string>({ path: fieldPath });
  const arrayPath = PLATFORM_PATH.exec(fieldPath)?.[1];
  const usedKey = useFormFields(([fields]) =>
    Object.entries(fields)
      .filter(
        ([key]) =>
          key !== fieldPath && PLATFORM_PATH.exec(key)?.[1] === arrayPath,
      )
      .map(([, state]) => state?.value)
      .filter((used): used is string => typeof used === "string" && !!used)
      .join(","),
  );
  const used = new Set(usedKey.split(","));

  return (
    <SelectInput
      className="dil-platform-select"
      isClearable={false}
      label={field.label}
      name={field.name}
      onChange={(option) => {
        const picked = Array.isArray(option) ? option[0] : option;
        setValue(picked?.value ?? null);
      }}
      options={SOCIAL_PLATFORM_OPTIONS.map((option) => ({
        ...option,
        isDisabled: used.has(option.value),
      }))}
      path={fieldPath}
      placeholder={field.admin?.placeholder as string | undefined}
      readOnly={readOnly}
      required={field.required}
      showError={showError}
      value={value ?? undefined}
    />
  );
};
