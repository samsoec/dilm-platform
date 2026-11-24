import next from "@dilm/config/eslint/next";

import noContentInClient from "./eslint-rules/no-content-in-client.mjs";

export default [
  ...next,
  {
    plugins: {
      dilm: { rules: { "no-content-in-client": noContentInClient } },
    },
    rules: { "dilm/no-content-in-client": "error" },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["src/components/JsonLd.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: "dangerouslySetInnerHTML is allowed only in JsonLd.tsx.",
        },
      ],
    },
  },
  {
    files: ["src/components/Analytics.tsx"],
    rules: { "prefer-rest-params": "off" },
  },
];
