import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      // El código usa `catch (_) {}` a propósito para ignorar fallos de
      // localStorage y JSON.parse. Es intencional, no descuido.
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^_|^e$", argsIgnorePattern: "^_" }],
    },
  },
  {
    // Módulos del navegador empaquetados por Vite.
    files: ["src/scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
  },
];
