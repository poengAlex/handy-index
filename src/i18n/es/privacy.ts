import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "Privacidad y condiciones",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "Esto es una traducción. Si las dos versiones no coinciden, la que vale es la versión en inglés.",

  intro:
    "IVDB es un catálogo de vídeos que tienen scripts de Handy, mantenido por el equipo de Handy (Ohdoki AS). Esta página explica qué hace el sitio con tus datos — la versión corta: lo menos posible.",

  what: {
    title: "Qué es este sitio",
    body: "El sitio lista los vídeos con script y te enlaza a los scripts y a los sitios asociados donde está alojado el contenido en sí. En nuestros servidores no se guarda ningún vídeo — solo los scripts. Explorar el catálogo es gratis para quienes tienen un Handy.",
    apiBody:
      "El sitio está construido sobre la API pública del índice de scripts — úsala en tus propios proyectos si quieres: {apiDocs}. El sitio en sí es de código abierto, para total transparencia: {repo}.",
    apiDocsLink: "documentación de la API",
    repoLink: "repositorio de GitHub"
  },

  local: {
    title: "Qué se queda en este navegador",
    intro:
      "No hay cuentas ni cookies. Todo lo que configuras se guarda únicamente en el almacenamiento local de este navegador:",
    item: {
      consent: "tu respuesta al diálogo de consentimiento de la primera visita",
      previews: "la opción de vistas previas explícitas (NSFW)",
      orientation: "el filtro de orientación",
      accessFilters: "tus filtros de acceso a scripts y vídeos",
      favorites: "tus favoritos",
      votes: "los votos que has emitido en las solicitudes de vídeo",
      connectionKey: "tu connection key de Handy",
      statisticsId:
        "un ID aleatorio para las estadísticas de uso anónimas que se describen más abajo"
    },
    outro:
      "Abre el sitio en otro dispositivo — o borra los datos de tu navegador — y todo esto desaparece; no hay nada que recuperar de ningún servidor."
  },

  catalog: {
    title: "De dónde sale el catálogo",
    body: "El catálogo, sus metadatos y los scripts se cargan desde la API del índice de scripts de handyfeeling.com. Cuando descargas un script, envías una solicitud de vídeo o votas una, tu connection key se manda a esa API como autorización. Con las estadísticas de uso activadas, también se manda a la API de Handy para comprobar si tu Handy está conectado — mira más abajo. Son las únicas veces que algo que has escrito sale de tu navegador."
  },

  statistics: {
    title: "Estadísticas de uso anónimas",
    sent: "Para saber qué funciones se usan y dónde falla el sitio, IVDB envía estadísticas de uso anónimas a PostHog, un servicio de analítica que las guarda en servidores de la UE. Lo que se envía: las páginas que abres, incluido qué vídeo (por su ID); lo que haces con los botones del sitio — abrir un vídeo, descargar un script, añadir un favorito y cosas así; tus ajustes y tu idioma; tu navegador y tu tipo de dispositivo; el país desde el que te conectas; y un informe de error cuando algo falla.",
    never:
      "Lo que nunca se envía: tu filtro de orientación, nombres de etiquetas o de intérpretes, lo que buscas, títulos de vídeos, tus comentarios ni los filtros de la dirección web. Tu pantalla nunca se graba y tu dirección IP no se almacena.",
    device:
      "Si has guardado una connection key y tu Handy está conectado, las estadísticas se vinculan a un ID creado a partir de esa clave — sus tres primeros caracteres y un hash de la clave entera —, junto con el modelo y la versión de firmware de tu Handy. Así contamos dispositivos en lugar de navegadores. La clave en sí nunca se envía a PostHog.",
    choice:
      "Las estadísticas están activadas por defecto. Puedes desactivarlas cuando quieras en los ajustes; el sitio envía entonces un último mensaje que lo indica, y nada más después. Borrar todos los datos guardados también empieza un ID aleatorio nuevo."
  },

  thirdParty: {
    title: "Sitios de terceros",
    body: "Las páginas de vídeo enlazan a los sitios asociados donde están alojados los vídeos. Son sitios de terceros con contenido para adultos, con sus propias políticas de privacidad y su propia analítica — en cuanto sales de IVDB, mandan sus reglas. Con las vistas previas explícitas activadas, las miniaturas se cargan directamente desde los sitios asociados, así que tu navegador hace peticiones que sus servidores pueden registrar. Si eso te preocupa, deja las vistas previas desactivadas o usa una VPN."
  },

  age: {
    title: "Requisito de edad",
    body: "Este sitio indexa contenido para adultos y es solo para adultos. Tienes que tener 18 años o más — o la mayoría de edad donde vives — para usarlo."
  },

  choices: {
    title: "Cambiar lo que has elegido",
    body: "Nada de lo que has elegido en el diálogo de la primera visita es definitivo. Las vistas previas explícitas, la orientación, los filtros de acceso a scripts y vídeos y las estadísticas de uso se pueden cambiar cuando quieras desde el diálogo de ajustes de la barra superior."
  },

  contact: {
    title: "Contacto",
    body: "Preguntas, informes de fallos o peticiones de retirada de contenido: {email}"
  }
};

export default privacy;
