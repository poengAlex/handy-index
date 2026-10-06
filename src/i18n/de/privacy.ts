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
    "IVDB ist ein Katalog von Videos mit scripts für The Handy, gepflegt vom Handy-Team (Ohdoki AS). Diese Seite erklärt, was hier mit deinen Daten passiert — kurz gesagt: so wenig wie möglich.",

  what: {
    title: "Was diese Seite ist",
    body: "Die Seite listet Videos mit script und verlinkt auf die scripts und auf die Partnerseiten, die die eigentlichen Inhalte hosten. Auf unseren Servern liegen keine Videos — nur die scripts. Für alle mit The Handy ist das Stöbern kostenlos.",
    apiBody:
      "Die Seite baut auf der öffentlichen API des Script-Index auf — nutze sie gern für eigene Projekte: {apiDocs}. Die Seite selbst ist Open Source, für volle Transparenz: {repo}.",
    apiDocsLink: "API-Dokumentation",
    repoLink: "GitHub-Repository"
  },

  local: {
    title: "Was in diesem Browser bleibt",
    intro:
      "Es gibt keine Konten und keine Cookies. Alles, was du einstellst, liegt nur im lokalen Speicher dieses Browsers:",
    item: {
      consent: "deine Antwort im Einwilligungsdialog beim ersten Besuch",
      previews: "die Einstellung für explizite Vorschaubilder (NSFW)",
      orientation: "der Orientierungsfilter",
      accessFilters: "deine Zugangsfilter für scripts und Videos",
      favorites: "deine Favoriten",
      votes: "deine Stimmen zu Video-Anfragen",
      connectionKey: "dein connection key für The Handy",
      statisticsId:
        "eine zufällige ID für die unten beschriebene anonyme Nutzungsstatistik"
    },
    outro:
      "Öffne die Seite auf einem anderen Gerät — oder lösche deine Browserdaten — und all das ist weg; auf einem Server gibt es nichts wiederherzustellen."
  },

  catalog: {
    title: "Woher der Katalog kommt",
    body: "Der Katalog, seine Metadaten und die scripts werden von der Script-Index-API auf handyfeeling.com geladen. Wenn du ein script herunterlädst, ein Video anfragst oder für eines abstimmst, geht dein connection key zur Autorisierung an diese API. Ist die Nutzungsstatistik an, geht er außerdem an die API von The Handy, um zu prüfen, ob dein Gerät online ist — siehe unten. Nur dann verlässt etwas, das du eingegeben hast, deinen Browser."
  },

  statistics: {
    title: "Anonyme Nutzungsstatistik",
    sent: "Um zu sehen, welche Funktionen genutzt werden und wo die Seite hakt, sendet IVDB eine anonyme Nutzungsstatistik an PostHog, einen Analysedienst, der sie auf Servern in der EU speichert. Gesendet wird: welche Seiten du öffnest, auch welches Video (über seine ID); was du mit den Schaltflächen der Seite tust — ein Video öffnen, ein script holen, einen Favoriten hinzufügen und Ähnliches; deine Einstellungen und deine Sprache; dein Browser und deine Geräteart; das Land, aus dem deine Verbindung kommt; und ein Fehlerbericht, wenn etwas schiefgeht.",
    never:
      "Nie gesendet werden: dein Orientierungsfilter, Namen von Schlagwörtern oder Darstellern, wonach du suchst, Videotitel, deine Kommentare und die Filter in der Webadresse. Dein Bildschirm wird nie aufgezeichnet, und deine IP-Adresse wird nicht gespeichert.",
    device:
      "Hast du einen connection key gespeichert und ist dein The Handy online, wird die Statistik mit einer ID verknüpft, die aus diesem Schlüssel gebildet wird — seinen ersten drei Zeichen und einem Hash des ganzen Schlüssels —, zusammen mit Modell und Firmware-Version des Geräts. So zählen wir Geräte statt Browser. Der Schlüssel selbst wird nie an PostHog gesendet.",
    choice:
      "Die Statistik ist standardmäßig an. Du kannst sie jederzeit in den Einstellungen ausschalten; die Seite sendet dann eine letzte Nachricht darüber und danach nichts mehr. Wenn du alle gespeicherten Daten löschst, beginnt außerdem eine neue zufällige ID."
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
    body: "Nichts, was du im Dialog beim ersten Besuch gewählt hast, ist endgültig. Explizite Vorschaubilder, Orientierung, die Zugangsfilter für scripts und Videos und die Nutzungsstatistik lassen sich jederzeit im Einstellungsdialog in der Kopfzeile ändern."
  },

  contact: {
    title: "Kontakt",
    body: "Fragen, Fehlermeldungen oder Löschanfragen: {email}"
  }
};

export default privacy;
