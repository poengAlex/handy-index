# IVDB v2 — what changed for users

A rundown of everything user-visible in the `master` → `v2` rewrite, written as
source material for the community announcement post.

v1 was a Quasar data-table with an expandable filter panel. v2 is a ground-up
rebuild on the Handy design system: a browsable catalog with an Apple-TV-style
homepage, real search, a personal library, and a proper video page.

---

## 1. New interface

- **Apple-TV-style homepage**, replacing the old "Interactive video database +
  BETA banner" splash: a featured hero plus content shelves — Recently added,
  My favorites, Recently viewed, _Because you like &lt;tag&gt;_, Top rated,
  Most played, VR, top-tag rows, Recently updated. Thin or empty shelves hide
  themselves.
- **Top navigation bar** (Videos / Tags / Sites / Performers / Playlists /
  Requests) with favorites and history icons, replacing the hamburger drawer.
  The drawer stays on mobile.
- **Light and dark theme** toggle in the header; defaults to dark. The old
  per-page dark-mode quirks are gone.
- **Full-width layout** option in settings, instead of the fixed centered
  column.
- Page transitions, skeleton loading states, and a real empty/error state on
  every page ("Couldn't load the catalog → Try again") instead of a spinner
  that never resolves.

## 2. Browse and search — rebuilt

- **Every filter lives in the URL**, so results are shareable and the back
  button works.
- **Share button** on the results page copies the link (native share sheet on
  mobile). The link carries every filter _including_ orientation and the
  paywall settings, so the recipient sees your results, not theirs.
- **Sorts**: Recently added, Recently updated, Top rated, Most played, Most
  viewed, Longest, A–Z — each with an ascending/descending flip. v1 had four
  sorts and no most-played or top-rated.
- **Filters**: tag (multi-select, AND-matched), site, performer, VR-only, and a
  **duration range slider** (new). Active filters appear as removable chips and
  the button carries a count badge — _Filters (3)_.
- **Endless scroll** over the whole result set. v1 paginated a q-table 36 rows
  at a time.
- Live result count, plus a **"hidden by" notice** spelling out exactly why the
  catalog is smaller than the index — e.g. "7,468 videos hidden by muted tags ·
  1,816 by the Straight filter".
- Picking a site or a performer now overrides the ambient orientation filter.
  In v1 the sites list could send you straight to an empty page.

## 3. Your library (mostly new)

- **Favorites page** with its own grid. Favorites are never hidden by your
  filters.
- **Playlists — actually shipped.** v1 showed a "This feature will come soon…"
  banner. Now: create, rename and delete; add from the video page or the
  thumbnail quick-menu; an edit mode for removing videos; **import/export** as
  a `.json` file, as copyable JSON text, or as a temporary share link (~90
  days); and **"Get all scripts"** — one click downloads every free script in
  the playlist.
- **Recently viewed** — a homepage shelf with one-click clear, plus a full
  page. Stored only in this browser, and the page says so.

## 4. Video page

- Full media hero and a **Details** card: script free/premium, published,
  duration, format, site, scripter, rating with vote count, script plays.
- **Get script** downloads a real `.funscript` file named after the video,
  instead of opening a raw token URL in a tab.
- **Photo gallery** with a full-size viewer (arrows, counter) — shown when
  explicit previews are on.
- **Script comments**: read and post, anonymous, connection-key gated. New.
- **Star rating** with your own vote remembered and the community score shown
  alongside.
- **Performer links with avatars**, tag pills that link into browse, and a
  right-click menu on each tag (Browse this tag / Mute this tag).
- **Related videos** ("More like this", by shared-tag overlap) and **More from
  this site**. v1 pulled four random videos from the same partner.
- **Embedded player** (Pornhub / xHamster), opt-in in settings, with an honest
  note that playback here does **not** sync with the Handy. This replaces v1's
  "external videos" toggle and its browser-extension warning.
- Share, favorite and add-to-playlist buttons. A video that 404s during the
  initial catalog download retries once the snapshot lands, instead of showing
  "not found".

## 5. Quick menu on every thumbnail (new)

Right-click or long-press any card: Open · Open in new tab · Add/remove
favorite · Add to playlist · **Download script** · Copy link · Watch on site.
Premium scripts show a disabled row explaining why the download isn't there.

## 6. Muted tags (new feature)

Mute a tag and every video carrying it leaves the catalog — browse, search,
shelves, related videos, tag cloud. Details:

- Matching is exact, so muting "gay" doesn't mute "gay massage".
- The picker shows **the cost before you commit** ("this is on 7,468 videos —
  49% of what you can currently see").
- Orientation tags can't be muted; they'd fight the orientation filter.
- A header badge appears while mutes are on, so it's never a mystery why
  things are missing.
- Favorites and playlists are exempt — what you saved stays put.

## 7. Settings and filters

- **Two separate paywall switches** instead of v1's single premium toggle:
  _Premium scripts_ (script behind a partner's paywall, **off** by default) and
  _Premium videos_ (video behind a partner's paywall, **on** by default). Both
  gates are the partners' paywalls, not ours, and they cross freely in the
  index, so one shared switch was misleading.
- **Orientation switcher in the header** (Straight / Gay / Trans / Everything);
  the icon shows the current setting. The same setting is reachable from
  settings and from the browse filters.
- **Explicit previews** (NSFW) toggle, now paired with a first-visit
  age/consent dialog.
- **Granular "Clear data"**: wipe recently viewed, favorites, playlists, muted
  tags, votes, connection key or preferences individually. v1 had one nuclear
  `localStorage.clear()`.
- The connection key input sanitizes what you paste.
- **A real Help page** listing every feature, replacing v1's "This page is not
  complete" plus Chrome-extension install instructions.

## 8. Requests

- The voting board now doubles as the queue: every tile carries **its true
  scripting rank**, and the position doesn't renumber when you filter or
  re-sort.
- The **whole board loads at once**, so search, sort and tag filters actually
  cover everything. v1 paged 24 at a time with Previous/Next and no search at
  all.
- Sort by Most votes / Newest / Longest / A–Z, filter by tag, and **hide what
  you've already voted on**.
- URL validation before submitting, vote buttons that read "Voted" once cast,
  endless scroll, and a distinct "connection key rejected" state (v1 just said
  "Something went wrong").

## 9. Tags, Performers, Sites

- **Tags**: a searchable, sortable pill cloud with counts and endless scroll.
  v1 capped the list at 300 tags and re-paged the API in 1,000-tag chunks on
  every visit.
- **Performers**: a full directory with avatars, video counts and average
  rating, searchable and sortable. v1 showed a _random_ page of 48 performers
  with Back/Next buttons.
- **Sites**: per-site video counts, search, and an honest "x of y" whenever
  your filters are narrowing things.

## 10. Speed and reliability

- The catalog loads **once per session as a single snapshot**, with a real
  progress bar and percentage (~40 MB), instead of re-fetching lists on every
  page.
- **Dead thumbnails are learned and remembered**, so broken partner-CDN artwork
  stops producing grey tiles across visits.
- Social link previews (og:image), so shared IVDB links unfurl properly.

## 11. Ten languages (new)

- **The site is fully translated into ten languages**: English, Norsk,
  Português (Brasil), Español, Deutsch, Français, 日本語, 한국어, Русский and
  简体中文. Every page, dialog, toast, empty state, error and screen-reader
  label — not just the navigation.
- **It picks your language automatically** from your browser, and it is not
  fussy about how the request is written: `pt-PT` gets Brazilian Portuguese,
  `zh-TW` gets Simplified Chinese, `nn`/`no` get Bokmål, `es-MX` gets Spanish.
  Anything we don't have falls back to English.
- **Settings → Language** overrides it, as a chip row with every language
  named in its own script. "Match my browser" keeps following the browser
  rather than freezing today's guess.
- Numbers, dates and plurals follow the language too — 15 000 / 15,000 /
  15.000 as each language writes it, and correct plural forms including
  **Russian's three** (1 тег, 2 тега, 5 тегов) and the fact that **Japanese,
  Korean and Chinese have none**. Quasar's own controls switch with it.
- **CJK text gets the right typeface per script.** The same character is drawn
  differently in Japanese and Chinese, so the font stack is chosen from the
  page language rather than left to a generic fallback.
- **Only the language you read is downloaded** — each one is a separate chunk,
  so nine unused translations cost nothing.
- **Privacy & terms is translated in all ten**, each with a note that the
  English version is the authoritative one.

## 12. Privacy

- `no-referrer` sitewide and a strict Content-Security-Policy. Outbound links
  to partner sites carry `noopener noreferrer`.
- Everything — favorites, playlists, history, votes, connection key — stays in
  your browser. The history page and homepage shelf state this explicitly.
- The old "report a video" mailto chip is gone.

## 13. Things that went away

- **The browser-extension (BEX) dependency.** No more "install the Handy
  browser extension" step, no extension-detection warnings, no auto-importing
  the connection key from it.
- Random tag colours, the q-table grid, the paged performer browser, and the
  "coming soon" playlist banner.
- `/request` is now `/requests`.

---

## Migration note — decide before announcing

**v1 favorites won't carry over.** v1 stored favorites as full video objects;
v2 stores IDs, and there's no migration ([settings.ts:39](src/stores/settings.ts#L39)).
An existing user's saved favorites will silently show as empty, while the
"Clear data" dialog still counts them. The same applies to old star ratings
(`videoVotes` → `scriptVotes`).

What **does** carry over: connection key, NSFW setting, orientation, and
request upvotes.

Recommended fix: add the migration in the settings store's `afterHydrate`,
alongside the ones already there for the retired premium switches — it's a few
lines. Otherwise, say so plainly in the post.
