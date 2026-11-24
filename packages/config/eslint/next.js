import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";

import base from "./base.js";

export default [
  ...base,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  nextPlugin.configs["core-web-vitals"],
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
];
