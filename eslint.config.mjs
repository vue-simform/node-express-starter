import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { rules: { semi: "error", "prefer-const": "error"}},
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
