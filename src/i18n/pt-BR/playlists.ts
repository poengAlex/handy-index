import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "Playlists",

  // the create row on the overview page and inside the add dialog
  newLabel: "Nova playlist",
  newPlaceholder: "ex.: Seleção de fim de semana",
  nameLabel: "Nome da playlist",
  importHint: "Importe uma playlist exportada deste site",

  emptyTitle: "Nenhuma playlist ainda",
  emptyBody:
    "Crie uma aqui mesmo, ou use o botão de playlist na página de qualquer vídeo para começar uma a partir de um vídeo que você gostou.",

  import: {
    title: "Importar playlist",
    placeholder:
      "Cole uma exportação de playlist (JSON) ou um link do pastes.dev",
    inputAria: "Texto de exportação da playlist ou link de compartilhamento",
    chooseFile: "Escolher arquivo…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Playlist importada",
    doneTitle: "Playlist importada",
    doneBody: "“{name}” — {count} vídeo. | “{name}” — {count} vídeos.",
    failedTitle: "Não foi possível importar",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "Não foi possível acessar o serviço de paste.",
      linkDead:
        "Esse link de compartilhamento não responde — pode ter expirado.",
      notJson: "Esse arquivo não é um JSON válido.",
      notExport: "Esse arquivo não é uma exportação de playlist.",
      tooNew:
        "Esse arquivo foi exportado por uma versão mais nova deste site. Recarregue a página e tente de novo.",
      malformed: "A playlist desse arquivo está malformada.",
      unknown: "Algo deu errado ao ler a exportação."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Playlist não encontrada",
    notFoundBody: "Esta playlist não existe mais, ou o link está errado.",
    notFoundAction: "Todas as playlists",
    emptyTitle: "Nada por aqui ainda",
    emptyBody:
      "Use o botão de playlist na página de qualquer vídeo para adicionar vídeos aqui.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Editar",
    removeVideo: "Remover da playlist",
    renameTitle: "Renomear playlist",
    deleteTitle: "Excluir “{name}”?",
    deleteBody: "Os vídeos continuam no catálogo — só a playlist desaparece.",
    deleteConfirm: "Excluir playlist",
    deletedTitle: "Playlist excluída",
    deletedBody: "“{name}” não existe mais."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Compartilhar playlist",
    open: "Compartilhar playlist",
    openHint: "Compartilhar ou exportar esta playlist",
    exportAria: "JSON de exportação da playlist",
    linkAria: "Link de compartilhamento",
    copyLink: "Copiar link de compartilhamento",
    note: "Qualquer pessoa com o link pode importar esta playlist. O paste é temporário — expira em cerca de 90 dias.",
    copyJson: "Copiar JSON",
    saveFile: "Salvar arquivo",
    createLink: "Criar link de compartilhamento",
    newLink: "Novo link de compartilhamento",
    jsonCopied: "JSON copiado",
    jsonCopyFailed: "Não foi possível copiar o JSON",
    linkCopied: "Link de compartilhamento copiado",
    linkCopiedBody: "Qualquer pessoa com o link pode importar esta playlist.",
    linkCopyFailed: "Não foi possível copiar o link",
    linkCreated: "Link de compartilhamento criado",
    linkFailedTitle: "Não foi possível criar o link de compartilhamento",
    linkFailedBody:
      "O serviço de paste não respondeu. Copie o JSON em vez disso."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Baixar todos os scripts ({count})",
    progress: "Baixando {done}/{total}…",
    keyPrompt:
      "Os scripts estão vinculados ao seu Handy. Digite a chave de conexão do app do Handy para continuar.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Não foi possível baixar os scripts",
    doneTitle: "Scripts baixados",
    doneBody: "{count} script salvo. | {count} scripts salvos.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "{saved} com sucesso, {failed} com falha."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "Adicionar a uma playlist",
    empty: "Nenhuma playlist ainda — crie a primeira abaixo."
  }
};

export default playlists;
