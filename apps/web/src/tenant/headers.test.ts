import { describe, expect, it } from "vitest";

import {
  DEFAULT_TENANT,
  LOCALE_HEADER,
  TENANT_HEADER,
  localeFromHeaders,
  tenantFromHeaders,
} from "./headers";
import { DEFAULT_LOCALE } from "./locales";

describe("forwarded headers", () => {
  it("reads tenant and locale", () => {
    const h = new Headers({
      [TENANT_HEADER]: "likutelaga",
      [LOCALE_HEADER]: "id",
    });
    expect(tenantFromHeaders(h)).toBe("likutelaga");
    expect(localeFromHeaders(h)).toBe("id");
  });

  it("falls back on missing or unknown values", () => {
    const h = new Headers({ [TENANT_HEADER]: "nope", [LOCALE_HEADER]: "xx" });
    expect(tenantFromHeaders(h)).toBe(DEFAULT_TENANT);
    expect(localeFromHeaders(h)).toBe(DEFAULT_LOCALE);
    expect(localeFromHeaders(new Headers())).toBe(DEFAULT_LOCALE);
  });
});
