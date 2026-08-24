import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "Einstellungen",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "Dunkelmodus",
    darkModeCaption: "Das dunkle Farbschema verwenden",
    nsfwLabel: "Explizite Vorschaubilder",
    nsfwCaption: "Echte Bilder statt neutraler Kacheln zeigen",
    playersLabel: "Eingebettete Player",
    playersCaption:
      "Pornhub- und xHamster-Videos direkt auf der Videoseite abspielen",
    fullWidthLabel: "Volle Breite",
    fullWidthCaption:
      "Den ganzen Bildschirm nutzen statt einer zentrierten Spalte",
    backgroundLabel: "Animierter Hintergrund",
    backgroundCaption:
      "Den sanften, bewegten Farbverlauf hinter jeder Seite anzeigen"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "Stummgeschaltete Tags",
    caption: "{count} Tag stummgeschaltet | {count} Tags stummgeschaltet",
    empty: "Nichts stummgeschaltet"
  },

  orientationTitle: "Orientierung",

  access: {
    title: "Zugang",
    premiumScriptsLabel: "Premium-Skripte",
    premiumScriptsCaption:
      "Auch Videos zeigen, deren Skript hinter der Bezahlschranke eines Partners liegt",
    premiumVideosLabel: "Premium-Videos",
    premiumVideosCaption:
      "Auch Videos hinter der Bezahlschranke eines Partners zeigen"
  },

  previews: {
    title: "Kartenvorschau",
    hint:
      "Fahre mit der Maus über eine Karte — oder wische mit dem Finger " +
      "darüber —, um sie in der Vorschau zu sehen. Klicke auf eine " +
      "Beschriftung, um dieses Tempo zurückzusetzen.",
    imageSpeed: "Bildtempo",
    clipSpeed: "Cliptempo"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Verbindungsschlüssel",
    placeholder: "z. B. a1B2c3D4e5",
    hint: "Dein Handy-Verbindungsschlüssel, nötig beim Herunterladen von Skripten."
  },

  clearDataAction: "Daten löschen…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Gespeicherte Daten löschen",
    lead:
      "Alles, was sich diese Seite merkt, liegt in diesem Browser. Lösche " +
      "einzelne Teile oder alles auf einmal.",
    clearAll: "Alle Daten löschen",
    allToast: "Alle lokalen Daten gelöscht",

    recentLabel: "Zuletzt gesehen",
    recentToast: "Verlauf gelöscht",
    favoritesLabel: "Favoriten",
    favoritesToast: "Favoriten gelöscht",
    playlistsLabel: "Wiedergabelisten",
    playlistsToast: "Wiedergabelisten gelöscht",
    mutedToast: "Stummgeschaltete Tags gelöscht",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "Bewertungen & Stimmen",
    votesEmpty: "Nichts gespeichert",
    votesToast: "Bewertungen und Stimmen gelöscht",
    ratingCount: "{count} Skriptbewertung | {count} Skriptbewertungen",
    requestVoteCount:
      "{count} Stimme für Anfragen | {count} Stimmen für Anfragen",

    keySaved: "Auf diesem Gerät gespeichert",
    keyUnset: "Nicht gesetzt",
    keyToast: "Verbindungsschlüssel gelöscht",

    preferencesLabel: "Anzeigeeinstellungen",
    preferencesCaption:
      "Explizite Vorschaubilder, Orientierung, Zugangsfilter, " +
      "Vorschautempo, Hintergrund",
    preferencesToast: "Anzeigeeinstellungen zurückgesetzt"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Bevor du loslegst",
    body:
      "IVDB katalogisiert interaktive Videos für Erwachsene mit Skripten " +
      "für The Handy. Bestätige, dass du 18 Jahre oder älter bist, um den " +
      "Katalog mit expliziten Vorschaubildern zu durchstöbern. Fährst du " +
      "ohne Bestätigung fort, bleiben die Vorschaubilder ausgeblendet — " +
      "du kannst das jederzeit in den Einstellungen ändern. Deine " +
      "Einstellungen werden nur in diesem Browser gespeichert.",
    decline: "Ohne Vorschaubilder fortfahren",
    accept: "Ich bin 18 oder älter"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Verbindungsschlüssel nötig",
    body:
      "Diese Aktion ist an dein Handy gebunden. Gib den " +
      "Verbindungsschlüssel aus der Handy-App ein, um fortzufahren.",
    hint:
      "Dein Handy muss eingeschaltet und online sein, damit der Schlüssel " +
      "funktioniert — ein Gerät ohne Verbindung scheitert genauso wie ein " +
      "falscher Schlüssel.",
    save: "Speichern und fortfahren"
  }
};

export default settings;
