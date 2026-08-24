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
    playersLabel: "Players incorporados",
    playersCaption:
      "Reproduzir vídeos do Pornhub e do xHamster na própria página do vídeo",
    fullWidthLabel: "Layout em tela cheia",
    fullWidthCaption: "Usar a tela inteira em vez de uma coluna centralizada",
    backgroundLabel: "Plano de fundo animado",
    backgroundCaption:
      "Mostrar o gradiente suave em movimento atrás de cada página"
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

  orientationTitle: "Orientação",

  access: {
    title: "Acesso",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption:
      "Incluir vídeos cujo script está atrás do paywall de um parceiro",
    premiumVideosLabel: "Vídeos premium",
    premiumVideosCaption: "Incluir vídeos atrás do paywall de um parceiro"
  },

  previews: {
    title: "Prévias nos cards",
    hint:
      "Passe o mouse sobre um card — ou arraste o dedo por ele — para ver a " +
      "prévia. Clique no nome de um controle para restaurar aquela velocidade.",
    imageSpeed: "Velocidade da imagem",
    clipSpeed: "Velocidade do clipe"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Chave de conexão",
    placeholder: "ex.: a1B2c3D4e5",
    hint: "A chave de conexão do seu Handy, usada para baixar scripts."
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
    keyToast: "Chave de conexão apagada",

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
      "O IVDB cataloga vídeos adultos interativos com scripts para o Handy. " +
      "Confirme que você tem 18 anos ou mais para navegar com prévias " +
      "explícitas. Se continuar sem confirmar, as prévias ficam ocultas — dá " +
      "para mudar isso a qualquer momento nas configurações. Suas " +
      "preferências ficam salvas apenas neste navegador.",
    decline: "Continuar sem prévias",
    accept: "Tenho 18 anos ou mais"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Chave de conexão necessária",
    body:
      "Esta ação está vinculada ao seu Handy. Digite a chave de conexão do " +
      "app do Handy para continuar.",
    hint:
      "O Handy precisa estar ligado e online para a chave funcionar — um " +
      "aparelho offline falha exatamente como uma chave errada.",
    save: "Salvar e continuar"
  }
};

export default settings;
