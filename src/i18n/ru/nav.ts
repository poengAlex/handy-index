import type enUS from "../en-US/nav";

// The app shell: header toolbar, main nav row, mobile drawer and the header's
// orientation switcher. Every link label here is rendered twice — once in the
// desktop nav, once in the drawer — from a single list.
const nav: typeof enUS = {
  // Landmark and icon-button labels a screen reader reads out. `homeAria`
  // names the logo link's destination; IVDB is a proper noun, not translated.
  menuAria: "Меню",
  homeAria: "Главная IVDB",
  mainNavAria: "Разделы",
  settingsAria: "Настройки",

  links: {
    home: "Главная",
    videos: "Видео",
    tags: "Теги",
    sites: "Сайты",
    performers: "Актёры",
    playlists: "Плейлисты",
    requests: "Запросы",
    favorites: "Избранное",
    history: "История",
    help: "Помощь и возможности",
    privacy: "Приватность"
  },

  // The mute badge in the toolbar, as both tooltip and aria-label. Two
  // shapes: before anything is hidden it can only name the gate, after that
  // it leads with the cost — "1 tag muted" reads as trivia, the video figure
  // is the part that surprises you. `mutedTags` is not a duplicate of
  // `common.count.tags`: the adjective inflects with the noun in Norwegian
  // ("1 dempet tagg" / "2 dempede tagger"), so it has to plural together.
  // `{tags}` receives the whole muted-tag phrase, so word order stays with
  // the translator.
  mutedTags:
    "{count} заглушённый тег | {count} заглушённых тега | {count} заглушённых тегов",
  mutedHidden:
    "{count} видео скрыто ({tags}) | {count} видео скрыто ({tags}) | {count} видео скрыто ({tags})",

  orientation: {
    aria: "Ориентация: {value}",
    header: "Показывать"
  }
};

export default nav;
