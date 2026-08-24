#!/usr/bin/env node
// i18n integrity gate.
//
// TypeScript already guarantees the *Norwegian* side is complete: every
// nb-NO namespace is annotated `typeof enUS`, so a missing translation fails
// the build. What TypeScript cannot check is the other two halves of the
// contract, because vue-i18n's `t()` accepts any string by design:
//
//   1. every key a component asks for actually exists  (else a raw dotted
//      key like "video.meta.duration" renders on screen)
//   2. no user-facing English is still hardcoded in a component
//
// This script checks both. (1) is an error and exits non-zero; (2) is a
// heuristic sweep, reported for a human to judge.
//
// Run: npm run i18n:check

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const I18N = join(SRC, "i18n");
const REFERENCE = "en-US";
const LOCALES = readdirSync(I18N, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort((a, b) =>
    a === REFERENCE ? -1 : b === REFERENCE ? 1 : a.localeCompare(b)
  );

// How many `|` branches each locale's plural messages must carry. Read out of
// plurals.ts rather than restated here — the rule and the branch count are one
// decision, and a copy of it here would be the thing that goes stale.
// oxlint-disable-next-line typescript/no-implied-eval
const PLURAL_BRANCHES = new Function(
  `return (${
    /PLURAL_BRANCHES[^=]*=\s*(\{[\s\S]*?\})/.exec(
      readFileSync(join(I18N, "plurals.ts"), "utf8")
    )?.[1] ?? "{}"
  });`
)();

// ---------------------------------------------------------------- utilities

/** Strip // and /* *\/ comments without touching lookalikes inside strings. */
function stripComments(code) {
  let out = "";
  let i = 0;
  let quote = null;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    if (quote) {
      if (ch === "\\") {
        out += ch + (next ?? "");
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
      out += ch;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/** The object literal a message module default-exports. These files are pure
 * data by contract, so evaluating the literal is safe and avoids needing a
 * bundler to resolve TypeScript imports. */
function readMessageModule(file) {
  const code = stripComments(readFileSync(file, "utf8"));
  // `export default { … };`  or  `const ns: typeof enUS = { … };`
  const start = code.search(/(?:export\s+default|=)\s*\{/);
  if (start === -1) throw new Error(`no object literal in ${file}`);
  const open = code.indexOf("{", start);
  let depth = 0;
  let quote = null;
  let end = -1;
  for (let i = open; i < code.length; i++) {
    const ch = code[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) {
      end = i + 1;
      break;
    }
  }
  if (end === -1) throw new Error(`unbalanced object literal in ${file}`);
  const literal = code.slice(open, end);
  // A message file that pulled a value in from elsewhere would break this
  // reader — and `new Function` would throw on the free identifier anyway.
  // Matched as a *call* so a message key literally named "import" (which
  // `common.action.import` is) doesn't trip the guard.
  if (/\b(?:import|require)\s*\(/.test(literal)) {
    throw new Error(`${file}: message objects must be pure data`);
  }
  // Deliberate: these files are this repo's own source, the literal has just
  // been proven to contain no calls, and evaluating it is what avoids
  // depending on a bundler to resolve TypeScript imports.
  // oxlint-disable-next-line typescript/no-implied-eval
  return new Function(`return (${literal});`)();
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function flatten(node, prefix, into) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, path, into);
    else into.set(path, value);
  }
  return into;
}

// ------------------------------------------------------------ load messages

const namespaces = readdirSync(join(I18N, "en-US"))
  .filter(f => f.endsWith(".ts") && f !== "index.ts")
  .map(f => f.replace(/\.ts$/, ""))
  .sort();

const defined = new Map(); // locale -> Map<dotted path, string>
for (const locale of LOCALES) {
  const flat = new Map();
  for (const ns of namespaces) {
    flatten(readMessageModule(join(I18N, locale, `${ns}.ts`)), ns, flat);
  }
  defined.set(locale, flat);
}

const en = defined.get(REFERENCE);

// ------------------------------------------------------------- collect uses

const SOURCES = walk(SRC).filter(
  f => (f.endsWith(".vue") || f.endsWith(".ts")) && !f.startsWith(I18N)
);

// $t("a.b") / t('a.b') / translate("a.b") / <i18n-t keypath="a.b">
const KEY_CALL = /(?<![\w$.])\$?t\(\s*["'`]([a-z][\w.]*\.[\w.]+)["'`]/gi;
const KEYPATH = /keypath\s*=\s*["']([a-z][\w.]*\.[\w.]+)["']/gi;
// useFormat().count("videos", n) resolves to common.count.videos
const COUNT_CALL = /\bcount\(\s*["'`](\w+)["'`]/g;
// t(`browse.sort.${value}`) — the suffix is computed, so every key under the
// static prefix counts as reachable. Without this the audit reports whole
// groups (sort options, error codes) as dead.
const DYNAMIC_KEY = /(?<![\w$.])\$?t\(\s*`([\w.]+)\.\$\{/g;

const used = new Map(); // key -> Set<file>
const dynamicPrefixes = new Map(); // static prefix of a computed key -> file
function noteUse(key, file) {
  if (!used.has(key)) used.set(key, new Set());
  used.get(key).add(relative(ROOT, file));
}

for (const file of SOURCES) {
  const code = readFileSync(file, "utf8");
  for (const m of code.matchAll(KEY_CALL)) noteUse(m[1], file);
  for (const m of code.matchAll(KEYPATH)) noteUse(m[1], file);
  for (const m of code.matchAll(COUNT_CALL))
    noteUse(`common.count.${m[1]}`, file);
  for (const m of code.matchAll(DYNAMIC_KEY))
    dynamicPrefixes.set(m[1], relative(ROOT, file));
}

// a key under a computed prefix is reachable, but *which* one can't be known
// statically — so the prefix vouches for its whole group rather than for a
// single key. Nothing is claimed about keys that are merely misspelled there.
for (const [prefix, file] of dynamicPrefixes) {
  for (const key of en.keys()) {
    if (key.startsWith(`${prefix}.`)) noteUse(key, join(ROOT, file));
  }
}

// ----------------------------------------------------------------- report 1

let failed = false;
const missing = [...used].filter(([key]) => !en.has(key));
if (missing.length) {
  failed = true;
  console.log(`\n✗ ${missing.length} key(s) used but not defined in en-US:\n`);
  for (const [key, files] of missing) {
    console.log(`  ${key}\n      ${[...files].join("\n      ")}`);
  }
}

const table = [];
for (const locale of LOCALES) {
  const flat = defined.get(locale);
  const missing = [...en.keys()].filter(key => !flat.has(key));
  if (missing.length) {
    failed = true;
    console.log(`\n✗ ${missing.length} key(s) missing from ${locale}:\n`);
    for (const key of missing) console.log(`  ${key}`);
  }

  // A plural message must have exactly as many branches as the locale's rule
  // can index. Too few and a Russian "many" falls off the end; too many and a
  // Japanese message carries branches nothing will ever select.
  const want = PLURAL_BRANCHES[locale] ?? 2;
  const shape = [...en]
    .filter(([, value]) => value.includes(" | "))
    .map(([key]) => [key, (flat.get(key) ?? "").split(" | ").length])
    .filter(([, got]) => got !== want);
  if (shape.length) {
    failed = true;
    console.log(
      `\n✗ ${locale}: ${shape.length} plural message(s) with the wrong branch` +
        ` count (expected ${want}):\n`
    );
    for (const [key, got] of shape) console.log(`  ${key} — has ${got}`);
  }

  // Seeded locales start as verbatim English, so this is the translation
  // progress bar. A handful is normal — product names, "VR", "Format".
  const same =
    locale === REFERENCE
      ? 0
      : [...en].filter(
          ([key, value]) => flat.get(key) === value && /[a-z]{4}/i.test(value)
        ).length;
  table.push({ locale, keys: flat.size, untranslated: same });
}

console.log("\n  locale    keys  untranslated");
for (const row of table) {
  const bar =
    row.untranslated === 0
      ? ""
      : `  (${Math.round((row.untranslated / row.keys) * 100)}%)`;
  console.log(
    `  ${row.locale.padEnd(8)}  ${String(row.keys).padStart(4)}  ${String(row.untranslated).padStart(6)}${bar}`
  );
}

const unused = [...en.keys()].filter(k => !used.has(k));
if (unused.length) {
  console.log(`\n· ${unused.length} key(s) defined but never referenced:\n`);
  for (const key of unused) console.log(`  ${key}`);
}

// ----------------------------------------------------------------- report 2

// Attributes whose value is read by a person. Only the *static* form matters
// — a bound `:label="…"` has already been through an expression.
const TEXT_ATTRS =
  "label|title|caption|placeholder|aria-label|alt|hint|lead|message|text|" +
  "unit|suffix|prefix|error-message|empty-title|empty-body";
const ATTR_RE = new RegExp(`(?<![:@\\w-])(${TEXT_ATTRS})="([^"]{2,})"`, "g");

// Words that are legitimately the same in both languages, or aren't prose.
const ALLOWED = new Set([
  "VR",
  "IVDB",
  "Handy",
  "Ohdoki AS",
  "Pornhub",
  "xHamster",
  "API",
  "URL",
  "OK",
  "GitHub",
  "s",
  "×",
  "%"
]);

const suspects = [];
for (const file of SOURCES.filter(f => f.endsWith(".vue"))) {
  const raw = readFileSync(file, "utf8");
  const template = raw
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "");
  const hits = new Set();

  for (const m of template.matchAll(ATTR_RE)) {
    const value = m[2].trim();
    if (ALLOWED.has(value)) continue;
    if (!/[A-Za-z]{3}/.test(value)) continue;
    // an attribute value that is one lowercase token is an icon/enum, not copy
    if (/^[a-z][a-z0-9_-]*$/.test(value)) continue;
    hits.add(`${m[1]}="${value}"`);
  }

  // text nodes: between > and <, ignoring interpolation and entities
  for (const m of template.matchAll(/>([^<>{}]{3,})</g)) {
    const text = m[1].replace(/&[a-z]+;/g, " ").trim();
    if (!text || ALLOWED.has(text)) continue;
    if (!/[A-Za-z]{3}/.test(text)) continue;
    if (/^[a-z][a-z0-9_-]*$/.test(text)) continue;
    hits.add(JSON.stringify(text.slice(0, 70)));
  }

  if (hits.size) suspects.push({ file: relative(ROOT, file), hits: [...hits] });
}

if (suspects.length) {
  console.log(
    `\n· possible untranslated template copy in ${suspects.length} file(s):\n`
  );
  for (const suspect of suspects) {
    console.log(`  ${suspect.file}`);
    for (const hit of suspect.hits) console.log(`      ${hit}`);
  }
}

// ------------------------------------------------------------------ summary

console.log(
  `\n${failed ? "✗" : "✓"} ${namespaces.length} namespaces · ` +
    `${en.size} keys × ${LOCALES.length} locales · ` +
    `${used.size} referenced · ${suspects.length} file(s) to review\n`
);
process.exit(failed ? 1 : 0);
