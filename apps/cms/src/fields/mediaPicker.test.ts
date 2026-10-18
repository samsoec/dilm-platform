import type { Field } from "payload";
import { describe, expect, it } from "vitest";

import { Footer } from "../collections/Footer";
import { TenantSettings } from "../collections/TenantSettings";
import { childFields } from "../testing";
import { MEDIA_PICKER_FIELD } from "./mediaPicker";

function uploads(fields: Field[]): Field[] {
  return fields.flatMap((field) => [
    ...(field.type === "upload" ? [field] : []),
    ...uploads(childFields(field)),
  ]);
}

describe("media picker (F-05, FR-UI-78)", () => {
  it.each([
    ["footer", Footer, ["logo"]],
    [
      "tenant-settings",
      TenantSettings,
      ["logoOnLight", "logoOnDark", "ogImage"],
    ],
  ] as const)(
    "is the field component for every image on %s",
    (_, collection, names) => {
      const found = uploads(collection.fields);
      expect(found.map((field) => ("name" in field ? field.name : ""))).toEqual(
        names,
      );
      for (const field of found) {
        expect(field.admin?.components).toMatchObject({
          Field: { path: MEDIA_PICKER_FIELD },
        });
      }
    },
  );
});
