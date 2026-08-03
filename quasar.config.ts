// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from "#q-app";

export default defineConfig(() => {
  return {
    // app boot file (/src/boot)
    boot: ["icons", "quasar-defaults"],

    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: ["material-symbols-outlined"],

    build: {
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
