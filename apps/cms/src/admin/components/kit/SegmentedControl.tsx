"use client";

import { useId } from "react";

export type SegmentOption<V extends string> = { value: V; label: string };

export function SegmentedControl<V extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  options: readonly SegmentOption<V>[];
  value: V;
  onChange: (value: V) => void;
  disabled?: boolean;
}) {
  const name = useId();

  return (
    <div aria-label={label} className="dil-segmented-control" role="radiogroup">
      {options.map((option) => (
        <label
          className={[
            "dil-segmented-control__option",
            option.value === value && "dil-segmented-control__option--active",
          ]
            .filter(Boolean)
            .join(" ")}
          key={option.value}
        >
          <input
            checked={option.value === value}
            className="dil-sr-only"
            disabled={disabled}
            name={name}
            onChange={() => onChange(option.value)}
            type="radio"
            value={option.value}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
