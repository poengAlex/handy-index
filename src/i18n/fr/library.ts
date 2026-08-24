import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "Mes favoris",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} dans tes favoris",
    emptyTitle: "Aucun favori pour l'instant",
    emptyBody:
      "Appuie sur le cœur d'une page vidéo et la vidéo est enregistrée ici, à portée de main."
  },

  history: {
    title: "Vues récemment",
    note: "Conservé uniquement dans ce navigateur — ton historique n'est jamais suivi ni envoyé où que ce soit.",
    emptyTitle: "Aucune vidéo vue pour l'instant",
    emptyBody:
      "Les vidéos que tu ouvres sont retenues ici, sur cet appareil uniquement.",
    clearTitle: "Effacer l'historique ?",
    clearBody:
      "Les vidéos restent dans le catalogue — seule la liste de ce que tu as ouvert dans ce navigateur disparaît.",
    clearConfirm: "Effacer l'historique",
    clearedToast: "Historique effacé"
  }
};

export default library;
