# IVDB target architecture

Status: **proposal** (agreed direction, not yet migrated). Every rule here
exists to kill a duplication or bug this repo has actually shipped — nothing
is speculative.

## The idea in one paragraph

Keep the current five layers and the filename routing. The change is a **core
of named primitives** (components + composables + formatters) that every page
composes instead of hand-rolling. A page then contains only what is unique
about it: which selector feeds it, its copy, and its page-specific CSS.
Today's evidence: ~8 pages hand-roll the same loading/error/empty ladder,
every page hand-rolls its header, five flows hand-roll connection-key gating
(one shipped a stale-action bug), two pages hand-roll offset paging, and the
browse page's bespoke URL-filter plumbing shipped two resync bugs. Each of
those becomes exactly one primitive.

## Layers and dependency rules

| Layer               | Contents                                              | Rule                                                                                                                                                                                                                                                           |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `services/`         | `script-index/{client,types,queries}.ts`, `format.ts` | Framework-free **and language-free** pure TS. Imports nothing above it. New selectors go in `queries.ts`; new formatters in `format.ts`. A failure here returns a _code_ and a formatter returns _parts_ — the message layer owns the words (see `src/i18n/`). |
| `stores/`           | `catalog`, `prefs`, `auth`, `library`, `activity`     | Durable state only. Imports services only. UI flow state (dialog open, drafts, pending actions) is **banned** from stores — it belongs to composables.                                                                                                         |
| `composables/`      | behavior/state machines, renderless                   | May import stores + services. Never components/pages.                                                                                                                                                                                                          |
| `components/handy/` | the brand kit, verbatim                               | **Never forked.** Re-copy from brand-ux when it evolves.                                                                                                                                                                                                       |
| `components/`       | app primitives + domain components                    | Compose kit + composables. Props in, events out; no route access.                                                                                                                                                                                              |
| `pages/`            | filename routes, unchanged                            | The only layer touching route/router. Composition roots. **A page hand-rolling a ladder, header, count label, key gate, paging loop, or query parsing is a review defect.**                                                                                    |

**Admission rule:** a primitive is only promoted to shared when a second
consumer _or a shipped bug_ exists. Inline first; extract on the second use.

## The primitives menu

Components:

- **`StateGate`** — the loading/error/empty/ready ladder. `status`, `empty?`,
  error copy props, `@retry`; slots `#default`/`#empty`; owns the centered
  40vh layout. Replaces ~8 hand-rolled ladders. Works for both the catalog
  status and `usePagedList` status.
- **`PageHeader`** — `title`, `lead?`, `count?` + `#actions` slot. Makes the
  h1/caption classes and margins structural (three separate review findings
  were exactly this drift).
- **`SearchField`** — the filled/dense/clearable/debounced search input with
  prepended icon and the "clearable emits null" normalization. Currently
  copy-pasted on three pages.
- **`FilterChips`** — the removable-chip row (chip + close icon in a naked
  button), currently duplicated twice inside the browse page alone.
- Existing media/domain primitives stay: `TileCard`, `MediaImage`,
  `MediaHero`, `VideoCard`, `VideoGrid`, `CarouselRow`, `RequestCard`,
  dialogs.

Composables:

- **`useKeyGatedAction`** — connection-key gating: `guard(action)` runs now or
  queues + opens the dialog; `onSaved()` resumes exactly once;
  dismiss-without-save clears the queued action (the shipped
  stale-pendingAction bug, fixed structurally). **Rule: one instance per
  concern** — the detail page keeps separate gates for download vs
  rate/comment; sharing one instance is how the original bug happened.
- **`usePagedList<T>`** — offset paging: `items/status/hasMore/loadingMore/
capped`, `loadFirst/loadMore/loadAll(max)`, plus **`mutate(fn)`** for
  optimistic updates (the vote-count bump). Replaces the requests board and
  queue machines.
- **`useUrlFilters(schema)`** — URL-as-source-of-truth filters via codecs
  (`p.text() / p.list() / p.oneOf() / p.flag() / p.int(min,max,sentinel)`),
  `apply(patch)` with defaults omitted (canonical URLs), `clear()`, and an
  active-count for the "Filters (n)" badge.
- **`useDraftValue`** — the one echo-safe draft↔committed sync (debounced
  search, commit-on-change sliders). Both shipped resync bugs live here as
  regression knowledge.
- **`useIncrementalReveal`** — exists already; unchanged.
- **`useShelves`** — homepage `ShelfDef[]` config formalized (only if a second
  shelf surface appears; the homepage pattern is already config-driven).

Services:

- **`formatCount(n, noun, opts?)`** — kills seven pluralize/toLocaleString
  copies (two review findings were exactly this).
- **`browseLink({tag?, partnerId?, performerId+performerName?, …})`** — the
  typed builder for `/videos?…` links, currently assembled by hand on four
  pages; canonicalizes param names.

## Store split (from the settings god-store)

- `prefs.ts` — consent, nsfw, showPremium, orientation.
- `auth.ts` — connectionKey + trimmed `key` / `hasKey` getters (the
  `.trim()` currently re-derived at 8+ call sites).
- `library.ts` — favorites, playlists CRUD, recentlyViewed.
- `activity.ts` — requestUpvotes, scriptVotes (client-side memory for APIs
  that keep no per-user record).
- Each store registers a reset with a tiny **resettable registry** so "Clear
  all data" can never silently miss a new field.
- One-shot `migrate.ts` at boot fans the legacy persisted `settings` blob
  into the new keys, idempotently, keeping the old blob until the new keys
  are verified — existing users lose nothing.

## Migration plan (each step ships green)

1. **Gate + header:** add `formatCount`, `StateGate`, `PageHeader`; convert
   the five simple catalog pages (performers, tags, sites, favorites,
   playlists index). Delete their ladders/headers.
2. **URL filters:** add `useUrlFilters` + `useDraftValue` + `SearchField` +
   `FilterChips`; rewrite the browse page on them (~736 → ~250 lines),
   extract the filters modal as a dumb dialog. Manual URL/back-button
   verification — codecs must reproduce the exact sentinel semantics.
3. **Key gating:** add `auth.ts` + `useKeyGatedAction`; migrate the five
   gated flows; delete every local pendingAction/keyDialog pair.
4. **Paging:** add `usePagedList`; rewrite requests board + queue on it.
5. **Detail-page split:** extract the seven inlined features into
   `composables/video/*` machines + dumb `components/video/*` views, one at
   a time (~1043 → ~280 lines). Keep the route-race guards and popup
   discipline verbatim.
6. **Store split + migrate.ts** (the only step touching user data — test
   against a captured localStorage snapshot).
7. **Shelves** (optional, on second consumer): `useShelves` +
   `home-shelves.ts` data module.
8. **Lock-in:** vitest unit tests for the codecs, draft resync, gate
   resume/dismiss, paging; add the primitives menu to the project memory so
   future agent sessions reach for primitives instead of re-inlining —
   without this the architecture erodes.

## What a new page costs afterwards

A complete new listing page ("Scripters": searchable grid, endless scroll,
states, links into browse) is ~100 lines — `useCatalogStore` + a selector +
`StateGate` + `PageHeader` + `SearchField` + `useIncrementalReveal` +
`TileCard`, plus its own copy and CSS. Nothing else to know.

## What was deliberately rejected

- **Feature-module folders** (`src/features/*` with import boundaries): best
  marginal-page story, but the largest migration for a ~15-page single-team
  app — structure without a second consumer. Reconsider at ~2× the page
  count or a second maintainer team.
- **Strict headless dogma** (components never read stores, every behavior a
  composable): sharpest testability, but 5 primitives to learn per trivial
  page and prop-drilling ceremony a content SPA doesn't repay. We take its
  best machines (`useDraftValue`, per-concern gates) without the dogma.
