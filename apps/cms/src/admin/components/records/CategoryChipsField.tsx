"use client";

import { FieldLabel, useField, useLocale } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useEffect, useState } from "react";

type Category = { id: number | string; name?: string | null };

function idOf(value: number | string | { id: number | string }): string {
  return String(typeof value === "object" ? value.id : value);
}

export const CategoryChipsField: RelationshipFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const { code } = useLocale();
  const { value, setValue } = useField<
    (number | string | { id: number | string })[] | null
  >({ path: fieldPath });
  const [categories, setCategories] = useState<Category[]>([]);
  const picked = (value ?? []).map(idOf);

  useEffect(() => {
    fetch(`/api/categories?limit=50&depth=0&locale=${code}`, {
      credentials: "include",
    })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then(({ docs }: { docs?: Category[] }) => setCategories(docs ?? []))
      .catch(() => undefined);
  }, [code]);

  const toggle = (id: string) =>
    setValue(
      picked.includes(id)
        ? picked.filter((one) => one !== id)
        : [...picked, id],
    );

  return (
    <div className="field-type dil-category-chips">
      <FieldLabel label={field.label} path={fieldPath} />
      <div
        className="dil-record-picker__chips"
        role="group"
        aria-label="Categories"
      >
        <button
          aria-pressed={picked.length === 0}
          className="dil-record-picker__chip"
          disabled={readOnly}
          onClick={() => setValue([])}
          type="button"
        >
          All categories
        </button>
        {categories.map((category) => (
          <button
            aria-pressed={picked.includes(String(category.id))}
            className="dil-record-picker__chip"
            disabled={readOnly}
            key={category.id}
            onClick={() => toggle(String(category.id))}
            type="button"
          >
            {category.name ?? `Category ${category.id}`}
          </button>
        ))}
      </div>
    </div>
  );
};
