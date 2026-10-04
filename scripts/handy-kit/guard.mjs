#!/usr/bin/env node
// Claude Code PreToolUse hook (Edit|Write|MultiEdit|NotebookEdit), installed
// by handy-kit from brand-ux; don't edit it here, `npm run kit -- pull`
// overwrites it.
//
// src/components/handy/ is a read-only copy of brand-ux's kit. This blocks
// Claude's file-editing tools inside it (exit 2: the call is refused and
// stderr goes back to Claude) and points at the upstream flow instead.
// Anything it can't read is let through, so a hook bug never blocks work.
import { existsSync, readFileSync, realpathSync } from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve
} from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const KIT = join(ROOT, "src", "components", "handy");
const FOLD = process.platform === "darwin" || process.platform === "win32";

/** realpath of the deepest existing ancestor, plus the rest: /tmp ≡ /private/tmp. */
function real(path) {
  let head = path;
  const tail = [];
  while (!existsSync(head) && dirname(head) !== head) {
    tail.unshift(basename(head));
    head = dirname(head);
  }
  try {
    head = realpathSync(head);
  } catch {
    // keep it as given
  }
  return join(head, ...tail);
}

function inKit(path) {
  const kit = real(KIT);
  const target = real(path);
  const rel = FOLD
    ? relative(kit.toLowerCase(), target.toLowerCase())
    : relative(kit, target);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

/** Every string under a key ending in "path" (file_path, notebook_path, …). */
function paths(value, key = "", out = []) {
  if (typeof value === "string") {
    if (/path$/i.test(key)) out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) paths(item, key, out);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) paths(v, k, out);
  }
  return out;
}

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const cwd = typeof input?.cwd === "string" ? input.cwd : process.cwd();
const hit = paths(input?.tool_input ?? {})
  .map(p => resolve(cwd, p))
  .find(inKit);
if (!hit) process.exit(0);

process.stderr.write(
  `Blocked: ${relative(ROOT, hit)} is inside src/components/handy/, a read-only copy of the Handy kit from brand-ux (see handy-kit.lock.json). Don't edit it here, and don't work around this with shell commands. A kit change goes upstream:
  1. npm run kit -- upstream start <slug>     (prints a brand-ux worktree)
  2. edit the kit in that worktree, add a CHANGELOG.md entry
  3. npm run kit -- pull --from <worktree>    (test it in this app)
  4. npm run kit -- upstream finish <slug>    (gates, commit, compare URL)
If the app only needs different behaviour, ask for it upstream as a prop or option. The handy-kit skill has the details.
`
);
process.exit(2);
