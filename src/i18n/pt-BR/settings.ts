import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "Configurações",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "Modo escuro",
    darkModeCaption: "Usar o tema de cores escuro",
    nsfwLabel: "Prévias explícitas",
    nsfwCaption: "Mostrar as imagens reais em vez de blocos neutros",
    playersLabel: "Reprodutores incorporados",
    playersCaption:
      "Reproduzir vídeos do Pornhub e do xHamster na própria página do vídeo",
    fullWidthLabel: "Página em largura total",
    fullWidthCaption: "Usar a tela inteira em vez de uma coluna centralizada"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "Tags silenciadas",
    caption: "{count} tag silenciada | {count} tags silenciadas",
    empty: "Nada silenciado"
  },

  backgroundSceneTitle: "Estilo do plano de fundo",
  backgroundSceneOff: "Desligado",
  backgroundMotionLabel: "Movimento",
  backgroundMotionCaption:
    "Deixar o plano de fundo se mover, com um impulso rápido ao mudar de página",

  backgroundScroll: {
    title: "Plano de fundo ao rolar",
    pinned: "Fica parado",
    parallax: "Move mais devagar que a página",
    travels: "Move junto com a página",
    banded: "Só no topo da página"
  },
  orientationTitle: "Orientação",

  access: {
    title: "Acesso",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption:
      "Incluir vídeos cujo script fica na área paga de um parceiro",
    premiumVideosLabel: "Vídeos premium",
    premiumVideosCaption: "Incluir vídeos que ficam na área paga de um parceiro"
  },

  previews: {
    title: "Prévias nas miniaturas",
    hint:
      "Passe o mouse sobre uma miniatura — ou toque nela com o dedo — para " +
      "ver a prévia. Clique no nome de um controle para restaurar aquela " +
      "velocidade.",
    imageSpeed: "Velocidade da imagem",
    clipSpeed: "Velocidade do clipe"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Connection key",
    placeholder: "ex.: a1B2c3D4e5",
    hint: "A connection key do seu Handy, usada para baixar scripts."
  },

  clearDataAction: "Limpar dados…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Limpar dados salvos",
    lead:
      "Tudo o que este site guarda fica neste navegador. Limpe item por " +
      "item ou apague tudo de uma vez.",
    clearAll: "Limpar todos os dados",
    allToast: "Todos os dados locais apagados",

    recentLabel: "Vistos recentemente",
    recentToast: "Histórico limpo",
    favoritesLabel: "Favoritos",
    favoritesToast: "Favoritos apagados",
    playlistsLabel: "Playlists",
    playlistsToast: "Playlists apagadas",
    mutedToast: "Lista de tags silenciadas apagada",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "Avaliações e votos",
    votesEmpty: "Nada registrado",
    votesToast: "Avaliações e votos apagados",
    ratingCount: "{count} avaliação de script | {count} avaliações de script",
    requestVoteCount: "{count} voto em pedido | {count} votos em pedidos",

    keySaved: "Salva neste dispositivo",
    keyUnset: "Não definida",
    keyToast: "Connection key apagada",

    preferencesLabel: "Preferências de exibição",
    preferencesCaption:
      "Prévias explícitas, orientação, filtros de acesso, velocidade das " +
      "prévias, plano de fundo",
    preferencesToast: "Preferências de exibição redefinidas"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Antes de começar",
    body:
      "O IVDB cataloga vídeos adultos interativos com scripts para The Handy. " +
      "Confirme que você tem 18 anos ou mais para navegar com prévias " +
      "explícitas. Se continuar sem confirmar, as prévias ficam ocultas — dá " +
      "para mudar isso a qualquer momento nas configurações. Suas " +
      "preferências ficam salvas apenas neste navegador.",
    decline: "Continuar sem prévias",
    accept: "Tenho 18 anos ou mais"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Connection key necessária",
    body:
      "Esta ação está vinculada ao seu Handy. Digite a connection key do " +
      "app do Handy para continuar.",
    hint:
      "O Handy precisa estar ligado e online para a chave funcionar — um " +
      "aparelho offline falha exatamente como uma chave errada.",
    save: "Salvar e continuar"
  }
};

export default settings;
