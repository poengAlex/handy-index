// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { readFileSync } from "node:fs";
import { defineConfig } from "#q-app";

// The version the About box and the help-page footer show. Read from
// package.json so there is one number to bump per release — the changelog in
// public/CHANGELOG.md is written against the same one.
const { version } = JSON.parse(
  readFileSync(new URL("package.json", import.meta.url), "utf8")
) as { version: string };

// Stamped when this bundle was built (dev: when the dev server started).
const buildDate = new Date().toISOString();

export default defineConfig(() => {
  return {
    // app boot file (/src/boot)
    boot: ["i18n", "icons", "quasar-defaults"],

    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: ["material-symbols-outlined"],

    build: {
      // vue-i18n's own build flags. Left undefined they only produce console
      // warnings, but setting them drops the Options-API runtime and the
      // devtools hooks from the production bundle.
      define: {
        __VUE_I18N_FULL_INSTALL__: true,
        __VUE_I18N_LEGACY_API__: false,
        __INTLIFY_PROD_DEVTOOLS__: false,
        __APP_VERSION__: JSON.stringify(version),
        __BUILD_DATE__: JSON.stringify(buildDate)
      },

      typescript: {
        strict: true,
        vueShim: true
      },

      // https://v2.quasar.dev/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing
      filenameBasedRouting: true,

      vueRouterMode: "hash"
    },

    devServer: {
      https: true,
      open: false
    },

    framework: {
      config: {},
      iconSet: "material-symbols-outlined",
      plugins: ["Notify", "Dark"]
    },

    animations: []
  };
});
