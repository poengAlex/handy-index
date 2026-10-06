#!/usr/bin/env node
// Claude Code SessionStart hook, installed by handy-kit from brand-ux; don't
// edit it here, `npm run kit -- pull` overwrites it.
//
// Prints one paragraph (which Claude Code adds to the session's context):
// whether src/components/handy/ is in sync with brand-ux, behind it, or
// locally edited. Always exits 0; a slow network or a broken cache only
// makes the paragraph say so.
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");

const r = spawnSync(
  process.execPath,
  [join(HERE, "bootstrap.mjs"), "status", "--brief"],
  { cwd: ROOT, encoding: "utf8", timeout: 15_000 }
);

let text = (r.stdout ?? "").trim();
if (r.error?.code === "ETIMEDOUT") {
  text =
    "Handy kit: the status check timed out, so whether src/components/handy/ is behind brand-ux is unknown. Run `npm run kit -- status` before working on anything that uses the kit. The folder is a read-only copy; kit changes go upstream (handy-kit skill).";
} else if (!text) {
  const why = (r.stderr ?? "").trim().split("\n").pop();
  text = `Handy kit: the status check failed${why ? ` (${why})` : ""}. Run \`npm run kit -- status\`. The folder is a read-only copy; kit changes go upstream (handy-kit skill).`;
}
console.log(text);
process.exit(0);
