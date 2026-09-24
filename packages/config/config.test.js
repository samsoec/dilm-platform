import { expect, it } from "vitest";

import eslintBase from "./eslint/base.js";
import prettierBase from "./prettier/base.js";

it("exports a flat ESLint config array", () => {
  expect(Array.isArray(eslintBase)).toBe(true);
  expect(eslintBase.length).toBeGreaterThan(0);
});

it("pins the formatting options every package shares", () => {
  expect(prettierBase).toMatchObject({ printWidth: 80, endOfLine: "lf" });
});
