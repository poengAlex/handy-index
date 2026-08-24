import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "Ajuda",
  lead: "Tudo o que este site faz, em um só lugar. As linhas com seta levam direto até lá.",

  finding: {
    title: "Encontrar vídeos",
    search: {
      label: "Buscar e filtrar",
      caption:
        "Busque por título e depois refine por tag, site, artista, VR e duração — todo filtro fica na URL, então os resultados dão para compartilhar"
    },
    sort: {
      label: "Ordenar do jeito que quiser",
      caption:
        "Adicionados recentemente, mais bem avaliados, mais reproduzidos e mais — o botão de seta ao lado da ordenação inverte a direção"
    },
    tags: {
      label: "Nuvem de tags",
      caption:
        "Todas as tags do catálogo, menos as que você silenciou, com busca e ordenação — um clique filtra a página de vídeos"
    },
    performers: {
      label: "Artistas",
      caption: "Explore por artista, quem tem mais vídeos primeiro"
    },
    sites: {
      label: "Sites",
      caption: "Todos os sites parceiros do índice com a contagem de vídeos"
    }
  },

  library: {
    title: "Sua biblioteca",
    favorites: {
      label: "Favoritos",
      caption:
        "Marque qualquer vídeo com o coração para deixá-lo à mão — guardado neste dispositivo"
    },
    playlists: {
      label: "Playlists",
      caption: "Crie, renomeie e organize playlists com qualquer vídeo"
    },
    transfer: {
      label: "Compartilhar, importar e exportar playlists",
      caption:
        "Leve uma playlist como arquivo, como texto JSON para copiar, ou como link temporário de compartilhamento — e importe a partir de qualquer um deles"
    },
    bulkDownload: {
      label: "Baixar todos os scripts de uma vez",
      caption: "Um clique em uma playlist baixa todos os scripts grátis dela"
    },
    quickMenu: {
      label: "Menu rápido",
      caption:
        "Clique com o botão direito (ou toque e segure) em qualquer miniatura de vídeo para favoritos, playlists, copiar link e mais"
    }
  },

  scripts: {
    title: "Scripts e o seu Handy",
    free: {
      label: "Scripts grátis",
      caption:
        "Vídeos marcados como Grátis têm um script que você baixa com a connection key do seu Handy"
    },
    rate: {
      label: "Avaliar scripts",
      caption: "Dê estrelas a qualquer script grátis na própria página do vídeo"
    },
    comments: {
      label: "Comentários de scripts",
      caption: "Leia e publique comentários anônimos sobre os scripts"
    },
    requests: {
      label: "Pedir vídeos",
      caption:
        "Peça script para qualquer vídeo e vote no que ganha script em seguida"
    }
  },

  personalize: {
    title: "Deixe do seu jeito",
    previews: {
      label: "Prévias explícitas",
      caption: "Desligadas por padrão — ative as imagens nas configurações"
    },
    players: {
      label: "Reprodutores incorporados",
      caption:
        "Desligados por padrão — assista aos vídeos do Pornhub e do xHamster na própria página do vídeo (a reprodução não sincroniza com o Handy)"
    },
    filters: {
      label: "Filtros de orientação, script e vídeo",
      caption:
        "Scripts grátis ou premium, vídeos grátis ou premium, e quem aparece neles — nas configurações, ou direto nos filtros da busca"
    },
    mutedTags: {
      label: "Tags silenciadas",
      caption:
        "Silencie uma tag e todo vídeo com ela sai do catálogo — clique com o botão direito em qualquer tag, ou gerencie a lista nas configurações"
    },
    theme: {
      label: "Tema claro e escuro",
      caption: "Alterne no cabeçalho — sua escolha vale em todo o site"
    },
    share: {
      label: "Compartilhar",
      caption:
        "Toda página de vídeo e toda lista de resultados filtrada tem um link para compartilhar"
    }
  }
};

export default help;
