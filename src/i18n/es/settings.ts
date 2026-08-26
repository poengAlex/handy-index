import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "Ajustes",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "Modo oscuro",
    darkModeCaption: "Usar el tema de color oscuro",
    nsfwLabel: "Vistas previas explícitas",
    nsfwCaption: "Mostrar las imágenes reales en lugar de tarjetas neutras",
    playersLabel: "Reproductores integrados",
    playersCaption:
      "Reproducir los vídeos de Pornhub y xHamster en la propia página del vídeo",
    fullWidthLabel: "Diseño a ancho completo",
    fullWidthCaption: "Usar toda la pantalla en lugar de una columna centrada"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "Etiquetas silenciadas",
    caption: "{count} etiqueta silenciada | {count} etiquetas silenciadas",
    empty: "Nada silenciado"
  },

  backgroundSceneTitle: "Estilo de fondo",
  backgroundSceneOff: "Desactivado",
  backgroundMotionLabel: "Movimiento",
  backgroundMotionCaption:
    "Dejar que el fondo se mueva, con un impulso breve al cambiar de página",
  orientationTitle: "Orientación",

  access: {
    title: "Acceso",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption:
      "Incluir los vídeos cuyo script está tras el muro de pago de un sitio asociado",
    premiumVideosLabel: "Vídeos premium",
    premiumVideosCaption:
      "Incluir los vídeos tras el muro de pago de un sitio asociado"
  },

  previews: {
    title: "Vistas previas de las tarjetas",
    hint:
      "Pasa el cursor por una tarjeta — o desliza un dedo sobre ella — para " +
      "previsualizarla. Haz clic en el nombre de una velocidad para " +
      "restablecerla.",
    imageSpeed: "Velocidad de imagen",
    clipSpeed: "Velocidad de clip"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Connection key",
    placeholder: "p. ej. a1B2c3D4e5",
    hint: "Tu connection key de Handy, que se usa al descargar scripts."
  },

  clearDataAction: "Borrar datos…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Borrar los datos guardados",
    lead:
      "Todo lo que este sitio recuerda vive en este navegador. Borra las " +
      "cosas una a una o bórralo todo de golpe.",
    clearAll: "Borrar todos los datos",
    allToast: "Datos locales borrados",

    recentLabel: "Vistos recientemente",
    recentToast: "Historial borrado",
    favoritesLabel: "Favoritos",
    favoritesToast: "Favoritos borrados",
    playlistsLabel: "Listas",
    playlistsToast: "Listas borradas",
    mutedToast: "Etiquetas silenciadas borradas",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "Valoraciones y votos",
    votesEmpty: "Nada registrado",
    votesToast: "Valoraciones y votos borrados",
    ratingCount:
      "{count} valoración de script | {count} valoraciones de scripts",
    requestVoteCount:
      "{count} voto a una solicitud | {count} votos a solicitudes",

    keySaved: "Guardada en este dispositivo",
    keyUnset: "Sin definir",
    keyToast: "Connection key borrada",

    preferencesLabel: "Preferencias de visualización",
    preferencesCaption:
      "Vistas previas explícitas, orientación, filtros de acceso, " +
      "velocidades de vista previa, fondo",
    preferencesToast: "Preferencias de visualización restablecidas"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Antes de explorar",
    body:
      "IVDB cataloga vídeos interactivos para adultos con scripts para The " +
      "Handy. Confirma que tienes 18 años o más para explorar con vistas " +
      "previas explícitas. Si continúas sin confirmarlo, las vistas previas " +
      "seguirán ocultas — puedes cambiarlo cuando quieras en los ajustes. " +
      "Tus preferencias se guardan solo en este navegador.",
    decline: "Continuar sin vistas previas",
    accept: "Tengo 18 años o más"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Hace falta la connection key",
    body:
      "Esta acción está vinculada a tu Handy. Escribe la connection key " +
      "de la app de Handy para continuar.",
    hint:
      "Tu Handy tiene que estar encendido y en línea para que la clave " +
      "funcione — un dispositivo sin conexión falla exactamente igual que " +
      "una clave incorrecta.",
    save: "Guardar y continuar"
  }
};

export default settings;
