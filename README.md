# IVDB

Interactive Video Database — a browser for Handy-scripted interactive videos,
built on the [handyfeeling.com Script Index API](https://scripts01.handyfeeling.com/api/script/index/v0/spec).

Quasar (Vite) + Vue 3 + TypeScript + Pinia. All UI follows the Handy design
system (`design.md` in the brand-ux project) and its component kit.

## Architecture

- `src/services/script-index/` — the data layer. `client.ts` is a minimal
  typed fetch client (index snapshot, single video, scripts, token).
  `queries.ts` holds pure selectors (sort/filter/rank) — every listing in the
  app composes these; the API itself cannot sort.
- `src/stores/catalog.ts` — loads the `/index` snapshot once per session and
  exposes `visible` (orientation + premium gate applied).
- `src/stores/settings.ts` — persisted preferences (consent, NSFW, premium,
  orientation, connection key, favorite ids).
- `src/components/handy/` — the Handy design-system kit, copied verbatim from
  the brand-ux project. Don't fork it; re-copy when the kit evolves.
- `src/components/` — app components (VideoCard, CarouselRow, dialogs).
- `src/pages/` — filename-based routing: `index.vue` is the shell (nav bar,
  consent + settings dialogs), `index/(index).vue` the Apple-TV-style
  homepage, `index/videos/[partnerVideoId].vue` the detail page.

## Develop

```bash
npm install
npm run dev
```

## Check & build

```bash
npm run lint
npm run typecheck
npm run build
```

## Serve a production build

```bash
npm run build
npm start   # express static server on :5000 (PORT overridable)
```
