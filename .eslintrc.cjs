/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    // Prefer simple-import-sort for deterministic import ordering
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports.
          ["^\u0000"],
          // Node.js builtins. e.g. 'fs', 'path'
          [
            "^node:(.*)$",
            `^(${require("module").builtinModules.join("|")})(/|$)`,
          ],
          // Packages. e.g. 'react', 'lodash'
          ["^@?w"],
          // Internal packages (e.g., src alias if added later)
          ["^(@src|src)(/.*|$)"],
          // Parent imports. Put `..` last.
          ["^..(?!/?$)", "^../?$"],
          // Other relative imports. Put same-folder and `.` last.
          ["^./(?=.*/)(?!/?$)", "^.(?!/?$)", "^./?$"],
          // Style imports.
          ["^.+.s?css$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",

    // Disable built-in sorting from import/order to avoid conflicts
    "import/order": "off",

    // Helpful import rules
    "import/no-unresolved": "error",
    "import/newline-after-import": "error",
  },
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
      },
    },
  ],
};
