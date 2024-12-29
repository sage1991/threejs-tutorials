import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"
import sort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import ts from "typescript-eslint"

export default ts.config(
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["node_modules", ".yarn", ".cache", ".idea", "dist"]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    plugins: {
      "simple-import-sort": sort
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  },
  prettier
)
