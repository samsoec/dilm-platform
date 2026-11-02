import type { Config, Field } from "payload";
import { describe, expect, it } from "vitest";

import { localizedSeoFields, pageModelPlugins } from "./pageModel";
import { findField, fieldNames } from "./testing";

const ENTRY: Config = {
  collections: [
    { slug: "media", upload: true, fields: [] },
    { slug: "tenants", fields: [] },
  ],
} as unknown as Config;

async function applied() {
  let config: Config = ENTRY;
  for (const plugin of pageModelPlugins) config = await plugin(config);
  return config;
}

describe("localizedSeoFields", () => {
  const seo = localizedSeoFields({
    defaultFields: [
      { name: "title", type: "text" },
      { name: "description", type: "textarea" },
      { name: "image", type: "upload", relationTo: "media" },
      { name: "preview", type: "ui", admin: {} },
    ] as Field[],
  });

  it("localizes title, description and image", () => {
    for (const name of ["title", "description", "image"]) {
      expect(findField(seo, name)).toMatchObject({ localized: true });
    }
  });

  it("leaves the other fields alone", () => {
    expect(findField(seo, "preview")).not.toHaveProperty("localized");
  });
});

describe("pageModelPlugins", () => {
  it("registers three plugins", () => {
    expect(pageModelPlugins).toHaveLength(3);
  });

  it("adds the redirects collection with the extended fields", async () => {
    const config = await applied();
    const redirects = config.collections!.find((c) => c.slug === "redirects")!;

    expect(redirects).toBeDefined();
    expect(fieldNames(redirects.fields)).toEqual(
      expect.arrayContaining(["from", "to", "tenant", "locale", "origin"]),
    );
    expect(redirects.access?.update).toBeTypeOf("function");
  });

  it("keeps the redirects collection out of the multi-tenant scope", async () => {
    const config = await applied();
    const redirects = config.collections!.find((c) => c.slug === "redirects")!;

    expect(redirects.custom).toEqual({ nav: { icon: "link" } });
  });
});
