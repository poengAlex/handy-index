import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "Datenschutz & Nutzungsbedingungen",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "Dies ist eine Übersetzung. Weichen die beiden Fassungen voneinander ab, gilt die englische.",

  intro:
    "IVDB ist ein Katalog von Videos mit Handy-Skripten, gepflegt vom Handy-Team (Ohdoki AS). Diese Seite erklärt, was hier mit deinen Daten passiert — kurz gesagt: so wenig wie möglich.",

  what: {
    title: "Was diese Seite ist",
    body: "Die Seite listet Videos mit Skript und verlinkt auf die Skripte und auf die Partnerseiten, die die eigentlichen Inhalte hosten. Auf unseren Servern liegen keine Videos — nur die Skripte. Für Handy-Nutzer ist das Stöbern kostenlos.",
    apiBody:
      "Die Seite baut auf der öffentlichen API des Skriptindex auf — nutze sie gern für eigene Projekte: {apiDocs}. Die Seite selbst ist Open Source, für volle Transparenz: {repo}.",
    apiDocsLink: "API-Dokumentation",
    repoLink: "GitHub-Repository"
  },

  local: {
    title: "Was in diesem Browser bleibt",
    intro:
      "Es gibt keine Konten, keine Cookies und keine Analysewerkzeuge. Alles, was du einstellst, liegt nur im lokalen Speicher dieses Browsers:",
    item: {
      consent: "deine Antwort im Einwilligungsdialog beim ersten Besuch",
      previews: "die Einstellung für explizite Vorschaubilder (NSFW)",
      orientation: "der Orientierungsfilter",
      accessFilters: "deine Zugangsfilter für Skripte und Videos",
      favorites: "deine Favoriten",
      votes: "deine Stimmen zu Video-Anfragen",
      connectionKey: "dein Handy-Verbindungsschlüssel"
    },
    outro:
      "Öffne die Seite auf einem anderen Gerät — oder lösche deine Browserdaten — und all das ist weg; auf einem Server gibt es nichts wiederherzustellen. Die Kehrseite fehlender Analysewerkzeuge: Wir sehen Fehler nicht passieren, deshalb sind Fehlermeldungen besonders willkommen."
  },

  catalog: {
    title: "Woher der Katalog kommt",
    body: "Der Katalog, seine Metadaten und die Skripte werden von der Skriptindex-API auf handyfeeling.com geladen. Wenn du ein Skript herunterlädst, ein Video anfragst oder für eines abstimmst, geht dein Verbindungsschlüssel zur Autorisierung an diese API — nur dann verlässt etwas, das du eingegeben hast, deinen Browser."
  },

  thirdParty: {
    title: "Seiten Dritter",
    body: "Videoseiten verlinken auf die Partnerseiten, die die Videos hosten. Das sind Erwachsenenseiten Dritter mit eigenen Datenschutzerklärungen und eigener Analyse — sobald du IVDB verlässt, gelten deren Regeln. Sind explizite Vorschaubilder eingeschaltet, werden die Bilder direkt von den Partnerseiten geladen, dein Browser stellt also Anfragen, die deren Server protokollieren können. Wenn dich das stört, lass die Vorschaubilder aus oder nutze ein VPN."
  },

  age: {
    title: "Mindestalter",
    body: "Diese Seite indexiert Inhalte für Erwachsene und ist nur für Erwachsene. Du musst 18 Jahre oder älter sein — oder volljährig nach dem Recht an deinem Wohnort —, um sie zu nutzen."
  },

  choices: {
    title: "Deine Entscheidungen ändern",
    body: "Nichts, was du im Dialog beim ersten Besuch gewählt hast, ist endgültig. Explizite Vorschaubilder, Orientierung und die Zugangsfilter für Skripte und Videos lassen sich jederzeit im Einstellungsdialog in der Kopfzeile ändern."
  },

  contact: {
    title: "Kontakt",
    body: "Fragen, Fehlermeldungen oder Löschanfragen: {email}"
  }
};

export default privacy;
