import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "Video nicht gefunden",
  missingBody:
    "Dieses Video steht nicht mehr im Index, oder der Link stimmt nicht.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "Video",
    player: "Videoplayer",
    site: "der Website",
    thisSite: "dieser Website"
  },

  hero: {
    premiumChip: "Premium-Script"
  },

  action: {
    getScript: "Script holen",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "Auf {site} ansehen",
    addFavorite: "Zu Favoriten hinzufügen",
    removeFavorite: "Aus Favoriten entfernen",
    addToPlaylist: "Zur Wiedergabeliste hinzufügen",
    report: "Video melden"
  },

  premiumNote:
    "Das script zu diesem Video ist Premium — es gehört zum Video auf der Partnerseite.",

  playerNote:
    "Der Player hier auf IVDB spielt nur das Video ab — mit The Handy wird nichts synchronisiert. Lade das script herunter und spiele es mit The Handy ab, damit die Bewegungen synchron laufen.",

  tag: {
    unmuteAria: "Stummschaltung aufheben: {tag}",
    mutedTitle: "„{tag}“ ist stummgeschaltet — zum Aufheben klicken",
    browse: "Nach diesem Schlagwort filtern",
    mute: "Dieses Schlagwort stummschalten"
  },

  details: {
    title: "Details",
    script: "Script",
    free: "Kostenlos",
    premium: "Premium",
    published: "Veröffentlicht",
    duration: "Dauer",
    format: "Format",
    // the non-VR case: an ordinary 2D video
    formatFlat: "2D",
    site: "Website",
    scriptBy: "Script von",
    rating: "Bewertung",
    ratingValue: "{percent} %",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent} % · {votes}",
    scriptPlays: "Script-Wiedergaben"
  },

  rate: {
    title: "Dieses script bewerten",
    community: "Community: {percent} %",
    thanks: "Danke für deine Script-Bewertung",
    errorTitle: "Bewertung konnte nicht gespeichert werden"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "Fotos",
    previewTitle: "Vorschau",
    previewBadge: "Vorschau",
    clipAria: "Vorschauclip in voller Größe abspielen",
    photoAria: "Foto {index} von {total} öffnen",
    stillAlt: "Standbild {number} aus {title}",
    previousPhoto: "Vorheriges Foto",
    nextPhoto: "Nächstes Foto",
    closeViewer: "Ansicht schließen",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Kommentare",
    gateHint: "Für Kommentare brauchst du deinen connection key.",
    gateAction: "Connection key hinzufügen",
    inputLabel: "Kommentar schreiben",
    submit: "Kommentieren",
    errorHint: "Kommentare konnten nicht geladen werden.",
    emptyHint: "Noch keine Kommentare — mach den Anfang.",
    postedTitle: "Kommentar abgeschickt",
    postedBody: "Er erscheint, sobald er geprüft ist.",
    postErrorTitle: "Kommentar konnte nicht gesendet werden"
  },

  more: {
    related: "Ähnliche Videos",
    fromPartner: "Mehr von {site}"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "Scripts sind an The Handy gebunden. Gib den connection key aus der Handy-App ein, um fortzufahren.",
    action:
      "Bewertungen und Kommentare sind an The Handy gebunden. Gib den connection key aus der Handy-App ein, um fortzufahren."
  },

  script: {
    readyTitle: "Script bereit",
    readyBody: "Der Download wurde in einem neuen Tab geöffnet.",
    errorTitle: "Script konnte nicht abgerufen werden",
    errorBody:
      "Entweder ist der connection key falsch, oder The Handy ist nicht online. Prüfe beides und versuche es erneut."
  },

  mute: {
    refusedTitle: "„{tag}“ lässt sich nicht stummschalten",
    refusedBody:
      "Orientierungs-Schlagwörter bestimmen, welchen Katalog du siehst — ändere das in den Einstellungen.",
    doneTitle: "„{tag}“ stummgeschaltet",
    doneBody:
      "Das Schlagwort steht jetzt in deiner Liste — du kannst die Stummschaltung jederzeit aufheben.",
    undoneTitle: "Stummschaltung für „{tag}“ aufgehoben"
  },

  share: {
    copiedTitle: "Link kopiert",
    errorTitle: "Link konnte nicht kopiert werden"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "Ich möchte ein Video melden",
    intro: "Ich möchte ein Video melden.",
    titleLine: "Titel: {title}",
    untitled: "(ohne Titel)",
    idLine: "Video-ID: {id}",
    siteLine: "Website: {site}",
    linkLine: "Link: {link}",
    reasonLine: "Grund für die Meldung:"
  }
};

export default video;
