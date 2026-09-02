// The About box and the changelog behind it, both opened from the help page,
// plus the three values in the help-page footer. `version`, `built` and
// `copyright` are one line of small print — keep each to the two or three
// words it is, and leave the numbers to the interpolations.
export default {
  title: "About IVDB",
  body: "IVDB is a catalog of videos that have Handy scripts. It's made by the Handy team at Ohdoki AS, and it's free to browse.",
  beta: "This version is still a beta. Some of it is unfinished and some of it is probably broken — if you find something, we'd like to hear about it.",

  version: "Version {version}",
  built: "Built {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "What's new",
    lead: "Changes to the site, newest first.",
    // The changelog is one English file rather than ten translations, and a
    // reader in another language should be told that before they start
    // reading, not left wondering.
    englishOnly: "This list is written in English only.",
    errorTitle: "Couldn't load the list of changes",
    errorBody: "The list didn't load. Check your connection and try again."
  }
};
