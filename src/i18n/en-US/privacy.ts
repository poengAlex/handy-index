// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
export default {
  title: "Privacy & terms",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "This is a translation. If the two versions disagree, the English version is the one that counts.",

  intro:
    "IVDB is a catalog of videos that have Handy scripts, maintained by the Handy team (Ohdoki AS). This page explains what the site does with your data — the short version: as little as possible.",

  what: {
    title: "What this site is",
    body: "The site lists scripted videos and links you to the scripts and to the partner sites that host the actual content. No videos are stored on our servers — only the scripts. Browsing is free for Handy users.",
    apiBody:
      "The site is built on the public script index API — feel free to use it for your own projects: {apiDocs}. The site itself is open source for full transparency: {repo}.",
    apiDocsLink: "API documentation",
    repoLink: "GitHub repository"
  },

  local: {
    title: "What stays in this browser",
    intro:
      "There are no accounts, no cookies, and no analytics. Everything you set is stored only in this browser's local storage:",
    item: {
      consent: "your answer to the first-visit consent dialog",
      previews: "the explicit previews (NSFW) setting",
      orientation: "the orientation filter",
      accessFilters: "your script and video access filters",
      favorites: "your favorites",
      votes: "votes you've cast on video requests",
      connectionKey: "your Handy connection key"
    },
    outro:
      "Open the site on another device — or clear your browser data — and these are gone; there is nothing to recover from a server. The flip side of having no analytics is that we can't see errors happen, so bug reports are extra welcome."
  },

  catalog: {
    title: "Where the catalog comes from",
    body: "The catalog, its metadata, and the scripts are loaded from the handyfeeling.com script index API. When you download a script, submit a video request, or vote on one, your connection key is sent to that API as authorization — that is the only time something you've entered leaves your browser."
  },

  thirdParty: {
    title: "Third-party sites",
    body: "Video pages link out to the partner sites that host the videos. Those are third-party adult sites with their own privacy policies and their own analytics — once you leave IVDB, their rules apply. When explicit previews are enabled, thumbnails load directly from the partner sites, so your browser makes requests their servers can log. If that concerns you, keep previews off or use a VPN."
  },

  age: {
    title: "Age requirement",
    body: "This site indexes adult content and is for adults only. You must be 18 or older — or the age of majority where you live — to use it."
  },

  choices: {
    title: "Changing your choices",
    body: "Nothing you chose in the first-visit dialog is final. Explicit previews, orientation, and the script and video access filters can be changed at any time from the settings dialog in the top bar."
  },

  contact: {
    title: "Contact",
    body: "Questions, bug reports, or takedown requests: {email}"
  }
};
