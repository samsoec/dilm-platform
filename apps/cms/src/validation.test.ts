import type { TextFieldSingleValidation } from "payload";
import { describe, expect, it } from "vitest";

import {
  isGa4MeasurementId,
  isHttpsUrl,
  isPhoneNumber,
  isWhatsAppLink,
} from "./validation";

function check(validate: TextFieldSingleValidation, value: string) {
  return validate(value, {} as Parameters<TextFieldSingleValidation>[1]);
}

describe("field validators", () => {
  it("leave empty optional fields alone", () => {
    for (const validate of [
      isHttpsUrl,
      isGa4MeasurementId,
      isWhatsAppLink,
      isPhoneNumber,
    ]) {
      expect(check(validate, "")).toBe(true);
    }
  });

  it("accept only https links", () => {
    expect(check(isHttpsUrl, "https://instagram.com/dilgroup")).toBe(true);
    expect(check(isHttpsUrl, "http://instagram.com/dilgroup")).toBeTypeOf(
      "string",
    );
    expect(check(isHttpsUrl, "instagram.com/dilgroup")).toBeTypeOf("string");
  });

  it("accept only GA4 measurement IDs", () => {
    expect(check(isGa4MeasurementId, "G-AB12CD34EF")).toBe(true);
    expect(check(isGa4MeasurementId, "UA-12345-1")).toBeTypeOf("string");
  });

  it("accept only wa.me links with a full number", () => {
    expect(check(isWhatsAppLink, "https://wa.me/6281234567890")).toBe(true);
    expect(check(isWhatsAppLink, "https://wa.me/6281234567890?text=Hi")).toBe(
      true,
    );
    expect(check(isWhatsAppLink, "https://wa.me/081234")).toBeTypeOf("string");
    expect(
      check(isWhatsAppLink, "https://example.com/6281234567890"),
    ).toBeTypeOf("string");
  });

  it("accept phone numbers but not free text", () => {
    expect(check(isPhoneNumber, "+62 21 555-0100")).toBe(true);
    expect(check(isPhoneNumber, "call us")).toBeTypeOf("string");
  });
});
