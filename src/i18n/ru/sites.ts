import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "Сайты",

  search: {
    placeholder: "Поиск сайтов",
    aria: "Поиск сайтов"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "{total} в индексе",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos:
      "{count} платное видео | {count} платных видео | {count} платных видео",
    premiumScripts:
      "{count} платный script | {count} платных scripts | {count} платных scripts"
  },

  errorTitle: "Не удалось загрузить сайты",
  emptyBody: "Индекс вернулся без единого сайта. Попробуй загрузить его снова.",
  noMatchTitle: "Сайты не найдены",
  noMatchBody:
    "Ни одно название сайта не совпало с запросом. Попробуй ввести меньше букв."
};

export default sites;
