import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "Hilfe",
  lead: "Alles, was diese Seite kann, an einem Ort. Zeilen mit Pfeil führen direkt hin.",

  finding: {
    title: "Videos finden",
    search: {
      label: "Suchen und filtern",
      caption:
        "Titel suchen und nach Tag, Website, Darsteller, VR und Dauer eingrenzen — jeder Filter steht in der URL, Ergebnisse lassen sich also teilen"
    },
    sort: {
      label: "Sortieren, wie du willst",
      caption:
        "Zuletzt hinzugefügt, bestbewertet, meistgespielt und mehr — der Pfeil-Button neben der Sortierung dreht die Richtung um"
    },
    tags: {
      label: "Tag-Wolke",
      caption:
        "Jeder Tag im Katalog außer den stummgeschalteten, durchsuchbar und sortierbar — ein Klick filtert die Videoübersicht"
    },
    performers: {
      label: "Darsteller",
      caption: "Nach Darstellern stöbern, größte Filmografie zuerst"
    },
    sites: {
      label: "Websites",
      caption: "Jede Partner-Website im Index mit ihrer Videoanzahl"
    }
  },

  library: {
    title: "Deine Bibliothek",
    favorites: {
      label: "Favoriten",
      caption:
        "Ein Herz auf ein Video, und es bleibt griffbereit — gespeichert auf diesem Gerät"
    },
    playlists: {
      label: "Wiedergabelisten",
      caption:
        "Wiedergabelisten aus beliebigen Videos anlegen, umbenennen und pflegen"
    },
    transfer: {
      label: "Wiedergabelisten teilen, importieren & exportieren",
      caption:
        "Eine Wiedergabeliste als Datei, als kopierbaren JSON-Text oder als temporären Teilen-Link weitergeben — und aus jedem davon importieren"
    },
    bulkDownload: {
      label: "Alle Skripte auf einmal holen",
      caption:
        "Ein Klick in einer Wiedergabeliste lädt jedes kostenlose Skript darin herunter"
    },
    quickMenu: {
      label: "Schnellmenü",
      caption:
        "Rechtsklick (oder langes Drücken) auf eine Videokachel: Favoriten, Wiedergabelisten, Link kopieren und mehr"
    }
  },

  scripts: {
    title: "Skripte & dein Handy",
    free: {
      label: "Kostenlose Skripte",
      caption:
        "Videos mit der Markierung „Kostenlos“ haben ein Skript, das du mit deinem Handy-Verbindungsschlüssel herunterladen kannst"
    },
    rate: {
      label: "Skripte bewerten",
      caption:
        "Jedes kostenlose Skript direkt auf der Videoseite mit Sternen bewerten"
    },
    comments: {
      label: "Skriptkommentare",
      caption: "Anonyme Kommentare zu Skripten lesen und schreiben"
    },
    requests: {
      label: "Videos anfragen",
      caption:
        "Für jedes Video ein Skript anfragen und mit abstimmen, was als Nächstes drankommt"
    }
  },

  personalize: {
    title: "Nach deinem Geschmack",
    previews: {
      label: "Explizite Vorschaubilder",
      caption: "Standardmäßig aus — Bilder in den Einstellungen einschalten"
    },
    players: {
      label: "Eingebettete Player",
      caption:
        "Standardmäßig aus — Videos von Pornhub und xHamster direkt auf der Videoseite ansehen (die Wiedergabe läuft nicht synchron mit dem Handy)"
    },
    filters: {
      label: "Filter für Orientierung, Skripte & Videos",
      caption:
        "Kostenlose oder Premium-Skripte, kostenlose oder Premium-Videos und wer mitspielt — in den Einstellungen oder direkt in den Filtern der Videoübersicht"
    },
    mutedTags: {
      label: "Stummgeschaltete Tags",
      caption:
        "Einen Tag stummschalten, und jedes Video damit fällt aus dem Katalog — Rechtsklick auf einen Tag oder die Liste in den Einstellungen verwalten"
    },
    theme: {
      label: "Helles & dunkles Design",
      caption: "Umschalten in der Kopfzeile — deine Wahl gilt überall"
    },
    share: {
      label: "Teilen",
      caption:
        "Jede Videoseite und jede gefilterte Ergebnisliste hat einen Link zum Teilen"
    }
  }
};

export default help;
