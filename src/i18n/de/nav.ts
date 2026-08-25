import type enUS from "../en-US/nav";

// The app shell: header toolbar, main nav row, mobile drawer and the header's
// orientation switcher. Every link label here is rendered twice — once in the
// desktop nav, once in the drawer — from a single list.
const nav: typeof enUS = {
  // Landmark and icon-button labels a screen reader reads out. `homeAria`
  // names the logo link's destination; IVDB is a proper noun, not translated.
  menuAria: "Menü",
  homeAria: "IVDB-Startseite",
  mainNavAria: "Hauptmenü",
  settingsAria: "Einstellungen",

  backToTop: "Nach oben",

  links: {
    home: "Start",
    videos: "Videos",
    tags: "Schlagwörter",
    sites: "Websites",
    performers: "Darsteller",
    playlists: "Wiedergabelisten",
    requests: "Anfragen",
    favorites: "Favoriten",
    history: "Zuletzt gesehen",
    help: "Hilfe & Funktionen",
    privacy: "Datenschutz"
  },

  // The mute badge in the toolbar, as both tooltip and aria-label. Two
  // shapes: before anything is hidden it can only name the gate, after that
  // it leads with the cost — "1 tag muted" reads as trivia, the video figure
  // is the part that surprises you. `mutedTags` is not a duplicate of
  // `common.count.tags`: the adjective inflects with the noun in Norwegian
  // ("1 dempet tagg" / "2 dempede tagger"), so it has to plural together.
  // `{tags}` receives the whole muted-tag phrase, so word order stays with
  // the translator.
  //
  // German inflects that adjective too ("1 stummgeschaltetes Schlagwort"),
  // and the singular form is nominative — so `mutedHidden` sets `{tags}` off
  // after a dash instead of governing it with a preposition, which would
  // demand an accusative the app cannot produce.
  mutedTags:
    "{count} stummgeschaltetes Schlagwort | {count} stummgeschaltete Schlagwörter",
  mutedHidden:
    "{count} Video ausgeblendet — {tags} | {count} Videos ausgeblendet — {tags}",

  orientation: {
    aria: "Orientierung: {value}",
    header: "Zeig mir"
  }
};

export default nav;
