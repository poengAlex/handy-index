// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from "#q-app";

export default defineConfig(() => {
  return {
    // app boot file (/src/boot)
    boot: ["i18n", "icons", "quasar-defaults", "context-menu"],

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
        __INTLIFY_PROD_DEVTOOLS__: false
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
