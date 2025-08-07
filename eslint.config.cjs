const tsParser = require("@typescript-eslint/parser");
const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");

module.exports = [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: "latest",
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSortPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\u0000"],
            [
              "^node:(.*)$",
              `^(${require("module").builtinModules.join("|")})(/|$)`,
            ],
            ["^@?\\w"],
            ["^(@src|src)(/.*|$)"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/order": "off",
      "import/no-unresolved": "error",
      "import/newline-after-import": "error",
    },
  },
];
