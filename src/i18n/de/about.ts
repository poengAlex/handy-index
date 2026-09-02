import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "Über IVDB",
  body: "IVDB ist ein Katalog von Videos, zu denen es Handy-Skripte gibt. Er wird vom Handy-Team bei Ohdoki AS gemacht und ist kostenlos.",
  beta: "Diese Version ist noch eine Beta. Manches ist unfertig, manches vermutlich kaputt — wenn dir etwas auffällt, hören wir gern davon.",

  version: "Version {version}",
  built: "Erstellt am {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "Was ist neu",
    lead: "Änderungen an der Seite, die neuesten zuerst.",
    englishOnly: "Diese Liste gibt es nur auf Englisch.",
    errorTitle: "Die Änderungen konnten nicht geladen werden",
    errorBody:
      "Die Liste wurde nicht geladen. Prüf deine Verbindung und versuch es noch einmal."
  }
};

export default about;
