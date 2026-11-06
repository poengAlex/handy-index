// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "#q-app";
import { handyViteConfig } from "./src/components/handy/vite";

// The version the About box and the help-page footer show. Read from
// package.json so there is one number to bump per release — the changelog in
// public/CHANGELOG.md is written against the same one.
const { version } = JSON.parse(
  readFileSync(new URL("package.json", import.meta.url), "utf8")
) as { version: string };

// Stamped when this bundle was built (dev: when the dev server started).
const buildDate = new Date().toISOString();

// The dev server's certificate: this Mac's own localhost certificate when it
// has one (~/.localhost-certs, signed by a localhost-only CA the keychain
// trusts, so every browser takes it, the Claude app's browser pane included),
// else Quasar's self-signed one. Quasar reads the two files itself.
function devHttps() {
  const dir = join(homedir(), ".localhost-certs");
  const cert = join(dir, "localhost.pem");
  const key = join(dir, "localhost-key.pem");
  return existsSync(cert) && existsSync(key) ? { cert, key } : true;
}

export default defineConfig(ctx => {
  return {
    // app boot file (/src/boot)
    boot: ["i18n", "quasar-defaults", "analytics"],

    // the icon font is our own cut of Material Symbols rather than the
    // extras' 4 MB full set — see scripts/subset-icons.py
    css: ["icons/material-symbols-outlined.css", "app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [],

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

      vueRouterMode: "hash",

      // The kit's build fixes (the Options API flag HGraph's uplot-vue
      // wrapper needs, the uplot alias, the vue-i18n chunk fix) live with
      // the kit (handy/vite.ts) and arrive with every sync.
      extendViteConf(viteConf) {
        handyViteConfig(viteConf, { dev: ctx.dev });
      }
    },

    devServer: {
      https: devHttps(),
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
