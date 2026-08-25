import type enUS from "../en-US/nav";

const nav: typeof enUS = {
  menuAria: "Meny",
  homeAria: "IVDB-forsiden",
  mainNavAria: "Hovedmeny",
  settingsAria: "Innstillinger",

  backToTop: "Til toppen",

  links: {
    home: "Forsiden",
    videos: "Videoer",
    tags: "Tagger",
    sites: "Nettsteder",
    performers: "Skuespillere",
    playlists: "Spillelister",
    requests: "Forespørsler",
    favorites: "Favoritter",
    history: "Nylig sett",
    help: "Hjelp og funksjoner",
    privacy: "Personvern"
  },

  mutedTags: "{count} dempet tagg | {count} dempede tagger",
  mutedHidden:
    "{count} video er skjult av {tags} | {count} videoer er skjult av {tags}",

  orientation: {
    aria: "Orientering: {value}",
    header: "Vis meg"
  }
};

export default nav;
