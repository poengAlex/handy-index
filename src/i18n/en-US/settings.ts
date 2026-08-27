// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
export default {
  title: "Settings",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "Dark mode",
    darkModeCaption: "Use the dark color theme",
    nsfwLabel: "Explicit previews",
    nsfwCaption: "Show real artwork instead of neutral tiles",
    playersLabel: "Embedded players",
    playersCaption: "Play Pornhub and xHamster videos right on the video page",
    fullWidthLabel: "Full-width layout",
    fullWidthCaption: "Use the whole screen instead of a centered column"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "Muted tags",
    caption: "{count} tag muted | {count} tags muted",
    empty: "Nothing muted"
  },

  backgroundSceneTitle: "Background style",
  backgroundSceneOff: "Off",
  backgroundMotionLabel: "Motion",
  backgroundMotionCaption:
    "Let the background drift, and surge briefly when you change page",

  // What the scroll does to the background. Described rather than named —
  // the component calls these pinned/parallax/travels/banded, which is the
  // right vocabulary for the prop and the wrong one for a settings row.
  backgroundScroll: {
    title: "Background scroll",
    pinned: "Stays put",
    parallax: "Drifts slower than the page",
    travels: "Moves with the page",
    banded: "Only at the top of the page"
  },
  orientationTitle: "Orientation",

  access: {
    title: "Access",
    premiumScriptsLabel: "Premium scripts",
    premiumScriptsCaption:
      "Include videos whose script is behind a partner's paywall",
    premiumVideosLabel: "Premium videos",
    premiumVideosCaption: "Include videos behind a partner's paywall"
  },

  previews: {
    title: "Card previews",
    hint:
      "Hover a card — or touch one — to preview it. Click a label to put " +
      "that speed back.",
    imageSpeed: "Image speed",
    clipSpeed: "Clip speed"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Connection key",
    placeholder: "e.g. a1B2c3D4e5",
    hint: "Your Handy connection key, used when downloading scripts."
  },

  clearDataAction: "Clear data…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Clear stored data",
    lead:
      "Everything this site remembers lives in this browser. Clear pieces " +
      "one by one, or wipe everything at once.",
    clearAll: "Clear all data",
    allToast: "All local data cleared",

    recentLabel: "Recently viewed",
    recentToast: "Recently viewed cleared",
    favoritesLabel: "Favorites",
    favoritesToast: "Favorites cleared",
    playlistsLabel: "Playlists",
    playlistsToast: "Playlists cleared",
    mutedToast: "Muted tags cleared",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "Ratings & votes",
    votesEmpty: "Nothing recorded",
    votesToast: "Ratings and votes cleared",
    ratingCount: "{count} script rating | {count} script ratings",
    requestVoteCount: "{count} request vote | {count} request votes",

    keySaved: "Saved on this device",
    keyUnset: "Not set",
    keyToast: "Connection key cleared",

    preferencesLabel: "Viewing preferences",
    preferencesCaption:
      "Explicit previews, orientation, access filters, preview speeds, " +
      "background",
    preferencesToast: "Viewing preferences reset"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Before you browse",
    body:
      "IVDB catalogs interactive adult videos with scripts for The Handy. " +
      "Confirm you are 18 or older to browse with explicit previews. " +
      "Continue without confirming and previews stay hidden — you can " +
      "change this any time in settings. Your preferences are stored only " +
      "in this browser.",
    decline: "Continue without previews",
    accept: "I'm 18 or older"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Connection key needed",
    body:
      "This action is bound to your Handy. Enter the connection key from " +
      "the Handy app to continue.",
    hint:
      "Your Handy has to be switched on and online for the key to work — " +
      "an offline device fails in exactly the same way a wrong key does.",
    save: "Save and continue"
  }
};
