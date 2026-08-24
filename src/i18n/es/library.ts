import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "Mis favoritos",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} en favoritos",
    emptyTitle: "Todavía no hay favoritos",
    emptyBody:
      "Toca el botón del corazón en cualquier página de vídeo y se guarda aquí para tenerlo a mano."
  },

  history: {
    title: "Vistos recientemente",
    note: "Solo se guarda en este navegador — tu historial no se rastrea ni se envía a ninguna parte.",
    emptyTitle: "Todavía no has visto nada",
    emptyBody:
      "Los vídeos que abres se recuerdan aquí, solo en este dispositivo.",
    clearTitle: "¿Borrar el historial?",
    clearBody:
      "Los vídeos siguen en el catálogo — solo desaparece la lista de lo que has abierto en este navegador.",
    clearConfirm: "Borrar el historial",
    clearedToast: "Historial borrado"
  }
};

export default library;
