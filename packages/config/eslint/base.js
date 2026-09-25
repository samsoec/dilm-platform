import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/.open-next/**",
      "**/.sst/**",
      "**/dist/**",
      "**/next-env.d.ts",
      "**/node_modules/**",
      "**/payload-types.ts",
      "**/sst-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
);
