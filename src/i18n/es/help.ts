import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "Ayuda",
  lead: "Todo lo que este sitio puede hacer, en un solo lugar. Las filas con flecha te llevan directo allí.",

  finding: {
    title: "Encontrar vídeos",
    search: {
      label: "Buscar y filtrar",
      caption:
        "Busca por título y luego afina por etiqueta, sitio, intérprete, VR y duración — cada filtro va en la URL, así que los resultados se pueden compartir"
    },
    sort: {
      label: "Ordena como quieras",
      caption:
        "Recién añadidos, mejor valorados, más reproducidos y mucho más — el botón de flecha junto al orden invierte la dirección"
    },
    tags: {
      label: "Nube de etiquetas",
      caption:
        "Todas las etiquetas del catálogo menos las que has silenciado, con búsqueda y orden — un clic filtra la página de exploración"
    },
    performers: {
      label: "Intérpretes",
      caption: "Explora por intérprete, empezando por la filmografía más grande"
    },
    sites: {
      label: "Sitios",
      caption: "Todos los sitios asociados del índice con su número de vídeos"
    }
  },

  library: {
    title: "Tu biblioteca",
    favorites: {
      label: "Favoritos",
      caption:
        "Marca con el corazón cualquier vídeo para tenerlo a mano — se guarda en este dispositivo"
    },
    playlists: {
      label: "Listas de reproducción",
      caption: "Crea, renombra y organiza listas con los vídeos que quieras"
    },
    transfer: {
      label: "Compartir, importar y exportar listas",
      caption:
        "Mueve una lista como archivo, como texto JSON que se puede copiar o como enlace temporal — y impórtala desde cualquiera de los tres"
    },
    bulkDownload: {
      label: "Descargar todos los scripts de una vez",
      caption:
        "Un clic en una lista descarga todos los scripts gratuitos que tiene"
    },
    quickMenu: {
      label: "Menú rápido",
      caption:
        "Haz clic con el botón derecho en cualquier miniatura de vídeo —o mantenla pulsada— para favoritos, listas, copiar el enlace y más"
    }
  },

  scripts: {
    title: "Los scripts y tu Handy",
    free: {
      label: "Scripts gratuitos",
      caption:
        "Los vídeos marcados como Gratis tienen un script que puedes descargar con tu connection key de Handy"
    },
    rate: {
      label: "Valorar scripts",
      caption:
        "Valora con estrellas cualquier script gratuito en la propia página del vídeo"
    },
    comments: {
      label: "Comentarios sobre los scripts",
      caption: "Lee y publica comentarios anónimos sobre los scripts"
    },
    requests: {
      label: "Solicitar vídeos",
      caption:
        "Pide un script para cualquier vídeo y vota cuáles tendrán script a continuación"
    }
  },

  personalize: {
    title: "Hazlo tuyo",
    previews: {
      label: "Vistas previas explícitas",
      caption:
        "Desactivadas por defecto — activa las imágenes reales en los ajustes"
    },
    players: {
      label: "Reproductores integrados",
      caption:
        "Desactivados por defecto — mira los vídeos de Pornhub y xHamster en la propia página del vídeo (la reproducción no se sincroniza con el Handy)"
    },
    filters: {
      label: "Filtros de orientación, scripts y vídeos",
      caption:
        "Scripts gratuitos o premium, vídeos gratuitos o premium, y quién sale en ellos — en los ajustes, o directamente en los filtros de exploración"
    },
    mutedTags: {
      label: "Etiquetas silenciadas",
      caption:
        "Silencia una etiqueta y todos los vídeos que la llevan salen del catálogo — haz clic con el botón derecho en cualquier etiqueta, o gestiona la lista en los ajustes"
    },
    theme: {
      label: "Tema claro y oscuro",
      caption: "Cámbialo en la cabecera — se respeta en todo el sitio"
    },
    share: {
      label: "Compartir",
      caption:
        "Cada página de vídeo y cada lista de resultados filtrada tiene un enlace que se puede compartir"
    }
  }
};

export default help;
