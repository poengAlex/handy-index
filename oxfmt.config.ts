import { defineConfig } from "oxfmt";

export default defineConfig({
  $schema: "./node_modules/oxfmt/configuration_schema.json",

  ignorePatterns: [
    "**/node_modules/",
    "dist/",
    "quasar.config.*.temporary.compiled*",
    ".quasar/",
    "src-cordova/",
    "src-capacitor/",
    "src/router/typed-router.d.ts",
    // byte-exact mirror of brand-ux's kit and its sync tooling, replaced by
    // `npm run kit -- pull` — reformatting means drift
    "src/components/handy/",
    "scripts/handy-kit/"
  ],

  printWidth: 80,
  arrowParens: "avoid",
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: "strict",
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "none",
  useTabs: false,
  vueIndentScriptAndStyle: false
});
