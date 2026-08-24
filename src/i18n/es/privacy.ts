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
    "IVDB es un catálogo de videos que tienen scripts de Handy, mantenido por el equipo de Handy (Ohdoki AS). Esta página explica qué hace el sitio con tus datos — la versión corta: lo menos posible.",

  what: {
    title: "Qué es este sitio",
    body: "El sitio lista los videos con script y te enlaza a los scripts y a los sitios asociados donde está alojado el contenido en sí. En nuestros servidores no se guarda ningún video — solo los scripts. Explorar el catálogo es gratis para quienes tienen un Handy.",
    apiBody:
      "El sitio está construido sobre la API pública del índice de scripts — úsala en tus propios proyectos si quieres: {apiDocs}. El sitio en sí es de código abierto, para total transparencia: {repo}.",
    apiDocsLink: "documentación de la API",
    repoLink: "repositorio de GitHub"
  },

  local: {
    title: "Qué se queda en este navegador",
    intro:
      "No hay cuentas, ni cookies, ni analítica. Todo lo que configuras se guarda únicamente en el almacenamiento local de este navegador:",
    item: {
      consent: "tu respuesta al diálogo de consentimiento de la primera visita",
      previews: "la opción de vistas previas explícitas (NSFW)",
      orientation: "el filtro de orientación",
      accessFilters: "tus filtros de acceso a scripts y videos",
      favorites: "tus favoritos",
      votes: "los votos que has emitido en las solicitudes de video",
      connectionKey: "tu clave de conexión de Handy"
    },
    outro:
      "Abre el sitio en otro dispositivo — o borra los datos de tu navegador — y todo esto desaparece; no hay nada que recuperar de ningún servidor. La contrapartida de no tener analítica es que no vemos los errores cuando ocurren, así que los informes de fallos son doblemente bienvenidos."
  },

  catalog: {
    title: "De dónde sale el catálogo",
    body: "El catálogo, sus metadatos y los scripts se cargan desde la API del índice de scripts de handyfeeling.com. Cuando descargas un script, envías una solicitud de video o votas una, tu clave de conexión se manda a esa API como autorización — es la única vez que algo que has escrito sale de tu navegador."
  },

  thirdParty: {
    title: "Sitios de terceros",
    body: "Las páginas de video enlazan a los sitios asociados donde están alojados los videos. Son sitios de terceros con contenido para adultos, con sus propias políticas de privacidad y su propia analítica — en cuanto sales de IVDB, mandan sus reglas. Con las vistas previas explícitas activadas, las miniaturas se cargan directamente desde los sitios asociados, así que tu navegador hace peticiones que sus servidores pueden registrar. Si eso te preocupa, deja las vistas previas desactivadas o usa una VPN."
  },

  age: {
    title: "Requisito de edad",
    body: "Este sitio indexa contenido para adultos y es solo para adultos. Tienes que tener 18 años o más — o la mayoría de edad donde vives — para usarlo."
  },

  choices: {
    title: "Cambiar lo que elegiste",
    body: "Nada de lo que elegiste en el diálogo de la primera visita es definitivo. Las vistas previas explícitas, la orientación y los filtros de acceso a scripts y videos se pueden cambiar cuando quieras desde el diálogo de ajustes de la barra superior."
  },

  contact: {
    title: "Contacto",
    body: "Preguntas, informes de fallos o peticiones de retirada de contenido: {email}"
  }
};

export default privacy;
