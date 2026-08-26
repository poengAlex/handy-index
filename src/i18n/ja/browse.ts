import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "動画",

  toolbar: {
    searchPlaceholder: "タイトルを検索",
    searchAria: "タイトルで動画を検索",
    sortAria: "動画を並べ替え",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "降順で表示中。並び順を反転します",
    dirAscAria: "昇順で表示中。並び順を反転します",
    dirDescTitle: "降順で表示中。クリックで反転します",
    dirAscTitle: "昇順で表示中。クリックで反転します",
    filters: "フィルター",
    filtersCount: "フィルター（{count}）",
    shareAria: "この結果を共有。リンクにはすべてのフィルターが含まれます"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "新着順",
    updated: "更新順",
    top: "評価が高い順",
    plays: "Script再生数順",
    views: "視聴数順",
    longest: "再生時間が長い順",
    title: "タイトル順"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "フィルターを解除：{label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "パートナー",
    performerFallback: "出演者"
  },

  filters: {
    title: "フィルター",
    addTag: "タグを追加",
    noTags: "一致するタグがありません",
    site: "サイト",
    noSites: "一致するサイトがありません",
    performer: "出演者",
    noPerformers: "一致する出演者がいません",
    // one row of any picker: the tag, site or performer name, then how
    // many videos picking it would leave on screen
    option: "{name}（{count}）",
    vrLabel: "VRのみ",
    vrCaption: "VR動画だけを表示します",
    orientation: "性的指向",
    access: "利用条件",
    premiumScriptsLabel: "有料script",
    premiumScriptsCaption: "パートナーサイトの有料エリアにあるscriptも含めます",
    premiumVideosLabel: "有料動画",
    premiumVideosCaption: "パートナーサイトの有料エリアにある動画も含めます",
    mutedLabel: "ミュート中のタグ",
    mutedNone: "ミュートなし",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} 他{rest}個",
    duration: "再生時間",
    durationAny: "指定なし",
    durationFrom: "{min}分以上",
    durationRange: "{min}〜{max}分"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "「{tag}」はミュート中です",
    mutedOneBody:
      "このタグが付いた動画は、サイト全体で非表示になっています。結果を見るにはミュートを解除してください。",
    mutedOneAction: "「{tag}」のミュートを解除",
    mutedManyTitle: "一部のタグがミュート中です",
    mutedManyBody:
      "これらのタグが付いた動画は、サイト全体で非表示になっています。結果を見るにはミュートを解除してください。",
    mutedManyAction: "まとめてミュートを解除",
    // {orientation} comes from common.orientation.* via useFormat(). It is
    // pinned to English, so it arrives as a Latin run inside Japanese and
    // gets the 「」 this locale already gives an interpolated data value.
    orientationTitle: "「{orientation}」に表示できる動画がありません",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "他の条件はすべて満たす動画が{count}本ありますが、「{orientation}」フィルターから外れています。",
    orientationAction: "すべての性的指向を表示",
    noneTitle: "一致する動画がありません",
    noneBody:
      "すべての動画が絞り込みから外れました。検索条件を緩めるか、フィルターをいくつか解除してください。",
    noneAction: "フィルターをすべて解除"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB：{count}",
    fallbackTitle: "IVDBの動画",
    copiedTitle: "リンクをコピーしました",
    copiedBody: "設定したフィルターがすべて含まれています。",
    failedTitle: "リンクをコピーできませんでした"
  }
};

export default browse;
