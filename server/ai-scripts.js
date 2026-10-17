// The AI scripts Handy's auto-scripter has made for videos on the request
// board, kept in sync here so the board can offer them without every visitor
// paging through the auto-scripter's list.
//
//   /api/ai-scripts    every live AI script, cut to what the board reads:
//                      which request or video it is for, when it last
//                      changed, and where to download it
//
// The list is public and read-only (handy-playground, classifier-api, "Live
// scripts: the public part"). It is ordered by last change, so after one full
// pull at start-up this asks only for what changed since the last entry it
// saw. An entry never disappears from the list, so nothing is ever deleted
// here either: a newer script for the same video replaces the older one.
//
// The SPA falls back to the auto-scripter's list itself whenever this is
// unavailable (dev server, first seconds after a deploy), so nothing here is
// load-bearing — it saves each visitor the round trips.

import { createHash } from "node:crypto";
import { promisify } from "node:util";
import zlib from "node:zlib";

const LIVE = "https://playground.handyfeeling.com/classifier/api/live";

/** New requests get scripted within hours, so a quarter of an hour behind is
 * plenty — and costs one small request when nothing changed. */
const REFRESH_MS = 15 * 60 * 1000;
/** The auto-scripter's host restarts about once a day; a minute covers that. */
const RETRY_MS = 60 * 1000;
const PAGE = 5000;
/** backstop against a cursor that never advances */
const MAX_PAGES = 100;

const gzip = promisify(zlib.gzip);

/** id → the slimmed entry, in the API's own field names so the SPA reads
 * this and the API's list with one parser */
const scripts = new Map();
/** "<updated>|<id>" of the last entry pulled — the same form as the API's
 * `next`, and what `since` takes */
let cursor = null;
let current = null;

function str(value) {
  return typeof value === "string" ? value : null;
}

/** What the board and the AI scripts page read of one entry; null for one it couldn't use. The
 * SPA checks the download address before linking it — this only drops
 * entries that are not entries at all. */
function slim(entry) {
  if (!entry || !str(entry.id) || !str(entry.download)) return null;
  return {
    id: entry.id,
    request_id: str(entry.request_id),
    title: str(entry.title),
    url: str(entry.url),
    duration_s: typeof entry.duration_s === "number" ? entry.duration_s : null,
    actions: typeof entry.actions === "number" ? entry.actions : null,
    updated: str(entry.updated),
    download: entry.download
  };
}

/** Every page since `cursor`, upserted. The cursor moves after each page, so
 * a failure halfway resumes from the last page that landed. */
async function pull() {
  let changed = 0;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(LIVE);
    url.searchParams.set("limit", String(PAGE));
    if (cursor) url.searchParams.set("since", cursor);
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`live list answered ${response.status}`);
    const body = await response.json();
    if (!Array.isArray(body?.scripts)) {
      throw new Error("live list answered without a scripts array");
    }
    for (const entry of body.scripts) {
      const kept = slim(entry);
      if (!kept) continue;
      scripts.set(kept.id, kept);
      changed += 1;
    }
    const last = body.scripts.at(-1);
    if (str(last?.updated) && str(last?.id)) {
      cursor = `${last.updated}|${last.id}`;
    }
    if (!body.next) return changed;
  }
  throw new Error(`live list still had more after ${MAX_PAGES} pages`);
}

async function rebuild() {
  const raw = Buffer.from(JSON.stringify({ scripts: [...scripts.values()] }));
  current = {
    raw,
    gz: await gzip(raw, { level: 9 }),
    etag: `"${createHash("sha1").update(raw).digest("base64url")}"`
  };
}

async function keepFresh() {
  try {
    const changed = await pull();
    if (changed || !current) {
      await rebuild();
      console.log(`ai-scripts: ${scripts.size} scripts (${changed} changed)`);
    }
    setTimeout(keepFresh, REFRESH_MS).unref();
  } catch (error) {
    // what was pulled so far keeps serving; without anything the SPA asks
    // the auto-scripter directly
    console.warn("ai-scripts: sync failed —", error.message);
    if (scripts.size) await rebuild().catch(() => {});
    setTimeout(keepFresh, RETRY_MS).unref();
  }
}

export function serveAiScripts(app) {
  void keepFresh();

  app.get("/api/ai-scripts", (req, res) => {
    if (!current) {
      res.status(503).set("Retry-After", "30").end();
      return;
    }
    res.set({
      "Content-Type": "application/json",
      // revalidate every time; an unchanged list costs a 304
      "Cache-Control": "no-cache",
      ETag: current.etag,
      Vary: "Accept-Encoding"
    });
    if (req.fresh) {
      res.status(304).end();
      return;
    }
    if (/\bgzip\b/.test(req.get("accept-encoding") ?? "")) {
      res.set("Content-Encoding", "gzip").end(current.gz);
    } else {
      res.end(current.raw);
    }
  });
}
