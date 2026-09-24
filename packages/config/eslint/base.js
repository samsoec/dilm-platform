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
      "**/node_modules/**",
      "**/sst-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
);
