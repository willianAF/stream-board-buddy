import js from "@eslint/js";
import ts from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,

  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: false,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",

      ...reactHooks.configs.recommended.rules,

      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    ignores: [
      "vite.config.ts",
      "postcss.config.js",
      "tailwind.config.ts",
      "**/dist/**",
      "**/build/**",
      "**/.eslintrc.*"
    ],
  },
];
