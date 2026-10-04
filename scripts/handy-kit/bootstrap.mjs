#!/usr/bin/env node
// handy-kit bootstrap: `npm run kit -- <command>`.
//
// Installed from brand-ux's tools/kit by `init` and refreshed by every `pull`,
// so don't edit it here. It keeps a clone of brand-ux in
// ~/.cache/handy-kit/brand-ux and runs the kit CLI from the brand-ux ref the
// command is about, which means the tooling updates through brand-ux exactly
// like the kit does.
//
// Which CLI runs:
//   --from <checkout>      that checkout's tools/kit (also tests tooling edits)
//   --ref <ref>            the CLI at that brand-ux ref
//   status, no flags       the CLI of whatever the copy was pulled from
//   anything else          the CLI on brand-ux master
//
// Overrides, for working on the tooling itself:
//   HANDY_KIT_HOME     cache root (default ~/.cache/handy-kit)
//   HANDY_KIT_REMOTE   the brand-ux clone URL (default GitHub)
//   HANDY_KIT_CLI      run this cli.mjs and nothing else
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const HOME =
  process.env.HANDY_KIT_HOME || join(homedir(), ".cache", "handy-kit");
const REMOTE =
  process.env.HANDY_KIT_REMOTE || "https://github.com/poengAlex/brand-ux.git";
const CLONE = join(HOME, "brand-ux");
const ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0" };

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const isStatus = command === "status";

function flag(name) {
  const i = args.indexOf(`--${name}`);
  if (i !== -1) return args[i + 1];
  return args.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3);
}

function run(cli, env = {}) {
  const r = spawnSync(process.execPath, [cli, ...args], {
    stdio: "inherit",
    env: { ...process.env, ...env }
  });
  process.exit(r.status ?? 1);
}

// A tooling problem never fails `status`: it runs from a SessionStart hook,
// and a broken cache must not look like a broken kit.
function fail(message) {
  if (isStatus) {
    console.log(`Handy kit: ${message}`);
    process.exit(0);
  }
  console.error(`handy-kit: ${message}`);
  process.exit(1);
}

function git(gitArgs, timeout = 60_000) {
  const r = spawnSync("git", gitArgs, {
    cwd: CLONE,
    encoding: "utf8",
    timeout,
    env: ENV
  });
  return { ok: r.status === 0 && !r.error, out: (r.stdout ?? "").trim() };
}

function resolveCommit(ref) {
  const specs = /^[0-9a-f]{7,40}$/.test(ref)
    ? [ref]
    : [`refs/remotes/origin/${ref}`, `refs/tags/${ref}`];
  for (const spec of specs) {
    const r = git(["rev-parse", "--verify", "--quiet", `${spec}^{commit}`]);
    if (r.ok && r.out) return r.out;
  }
  return null;
}

let lock = null;
try {
  lock = JSON.parse(readFileSync("handy-kit.lock.json", "utf8"));
} catch {
  // never pulled (or unreadable; the CLI reports that)
}

if (process.env.HANDY_KIT_CLI) run(resolve(process.env.HANDY_KIT_CLI));

const from = flag("from");
if (from) {
  const cli = resolve(from, "tools/kit/cli.mjs");
  if (!existsSync(cli)) {
    fail(`${from} has no tools/kit/cli.mjs; is it a brand-ux checkout?`);
  }
  run(cli);
}

const lockPath = lock?.source?.kind === "path" ? lock.source.path : null;
if (isStatus && !flag("ref") && lockPath) {
  const cli = join(lockPath, "tools/kit/cli.mjs");
  if (existsSync(cli)) run(cli);
}

mkdirSync(HOME, { recursive: true });
let offline = false;
if (!existsSync(join(CLONE, ".git"))) {
  const r = spawnSync("git", ["clone", "--quiet", REMOTE, CLONE], {
    encoding: "utf8",
    timeout: isStatus ? 20_000 : 300_000,
    env: ENV
  });
  if (r.status !== 0) {
    rmSync(CLONE, { recursive: true, force: true });
    const why = (r.stderr ?? "").trim().split("\n").pop() || "timed out";
    fail(`could not reach GitHub to clone brand-ux (${why}); status unknown.`);
  }
} else {
  offline = !git(
    ["fetch", "--quiet", "--prune", "origin"],
    isStatus ? 4_000 : 60_000
  ).ok;
}

const lockRef = lock?.source?.kind === "github" ? lock.source.ref : null;
let ref =
  flag("ref") ||
  (isStatus && lockRef) ||
  (command === "upstream" && flag("base")) ||
  "master";
let commit = resolveCommit(ref);
if (!commit && isStatus && !flag("ref") && ref !== "master") {
  ref = "master"; // the branch the copy came from is gone (merged); the CLI says so
  commit = resolveCommit(ref);
}
if (!commit) {
  fail(
    `brand-ux has no ref "${ref}"${offline ? " (and GitHub could not be reached)" : ""}.`
  );
}
if (!git(["cat-file", "-e", `${commit}:tools/kit/cli.mjs`]).ok) {
  fail(
    `brand-ux ${ref} (${commit.slice(0, 7)}) has no kit tooling (tools/kit) yet. ` +
      "Use --ref <a branch that has it> or --from <a local brand-ux checkout>."
  );
}

const dir = join(HOME, "cli", commit);
if (!existsSync(join(dir, "tools/kit/cli.mjs"))) {
  const tmp = `${dir}.tmp-${process.pid}`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const archive = spawnSync(
    "git",
    ["archive", "--format=tar", commit, "tools/kit"],
    {
      cwd: CLONE,
      env: ENV,
      maxBuffer: 64 * 1024 * 1024
    }
  );
  const tar = spawnSync("tar", ["-x", "-f", "-", "-C", tmp], {
    input: archive.stdout
  });
  if (archive.status !== 0 || tar.status !== 0) {
    rmSync(tmp, { recursive: true, force: true });
    fail(`could not extract tools/kit at ${commit.slice(0, 7)}.`);
  }
  rmSync(dir, { recursive: true, force: true });
  renameSync(tmp, dir);
}

run(join(dir, "tools/kit/cli.mjs"), {
  HANDY_KIT_FETCHED: "1",
  HANDY_KIT_OFFLINE: offline ? "1" : ""
});
