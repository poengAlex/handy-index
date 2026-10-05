#!/usr/bin/env node
// Icon-font coverage gate.
//
// The app ships Material Symbols cut down to the icons it uses (see
// scripts/subset-icons.py — 147 kB instead of 3.96 MB). An icon missing from
// that cut does not fail loudly: the ligature never forms and its name
// renders as a plain word ("play_arrow") where the icon should be. So this
// finds every icon name src/ can ask for, by the same rule the subset script
// uses, and fails if the subset's manifest lacks one.
//
// Run: npm run icons:check   (fix: npm run icons:subset)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const MANIFEST = join(SRC, "css/icons/material-symbols-outlined.subset.json");
const EXTRAS = join(
  ROOT,
  "node_modules/@quasar/extras/exports/material-symbols-outlined/icons.json"
);
const QUASAR_SET = join(
  ROOT,
  "node_modules/quasar/icon-set/material-symbols-outlined.js"
);

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));

// symOutlinedFilterAltOff → filter_alt_off, symOutlined1kPlus → 1k_plus; plus
// the older aliases the font also draws, which that list leaves out
const everyIcon = new Set([
  ...JSON.parse(readFileSync(EXTRAS, "utf8")).map(name =>
    name
      .replace(/^symOutlined/, "")
      .replace(/(?<=.)([A-Z])/g, "_$1")
      .toLowerCase()
  ),
  ...manifest.aliases
]);

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry !== "i18n") yield* sourceFiles(path);
    } else if (/\.(vue|ts)$/.test(entry)) {
      yield path;
    }
  }
}

const used = new Set();
for (const file of sourceFiles(SRC)) {
  for (const [, word] of readFileSync(file, "utf8").matchAll(
    /["'`]([a-z][a-z0-9_]*)["'`]/g
  )) {
    used.add(word.replace(/^sym_o_/, ""));
  }
}
for (const [, word] of readFileSync(QUASAR_SET, "utf8").matchAll(
  /sym_o_([a-z0-9_]+)/g
)) {
  used.add(word);
}

const shipped = new Set(manifest.icons);
const missing = [...used].filter(
  word => everyIcon.has(word) && !shipped.has(word)
);

if (missing.length) {
  console.error(
    `Icons used in src/ but missing from the icon font subset: ${missing.join(", ")}\n` +
      "They would render as plain words. Regenerate: npm run icons:subset"
  );
  process.exit(1);
}
console.log(`icons: all ${shipped.size} in the subset, none missing`);
