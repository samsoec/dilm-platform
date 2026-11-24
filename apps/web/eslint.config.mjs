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
];
