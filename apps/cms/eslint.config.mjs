import base from "@dilm/config/eslint/base";

export default [
  ...base,
  { ignores: ["src/migrations/**"] },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", fetch: "readonly", process: "readonly" },
    },
  },
];
