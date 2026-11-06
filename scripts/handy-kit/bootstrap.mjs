#!/usr/bin/env node
// handy-kit bootstrap: `npm run kit -- <command>`.
//
// Installed from brand-ux's tools/kit by `init` and refreshed by every `pull`,
// so don't edit it here. brand-ux lives in handy-playground, at
// projects/brand-ux. In an app inside a handy-playground checkout (scripter4,
// the classifier) this runs the CLI from that checkout. Anywhere else it
// keeps a clone of handy-playground in ~/.cache/handy-kit/handy-playground
// (no file contents up front, nothing checked out) and runs the kit CLI from
// the ref the command is about, which means the tooling updates through
// brand-ux exactly like the kit does.
//
// Which CLI runs:
//   --from <path>          that brand-ux folder's (or checkout's) tools/kit
//   --ref <ref>            the CLI at that handy-playground ref
//   in handy-playground    the checkout's own projects/brand-ux/tools/kit
//   status, no flags       the CLI of whatever the copy was pulled from
//   anything else          the CLI on handy-playground main
//
// Overrides, for working on the tooling itself:
//   HANDY_KIT_HOME     cache root (default ~/.cache/handy-kit)
//   HANDY_KIT_REMOTE   the handy-playground clone URL (default GitHub)
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
import { dirname, join, resolve } from "node:path";

const UPSTREAM = "projects/brand-ux";
const TOOLS = `${UPSTREAM}/tools/kit`;
const DEFAULT_REF = "main";
const OLD_REPO = "poengAlex/brand-ux"; // where brand-ux lived until 2026-10-12
const HOME =
  process.env.HANDY_KIT_HOME || join(homedir(), ".cache", "handy-kit");
const REMOTE =
  process.env.HANDY_KIT_REMOTE ||
  "https://github.com/poengAlex/handy-playground.git";
const CLONE = join(HOME, "handy-playground");
const ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: "0",
  GIT_SSH_COMMAND: process.env.GIT_SSH_COMMAND || "ssh -o BatchMode=yes"
};

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

/** A brand-ux folder with the CLI in it: `dir` itself or `dir`/projects/brand-ux. */
function upstreamAt(dir) {
  for (const d of [dir, join(dir, UPSTREAM)]) {
    if (existsSync(join(d, "tools/kit/cli.mjs"))) return d;
  }
  return null;
}

/** brand-ux's folder when this app is inside a handy-playground checkout. */
function upstreamInRepo(dir) {
  for (let d = dir; ; d = dirname(d)) {
    const up = join(d, UPSTREAM);
    if (
      existsSync(join(up, "tools/kit/cli.mjs")) &&
      existsSync(join(up, "src/components/handy/kit.json"))
    ) {
      return up;
    }
    if (dirname(d) === d) return null;
  }
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
  const dir = upstreamAt(resolve(from));
  if (!dir) {
    fail(
      `${from} has no tools/kit/cli.mjs (nor ${TOOLS}/cli.mjs); is it brand-ux, or a handy-playground checkout?`
    );
  }
  run(join(dir, "tools/kit/cli.mjs"));
}

if (!flag("ref")) {
  const here = upstreamInRepo(process.cwd());
  if (here) run(join(here, "tools/kit/cli.mjs"));
}

const lockPath = lock?.source?.kind === "path" ? lock.source.path : null;
if (isStatus && !flag("ref") && lockPath) {
  const cli = join(lockPath, "tools/kit/cli.mjs");
  if (existsSync(cli)) run(cli);
}

mkdirSync(HOME, { recursive: true });
let offline = false;
if (!existsSync(join(CLONE, ".git"))) {
  // the same flags as CLONE_ARGS in lib/git.mjs
  const r = spawnSync(
    "git",
    ["clone", "--quiet", "--filter=blob:none", "--no-checkout", REMOTE, CLONE],
    {
      encoding: "utf8",
      timeout: isStatus ? 20_000 : 300_000,
      env: ENV
    }
  );
  if (r.status !== 0) {
    rmSync(CLONE, { recursive: true, force: true });
    const why = (r.stderr ?? "").trim().split("\n").pop() || "timed out";
    fail(
      `could not reach GitHub to clone handy-playground (${why}); status unknown.`
    );
  }
} else {
  offline = !git(
    ["fetch", "--quiet", "--prune", "origin"],
    isStatus ? 4_000 : 60_000
  ).ok;
}

// a ref from the old brand-ux repository means nothing in handy-playground
const lockRef =
  lock?.source?.kind === "github" && lock.source.repo !== OLD_REPO
    ? lock.source.ref
    : null;
let ref =
  flag("ref") ||
  (isStatus && lockRef) ||
  (command === "upstream" && flag("base")) ||
  DEFAULT_REF;
let commit = resolveCommit(ref);
if (!commit && isStatus && !flag("ref") && ref !== DEFAULT_REF) {
  ref = DEFAULT_REF; // the branch the copy came from is gone (merged); the CLI says so
  commit = resolveCommit(ref);
}
if (!commit) {
  fail(
    `handy-playground has no ref "${ref}"${offline ? " (and GitHub could not be reached)" : ""}.`
  );
}
if (!git(["cat-file", "-e", `${commit}:${TOOLS}/cli.mjs`]).ok) {
  fail(
    `handy-playground ${ref} (${commit.slice(0, 7)}) has no kit tooling (${TOOLS}) yet. ` +
      "Use --ref <a branch that has it> or --from <a local handy-playground checkout>."
  );
}

const dir = join(HOME, "cli", commit);
if (!existsSync(join(dir, TOOLS, "cli.mjs"))) {
  const tmp = `${dir}.tmp-${process.pid}`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const archive = spawnSync("git", ["archive", "--format=tar", commit, TOOLS], {
    cwd: CLONE,
    env: ENV,
    maxBuffer: 64 * 1024 * 1024
  });
  const tar = spawnSync("tar", ["-x", "-f", "-", "-C", tmp], {
    input: archive.stdout
  });
  if (archive.status !== 0 || tar.status !== 0) {
    rmSync(tmp, { recursive: true, force: true });
    fail(`could not extract ${TOOLS} at ${commit.slice(0, 7)}.`);
  }
  rmSync(dir, { recursive: true, force: true });
  renameSync(tmp, dir);
}

run(join(dir, TOOLS, "cli.mjs"), {
  // which clone was fetched: the old brand-ux bootstrap set "1" for its own
  HANDY_KIT_FETCHED: CLONE,
  HANDY_KIT_OFFLINE: offline ? "1" : ""
});
