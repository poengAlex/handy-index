// Why the catalog is smaller than the index: the disclosure line under every
// listing (`notice`) and the muted-tag manager it opens (`muted`).
//
// `notice` carries two phrasings of the same four reasons on purpose. A lone
// reason is a whole sentence and says the noun ("7,468 videos hidden by muted
// tags"); once a total leads the line the noun has already been said, so each
// reason after it is a bare clause ("1,816 by the Straight filter"). Both
// receive `{count}` pre-formatted — the sentence form through
// `useFormat().count("videos", n)`, the clause form through `$n()`.
export default {
  notice: {
    hiddenByMuted: "{count} hidden by muted tags",
    hiddenByOrientation: "{count} hidden by the {orientation} filter",
    hiddenByScript: "{count} hidden by the premium-script filter",
    hiddenByVideo: "{count} hidden by the premium-video filter",

    hiddenTotal: "{count} hidden",
    byMuted: "{count} by muted tags",
    byOrientation: "{count} by the {orientation} filter",
    byScript: "{count} by the premium-script filter",
    byVideo: "{count} by the premium-video filter"
  },

  muted: {
    title: "Muted tags",
    lead:
      "Muted tags disappear from the catalog — browse, search, rows and " +
      "related videos all skip them. Matching is exact, so muting “gay” " +
      "won't mute “gay massage”. Favorites and playlists are yours, so they " +
      "stay put.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "Mute a tag",
    pickerEmpty: "No matching tags",
    costNone: "none of the videos you can see",
    costLine: "{count} · {share} of what you see",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "<1%",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "“{tag}” is on {count} — {share} of what you can currently see. Muting " +
      "it removes them from browse, search, rows and related videos " +
      "everywhere.",
    confirmMute: "Mute anyway",

    chipUnmuteAria: "Unmute tag: {tag}",
    empty:
      "Nothing muted yet. Pick a tag above and every video carrying it " +
      "leaves the catalog.",
    unmuteAll: "Unmute all",

    toastMutedTitle: "Muted “{tag}”",
    toastMutedBody: "{count} hidden",
    toastUnmutedAll: "All tags unmuted"
  }
};
