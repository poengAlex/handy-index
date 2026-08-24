import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "Meine Favoriten",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} gespeichert",
    emptyTitle: "Noch keine Favoriten",
    emptyBody:
      "Tippe auf einer Videoseite auf das Herz, dann liegt das Video hier griffbereit."
  },

  history: {
    title: "Zuletzt gesehen",
    note: "Nur in diesem Browser gespeichert — dein Verlauf wird nirgendwo erfasst und nirgendwohin gesendet.",
    emptyTitle: "Noch nichts gesehen",
    emptyBody:
      "Videos, die du öffnest, werden hier gemerkt — nur auf diesem Gerät.",
    clearTitle: "Verlauf löschen?",
    clearBody:
      "Die Videos bleiben im Katalog — nur die Liste dessen, was du geöffnet hast, verschwindet aus diesem Browser.",
    clearConfirm: "Verlauf löschen",
    clearedToast: "Verlauf gelöscht"
  }
};

export default library;
