// The catalog snapshot the SPA loads, rebuilt here from the Script Index API's
// `/index` so phones don't have to swallow it raw.
//
// What the endpoint serves is ~17 MB gzipped and ~83 MB decoded: pretty-printed
// (37% of it whitespace), gzip only, ~4.5 s before the first byte, and carrying
// descriptions and per-script segment arrays that only the video page reads.
// Parsed in a browser that peaks near 1 GB for the tab, which is where cheap
// Android phones and older iPhones start killing it. So this keeps a slimmed
// copy in memory, compressed both ways, and refreshes it on a timer:
//
//   /api/catalog       every video, minus `description`, the segment arrays
//                      and the unused metrics; plus `spm`, the script speed
//                      the browse page filters on, worked out with the app's
//                      own `scriptHeat` so it is the same number by definition
//   /api/catalog/:id   what was taken out of that one video, for its page
//
// The SPA falls back to the API itself whenever this is unavailable (dev
// server, first seconds after a deploy, upstream outage), so nothing here is
// load-bearing for the site working — only for it being fast.

import { createHash } from "node:crypto";
import { promisify } from "node:util";
import zlib from "node:zlib";

const UPSTREAM = "https://scripts01.handyfeeling.com/api/script/index/v0/index";

/** The endpoint's own `max-age` is an hour; a quarter of that keeps a fresh
 * visitor at most 15 minutes behind it at the cost of one fetch upstream. */
const REFRESH_MS = 15 * 60 * 1000;
const RETRY_MS = 60 * 1000;

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

/** Script speed exactly as the browse page computes it (`scriptSpeed` in
 * queries.ts). Loaded from the app's TypeScript source, which needs a Node
 * that strips types (22.18+, 23.6+). Without one the catalog keeps the raw
 * segments and the descriptions instead, and the app measures for itself. */
let speedOf = null;
try {
  const { scriptHeat } = await import("../src/services/script-heat.ts");
  speedOf = metadata => scriptHeat(metadata)?.strokesPerMinute ?? null;
} catch (error) {
  console.warn("catalog: script speeds computed client-side —", error.message);
}

/** The slice of `scriptMetadata` that `scriptHeat` reads. The rest
 * (byte counts, start/end times, the relative_* figures, min/max/non-zero
 * counts) is read by nothing. */
function heatInputs(metadata) {
  if (!metadata) return undefined;
  const segments = metadata.segment_distances;
  return {
    actions: metadata.actions,
    points: metadata.points,
    segment_distances: segments && {
      distances: segments.distances,
      total_distance: segments.total_distance,
      resolution: segments.resolution
    }
  };
}

/** One upstream video → its catalog entry, and what the video page fetches
 * separately. `externalRef` and `scripterId` are read by nothing. */
function split(video) {
  const {
    description,
    externalRef: _externalRef,
    scripterId: _scripterId,
    scriptMetadata,
    ...entry
  } = video;
  if (!speedOf) {
    return {
      entry: {
        ...entry,
        description,
        scriptMetadata: heatInputs(scriptMetadata)
      }
    };
  }
  return {
    entry: { ...entry, spm: speedOf(scriptMetadata) },
    extras: { description, scriptMetadata: heatInputs(scriptMetadata) }
  };
}

/**
 * The elements of a top-level JSON array, parsed one at a time as the body
 * streams in. Parsing the whole 83 MB in one go costs ~700 MB of RSS — more
 * than a small instance has — while this never holds more than one video's
 * text plus the slimmed output.
 */
async function* arrayElements(body) {
  const decoder = new TextDecoder();
  let depth = 0;
  let inString = false;
  let escaped = false;
  let pending = "";
  for await (const bytes of body) {
    const text = decoder.decode(bytes, { stream: true });
    let start = pending ? 0 : -1;
    for (let i = 0; i < text.length; i += 1) {
      const code = text.charCodeAt(i);
      if (inString) {
        if (escaped) escaped = false;
        else if (code === 92)
          escaped = true; // \
        else if (code === 34) inString = false; // "
        continue;
      }
      if (code === 34) {
        inString = true;
      } else if (code === 123 || code === 91) {
        // { [
        depth += 1;
        if (depth === 2) start = i;
      } else if (code === 125 || code === 93) {
        // } ]
        depth -= 1;
        if (depth === 1) {
          yield JSON.parse(pending + text.slice(start, i + 1));
          pending = "";
          start = -1;
        }
      }
    }
    if (start >= 0) pending += text.slice(start);
  }
  if (depth !== 0) throw new Error("index body ended mid-array");
}

/** Every character above 0x7e written as a \u escape. A browser stores a
 * string with even one character past Latin-1 at two bytes per character, so
 * one emoji in one title would double the memory of the whole download; an
 * ASCII body decodes to a one-byte string. */
function asciiOnly(json) {
  return json.replace(
    /[\u007f-￿]/g,
    char => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`
  );
}

let current = null;

/** One entry's JSON as bytes. Kept as bytes from here on, never joined as a
 * string: V8 leaves an escaped string two bytes per character whenever its
 * source was, so a joined catalog came out at twice its size, plus a copy. */
function jsonBytes(value) {
  return Buffer.from(asciiOnly(JSON.stringify(value)), "latin1");
}

async function build() {
  const started = Date.now();
  const response = await fetch(UPSTREAM);
  if (!response.ok || !response.body) {
    throw new Error(`upstream answered ${response.status}`);
  }
  const pieces = [];
  const extras = new Map();
  let videos = 0;
  for await (const video of arrayElements(response.body)) {
    const parts = split(video);
    pieces.push(Buffer.from(videos ? "," : "["), jsonBytes(parts.entry));
    videos += 1;
    if (parts.extras && video.partnerVideoId) {
      extras.set(video.partnerVideoId, jsonBytes(parts.extras));
    }
  }
  if (!videos) throw new Error("upstream index was empty");
  pieces.push(Buffer.from("]"));

  const raw = Buffer.concat(pieces);
  pieces.length = 0;
  const [gz, br] = await Promise.all([
    gzip(raw, { level: 9 }),
    brotli(raw, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 9,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length
      }
    })
  ]);
  current = {
    raw,
    gz,
    br,
    etag: `"${createHash("sha1").update(raw).digest("base64url")}"`,
    extras
  };
  console.log(
    `catalog: ${videos} videos, ${(raw.length / 1e6).toFixed(1)} MB` +
      ` (br ${(br.length / 1e6).toFixed(1)} MB, gzip ${(gz.length / 1e6).toFixed(1)} MB)` +
      ` in ${((Date.now() - started) / 1000).toFixed(1)} s`
  );
}

async function keepFresh() {
  try {
    await build();
    setTimeout(keepFresh, REFRESH_MS).unref();
  } catch (error) {
    // the previous copy, if any, keeps serving; without one the SPA falls
    // back to the API directly
    console.warn("catalog: refresh failed —", error.message);
    setTimeout(keepFresh, RETRY_MS).unref();
  }
}

export function serveCatalog(app) {
  void keepFresh();

  app.get("/api/catalog", (req, res) => {
    if (!current) {
      res.status(503).set("Retry-After", "30").end();
      return;
    }
    res.set({
      "Content-Type": "application/json",
      // revalidate every time; an unchanged snapshot costs a 304
      "Cache-Control": "no-cache",
      ETag: current.etag,
      Vary: "Accept-Encoding",
      // the decoded size, so the loading bar has a real denominator
      "X-Decoded-Length": String(current.raw.length)
    });
    if (req.fresh) {
      res.status(304).end();
      return;
    }
    const accepts = req.get("accept-encoding") ?? "";
    if (/\bbr\b/.test(accepts)) {
      res.set("Content-Encoding", "br").end(current.br);
    } else if (/\bgzip\b/.test(accepts)) {
      res.set("Content-Encoding", "gzip").end(current.gz);
    } else {
      res.end(current.raw);
    }
  });

  app.get("/api/catalog/:id", (req, res) => {
    const extras = current?.extras.get(req.params.id);
    if (!extras) {
      res.status(current ? 404 : 503).end();
      return;
    }
    res
      .set({
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900"
      })
      .send(extras);
  });
}
