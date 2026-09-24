import base from "@dilm/config/eslint/base";

export default [
  ...base,
  {
    files: ["infra/sst.config.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];
