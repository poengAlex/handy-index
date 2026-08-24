import type enUS from "../en-US/gates";

// Why the catalog is smaller than the index: the disclosure line under every
// listing (`notice`) and the muted-tag manager it opens (`muted`).
//
// `notice` carries two phrasings of the same four reasons on purpose. A lone
// reason is a whole sentence and says the noun ("7,468 videos hidden by muted
// tags"); once a total leads the line the noun has already been said, so each
// reason after it is a bare clause ("1,816 by the Straight filter"). Both
// receive `{count}` pre-formatted — the sentence form through
// `useFormat().count("videos", n)`, the clause form through `$n()`.
const gates: typeof enUS = {
  notice: {
    hiddenByMuted: "{count} скрыто заглушёнными тегами",
    hiddenByOrientation: "{count} скрыто фильтром «{orientation}»",
    hiddenByScript: "{count} скрыто фильтром платных скриптов",
    hiddenByVideo: "{count} скрыто фильтром платных видео",

    hiddenTotal: "{count} скрыто",
    byMuted: "{count} заглушёнными тегами",
    byOrientation: "{count} фильтром «{orientation}»",
    byScript: "{count} фильтром платных скриптов",
    byVideo: "{count} фильтром платных видео"
  },

  muted: {
    title: "Заглушённые теги",
    lead:
      "Заглушённые теги исчезают из каталога — их пропускают просмотр, " +
      "поиск, подборки и похожие видео. Совпадение точное: если заглушить " +
      "«gay», «gay massage» останется. Избранное и плейлисты — ваши, они " +
      "остаются на месте.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "Заглушить тег",
    pickerEmpty: "Теги не найдены",
    costNone: "ничего из видимого каталога",
    costLine: "{count} · {share} видимого каталога",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "<1%",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "С тегом «{tag}» — {count}: это {share} видимого каталога. Если " +
      "заглушить его, эти видео исчезнут везде — из просмотра, поиска, " +
      "подборок и похожих видео.",
    confirmMute: "Всё равно заглушить",

    chipUnmuteAria: "Вернуть тег: {tag}",
    empty:
      "Пока ничего не заглушено. Выберите тег выше — и все видео с ним " +
      "покинут каталог.",
    unmuteAll: "Вернуть все",

    toastMutedTitle: "Тег «{tag}» заглушён",
    toastMutedBody: "{count} скрыто",
    toastUnmutedAll: "Все теги возвращены"
  }
};

export default gates;
