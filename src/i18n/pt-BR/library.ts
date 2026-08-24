import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "Meus favoritos",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} na lista",
    emptyTitle: "Nenhum favorito ainda",
    emptyBody:
      "Toque no coração em qualquer página de vídeo e ele fica salvo aqui para acesso rápido."
  },

  history: {
    title: "Vistos recentemente",
    note: "Fica salvo só neste navegador — seu histórico nunca é rastreado nem enviado para lugar nenhum.",
    emptyTitle: "Nada visto ainda",
    emptyBody:
      "Os vídeos que você abre ficam registrados aqui, só neste dispositivo.",
    clearTitle: "Limpar vistos recentemente?",
    clearBody:
      "Os vídeos continuam no catálogo — some só a lista do que você abriu neste navegador.",
    clearConfirm: "Limpar histórico",
    clearedToast: "Histórico limpo"
  }
};

export default library;
