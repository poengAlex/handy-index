// The kit's build fixes, for a Quasar host's quasar.config.ts:
//
//   import { handyViteConfig } from "./src/components/handy/vite";
//   …
//   build: {
//     extendViteConf(viteConf) {
//       handyViteConfig(viteConf, { dev: ctx.dev });
//     }
//   }
//
// This file runs in Node, while Quasar loads its config — it must import
// nothing from Vue, Quasar or the browser. It imports no types either: an
// app gets `vite` through @quasar/app-vite, and npm does not always hoist it
// to where the app's own typecheck can see it (IVDB's doesn't). The shape
// below is the part of Vite's UserConfig this file touches; Vite's own type
// is assignable to it.

interface ViteAlias {
  find: string | RegExp;
  replacement: string;
}

interface ViteOutput {
  manualChunks?: unknown;
}

type SideEffects = (id: string, external: boolean) => boolean;

export interface HandyViteConf {
  define?: Record<string, unknown>;
  optimizeDeps?: { exclude?: string[] };
  build?: { rollupOptions?: { output?: unknown; treeshake?: unknown } };
  resolve?: { alias?: unknown };
}

/** A kit script module (not a style block), by its module id. */
function isKitScript(id: string): boolean {
  const [file = "", query = ""] = id.split("?");
  return (
    /[\\/]src[\\/]components[\\/]handy[\\/]/.test(file) &&
    /\.(?:ts|vue)$/.test(file) &&
    !/type=style/.test(query)
  );
}

/** Whatever the host had said about side effects, as a function. */
function hostSideEffects(rule: unknown): SideEffects {
  if (typeof rule === "function") return rule as SideEffects;
  if (rule === "no-external") return (_id, external) => !external;
  if (Array.isArray(rule)) return id => rule.includes(id);
  if (typeof rule === "boolean") return () => rule;
  return () => true;
}

export function handyViteConfig(
  viteConf: HandyViteConf,
  opts: { dev: boolean }
): void {
  // uplot-vue (HGraph's chart wrapper) is an Options-API component;
  // app-vite builds Vue with __VUE_OPTIONS_API__ = false unless
  // build.vueOptionsAPI is set, which silently strips the wrapper's
  // data/methods/mounted (empty chart, no error). Quasar writes its value
  // into define before this hook runs, and @vitejs/plugin-vue reads define
  // after it, so setting it here replaces the host flag.
  viteConf.define = { ...viteConf.define, __VUE_OPTIONS_API__: "true" };

  // DEV. With uplot in the dep graph, the optimizer's chunk split of
  // vue-i18n against the shared vue chunk drops the
  // init_runtime_dom_esm_bundler import while still calling it —
  // "[Quasar] boot error: ReferenceError" on every load. Serving
  // vue-i18n's own ESM directly (no pre-bundling) sidesteps the
  // broken split; dev-only cost is a few extra module requests.
  // Scoped to dev because optimizeDeps has no effect on the production
  // build — see the manualChunks below, which is that build's fix.
  // (Found in onboardingv4; harmless for a host without vue-i18n.)
  if (opts.dev) {
    viteConf.optimizeDeps ??= {};
    viteConf.optimizeDeps.exclude = [
      ...(viteConf.optimizeDeps.exclude ?? []),
      "vue-i18n"
    ];
  }

  // vue-i18n's runtime is built from esbuild-prebundled vue, so its
  // module bodies begin with init_*_esm_bundler() calls that belong to
  // the vue chunk. Rollup splits it into its own chunk and emits only
  // SOME of those bindings as imports — the build then dies on load with
  // "init_runtime_dom_esm_bundler is not defined" and a blank page.
  // (optimizeDeps.exclude does not reach the production build: toggling
  // it leaves the output hash identical.) Keeping vue and vue-i18n in one
  // chunk removes the cross-chunk reference the bundler gets wrong.
  viteConf.build ??= {};
  viteConf.build.rollupOptions ??= {};
  const manualChunks = (id: string) =>
    /node_modules[/\\](vue-i18n|@intlify|@vue|vue)[/\\]/.test(id)
      ? "vue-runtime"
      : undefined;
  const output = viteConf.build.rollupOptions.output as
    | ViteOutput
    | ViteOutput[]
    | undefined;
  if (Array.isArray(output)) {
    for (const single of output) single.manualChunks = manualChunks;
  } else {
    viteConf.build.rollupOptions.output = { ...output, manualChunks };
  }

  // Every kit module is free of import-time side effects: components,
  // composables and helpers are definitions only. Saying so lets the bundler
  // drop what an app never uses even though it imports the barrel, which
  // re-exports everything (apps take the whole folder). Without it, importing
  // anything from "@/components/handy" also ships uPlot and uplot-vue
  // (HGraph), the carousel and the background sub-kit: +150 KB on IVDB's
  // first load. Style blocks keep their side effects; they are imported only
  // for their CSS.
  const { treeshake } = viteConf.build.rollupOptions;
  if (treeshake !== false) {
    const base =
      treeshake && typeof treeshake === "object"
        ? (treeshake as Record<string, unknown>)
        : {};
    const host = hostSideEffects(base.moduleSideEffects);
    viteConf.build.rollupOptions.treeshake = {
      ...base,
      moduleSideEffects: (id: string, external: boolean) =>
        isKitScript(id) ? false : host(id, external)
    };
  }

  // uplot-vue is a UMD bundle whose require("uplot") interop receives the
  // ESM namespace instead of the uPlot class ("not a constructor"). Point
  // the bare specifier at the CJS build. Exact-match regex — the CSS import
  // "uplot/dist/uPlot.min.css" must stay untouched.
  viteConf.resolve ??= {};
  const alias = viteConf.resolve.alias ?? {};
  const uplotCjs: ViteAlias = {
    find: /^uplot$/,
    replacement: "uplot/dist/uPlot.cjs.js"
  };
  viteConf.resolve.alias = Array.isArray(alias)
    ? [...(alias as readonly ViteAlias[]), uplotCjs]
    : [
        ...Object.entries(alias as Record<string, string>).map(
          ([find, replacement]) => ({ find, replacement })
        ),
        uplotCjs
      ];
}
