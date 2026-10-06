# What's new in IVDB

<!-- This is the changelog our visitors read, not a developer log. One line
     per change that someone can actually notice on screen, written in plain
     words. Newest release on top. Format: "## <version> — <date>", then
     "### <group>" headings and "- " lines. Keep it English-only. -->

## 2.9.3 — 6 October 2026

### Privacy

- Explicit previews now stay off until you have answered the first-visit
  question. Visitors who had them switched on in the old version of the site
  could see them behind that question before agreeing.

## 2.9.2 — 6 October 2026

### Help

- The help page now points to next.ivdb.io, where every change goes live as
  soon as it is ready, before it reaches ivdb.io. On next.ivdb.io itself it
  points back to the regular site.

## 2.9.1 — 6 October 2026

### Performers

- The Performers page can now be sorted by "Most played": the performers
  whose scripts people have played the most, counted across all their videos.
- While sorted that way, each card shows that play count instead of the
  rating.

## 2.9.0 — 6 October 2026

### Privacy

- IVDB now collects anonymous usage statistics, so we can see which features
  people use and fix what breaks: the pages you open, which buttons you use,
  your settings and language, your browser and type of device, the country
  you visit from, and an error report when something goes wrong.
- What you search for, your orientation filter, tag and performer names,
  video titles, your comments and the filters in the web address are never
  sent. Your screen is never recorded.
- If you've saved your connection key and your Handy is online, the
  statistics are linked to an ID made from the key, along with your Handy's
  model and firmware version. The key itself is never sent.
- The statistics are on by default. You can switch them off at any time in
  Settings, under Privacy.
- The Privacy & terms page explains all of this, in all ten languages.

## 2.8.5 — 6 October 2026

### Front page

- A note under the featured video on the front page, and under "About this
  site" in Help, says this is the new IVDB, and that the old version is
  still there at old.ivdb.io if you prefer it.

## 2.8.3 — 5 October 2026

### Performers

- Performers whose videos come without a picture, like Lana Rhoades, now get
  one on the Performers page too, taken from their own profile. It's the same
  picture their page above their videos already showed.
- Performers whose picture had stopped loading, like Alex Adams and Jax
  Slayher, show it again: the same picture, from a place that still has it.
- These pictures load after the rest of the page, so the page itself comes up
  as fast as before and they appear a moment later. Wide banner images are
  skipped, so a card never shows a squashed strip.

## 2.8.2 — 5 October 2026

### Requests

- Requests that come with pictures but no cover image now show their first
  picture on the voting board, instead of an empty grey tile.
- Hovering a request on the voting board now plays its short preview clip,
  the same way it does on a video.

## 2.8.1 — 5 October 2026

### Speed

- The site is ready much sooner on your first visit, about four times faster
  on a typical phone connection. It also needs about half as much memory
  while it loads, so older and cheaper phones should no longer reload the
  page or give up partway through.
- Opening the site again later is quicker too, and the page freezes less
  while it gets ready.
- Icons show up straight away instead of staying blank while they load.
- Going back to the front page is faster. Shelves further down the page are
  drawn as you scroll towards them.
- On a video's page, the description can appear a moment after the rest of
  the page.

## 2.8.0 — 5 October 2026

### Performers

- Opening a performer now shows who they are above their videos: their
  picture, how many of their videos are here and how often their scripts have
  been played, links to their own pages (Instagram, X, OnlyFans and so on),
  their bio, and a profile with their birthday, age, where they're from,
  height, weight, measurements and more.
- Heights and weights are all written the same way, whatever the performer's
  page had. In English you get feet and inches or pounds with the metric
  figure next to it; in every other language, centimetres and kilograms.
- Ages are worked out from the birthday, so they are right today rather than
  whatever they were when the profile was written.
- Many performers have only a little profile information, and some have none.
  Their page shows what there is.

## 2.7.1 — 5 October 2026

### Finding videos

- Straight, Gay and Trans now go only by the orientation each video is
  tagged with, not by words that turn up inside its other tags. A few trans
  videos that also showed under Gay, because of tags like "black gays", now
  show under Trans only.

## 2.7.0 — 5 October 2026

### Front page

- Under the featured video, a short line now says how many scripts the
  database holds and how many were added last month — for example "877 added
  in September". Both numbers count the whole database, so they stay the same
  whatever filters you have on.
- "Added last month" counts the day each video was published, so the number
  is final as soon as the month is over and doesn't creep up afterwards.

## 2.6.3 — 5 October 2026

### Finding videos

- "Recently added" and the date filter now go by the day a video was
  published, the same date its page shows. They were going by the day work on
  the video started, which is usually about a month earlier, so "Past week"
  showed almost nothing. It now shows the 200 or so videos that actually came
  out this week.
- The date filter is now called "Published", to match.

## 2.6.2 — 4 October 2026

### Finding videos

- The Trans filter now looks for the word "trans" itself, not just those
  letters inside a tag. Words like "transformation", "transparent",
  "translated" and "public transport" were enough to file a video under Trans
  and hide it from Straight. Those videos are back where they belong.

## 2.6.1 — 16 September 2026

### Script speed and the activity strip

- Fixed how script measurements are read. When a script keeps up the same
  amount of movement for a stretch, the data says so in shorthand, and we were
  reading that shorthand as a pause instead. Roughly one video in seven was
  affected: its speed came out too high — usually by about 7%, in the worst
  cases by nearly 80% — and the activity strip drew a flat, resting stretch
  over a part of the video where the script was still going.
- Speeds, the moving percentage, the longest pause and the strip itself are
  all right now, on every video. The speed filter and the "Fastest" sort read
  the same corrected numbers, so some videos will sit a little lower than they
  did yesterday. That is the fix, not a change of scale.

## 2.6.0 — 16 September 2026

### Video pages

- The person who made the script now gets their own line under the activity
  strip, with a count of everything else they have scripted. It used to be one
  small row in the details card, easy to read past.
- That line is a link: open it to see every video scripted by the same person.

## 2.5.0 — 15 September 2026

### Finding videos

- Filter by script speed. The slider picks a range in strokes per minute, and
  there is a "Fastest" sort to go with it. Most scripts sit between 80 and 110.
- A small number of videos have never had their script measured. They are
  listed plainly rather than quietly dropped, and only disappear while the
  speed filter is actually narrowed.
- The "Added" filter now uses the date a video really arrived. It used to read
  a date the index stamps in batches, so "past week" was handing back videos
  that were closer to three weeks old. Expect the counts to be smaller now —
  that is the fix, not a loss.
- "Recently added" rows are ordered by that same real date, so a batch of a
  thousand videos no longer lands in arbitrary order.
- The filters panel is grouped into sections — Content, Video, Script and
  Added — and on a wide screen it opens as two columns instead of one long
  scroll. The three settings that apply everywhere (orientation, paywalls,
  muted tags) now sit in their own column, which says plainly that Clear
  filters does not touch them.

### Video pages

- Speed now says "while moving" under the label, because that is what it
  measures: the pauses are already taken out. The same figure now comes from
  the same place the filters read, so a video can never show one speed and be
  filtered as another.

## 2.4.0 — 10 September 2026

### Video pages

- The details card now shows peak speed, the total number of strokes and the
  longest pause in the script. These come out of the same measurements the
  activity strip already uses, so nothing extra is downloaded for them.
- Videos now show their view count.
- Opening a video straight from a link used to leave out the rating, the vote
  count, the views and who made the script, because the single-video lookup
  does not return any of them. Those now fill themselves in as soon as the
  catalog is ready.

### Browsing

- New filter: script maker. Pick one of the people who script for the site and
  see only their videos.
- New filter: published in the past week, month or year.
- New filter: only videos that come with a short preview clip.
- All three ride in the address bar like the rest, so a filtered list stays
  shareable.

## 2.3.0 — 10 September 2026

### Loading

- The catalog is now kept on your device after the first visit, so opening
  IVDB in a new tab, or coming back later in the day, shows the videos
  straight away instead of downloading the whole catalog again.
- A stored catalog older than an hour is still shown immediately, and a fresh
  copy is fetched quietly in the background. Once it is more than a day old it
  is downloaded properly again, so you are never browsing stale rankings.
- Settings now shows when the stored catalog was downloaded, with an "Update
  now" button next to it, for when you know something has been added and do
  not want to wait for the automatic refresh.

## 2.2.0 — 8 September 2026

### Video pages

- Every video now shows how fast its script strokes, in strokes per minute,
  and how much of the runtime is actually moving rather than resting. A slow
  script can be busy the whole way through and a fast one can be mostly
  pauses, so both numbers are given instead of one average.
- New activity strip on the video page: a bar per moment of the video showing
  where the busy and the quiet stretches fall. Hover or drag along it to read
  the time and the speed at that point.
- Videos added in the last few weeks have not been measured yet and say so
  instead of showing a blank chart.

## 2.1.0 — 2 September 2026

### Help

- The Help page can now tell you about the site itself: what IVDB is, who
  makes it, and which version you are looking at.
- Added this list of changes, so you can see what has been fixed or added
  since you were last here.
- The privacy statement can now be read straight from Help, without leaving
  the page you were on.

### Browsing

- Sites and performers now follow the orientation filter like the rest of the
  site. If that leaves nothing to show, the page tells you which filter is
  doing it and offers to switch it off.

## 2.0.0 — 1 September 2026

The site was rebuilt from the ground up. The catalog is the same one as
before — everything below is what changed around it.

### A new front page

- A proper front page with rows to browse instead of a search box and a
  banner: newly added, top rated, most played, VR, your favorites, recently
  viewed, and rows built from tags you seem to like.
- Rows with too little in them hide themselves rather than sitting empty.
- A menu bar along the top with videos, tags, sites, performers, playlists
  and requests, plus quick ways into your favorites and your history.
- A light theme as well as the dark one, switchable from the top bar.
- An option to use the full width of your screen.
- Pages that fail now say so and offer to try again, instead of spinning
  forever.

### Finding videos

- Everything you filter by is kept in the address, so a result list is a link
  you can send to someone and they see exactly what you saw.
- A share button on the result page copies that link for you.
- More ways to sort: newest, recently updated, top rated, most played, most
  viewed, longest and A to Z, each of which can be flipped around.
- Filter by tag, site, performer, VR, and now also by how long the video is.
- Active filters show up as chips you can remove one by one.
- Results keep loading as you scroll instead of making you click through
  pages of 36.
- The result count now tells you when videos are being hidden by your own
  settings, and by which of them.
- Picking a site or a performer no longer lands you on an empty page.

### Your library

- Favorites have their own page, and they are never hidden by your filters.
- Playlists work now. Create, rename and delete them, add videos from the
  video page or straight from a thumbnail, and remove them again in an edit
  mode.
- A playlist can be saved to a file, copied as text, or shared as a link that
  lasts about three months — and imported back from any of those.
- One click downloads every free script in a playlist.
- Recently viewed videos are kept, on the front page and on a page of their
  own, and can be cleared whenever you like.

### Video pages

- A full page for each video, with the details that were missing: whether the
  script is free, when it was published, how long it is, what site it is
  from, who scripted it, its rating and how many times the script has been
  played.
- Getting the script now downloads a proper file named after the video.
- Pictures from the video open in a full-size viewer you can page through.
- You can read and post comments on a script.
- You can rate a script, and your own rating is remembered next to the
  community's.
- Performers are shown with pictures and link to their own page, and tags
  link into the catalog. Right-click a tag to browse it or mute it.
- Suggestions for what to watch next, based on shared tags, plus more from
  the same site.
- Videos from Pornhub and xHamster can be played on the page itself if you
  turn that on in settings. It does not sync with your Handy, and the page
  says so.

### A menu on every thumbnail

- Right-click, or press and hold on a phone, to open a video, add or remove
  a favorite, put it in a playlist, download the script, copy the link, or
  jump to the site it came from.

### Muted tags

- Mute a tag and every video with it disappears from the whole site.
- Before you mute, you are told how much of the catalog it will hide.
- Favorites and playlists are left alone, so nothing you saved disappears.
- A mark in the top bar reminds you that some things are being hidden.

### Settings

- Scripts behind a paywall and videos behind a paywall are now two separate
  switches, because they are two different things.
- The orientation switch moved to the top bar, and shows which one is on.
- Explicit pictures are still off until you turn them on, and you are asked
  about your age the first time you visit.
- You can now clear one thing at a time — history, favorites, playlists,
  muted tags, ratings, your connection key or your settings — instead of
  wiping everything at once.
- A real help page listing everything the site can do.

### Requests

- The voting board is also the queue now: every request shows its real place
  in line, and that number stays put when you sort or filter.
- The whole board loads at once, so searching and filtering covers all of it.
- Sort by votes, newest, longest or A to Z, filter by tag, and hide the ones
  you have already voted for.
- Links are checked before you send a request, and a rejected connection key
  now says that it was rejected.

### Tags, performers and sites

- The tag list holds every tag, searchable and sortable, instead of stopping
  at 300.
- Performers have a proper directory with pictures, video counts and average
  rating, searchable and sortable.
- Sites show how many videos each one has, and say so when your filters are
  narrowing the list.

### Speed

- The catalog is fetched once when you arrive, with a progress bar, and then
  everything is instant.
- Thumbnails that are broken at the source are remembered, so you stop seeing
  grey squares.
- Links to IVDB now show a picture and a title when shared.

### Languages

- The site is fully translated into ten languages: English, Norsk, Português,
  Español, Deutsch, Français, 日本語, 한국어, Русский and 简体中文.
- It picks your language from your browser, and you can override it in
  settings.
- Numbers and dates are written the way your language writes them.
- Only the language you read is downloaded.
- The privacy statement is translated too, with a note that the English text
  is the one that counts.

### Privacy

- Favorites, playlists, history, ratings and your connection key stay in your
  browser. We do not have them.
- The site asks other sites not to be told where you came from.

### Gone

- The browser extension is no longer needed for anything.
- The old table view, the paged performer list and the "coming soon" note on
  playlists.
