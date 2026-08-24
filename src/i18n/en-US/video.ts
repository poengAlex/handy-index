// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
export default {
  missingTitle: "Video not found",
  missingBody: "This video isn't in the index anymore, or the link is wrong.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "Video",
    player: "Video player",
    site: "the site",
    thisSite: "this site"
  },

  hero: {
    premiumChip: "Premium script"
  },

  action: {
    getScript: "Get script",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "Watch on {site}",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    addToPlaylist: "Add to playlist",
    report: "Report this video"
  },

  premiumNote:
    "The script for this video is premium — it comes with the video on the partner site.",

  playerNote:
    "The Handy doesn't sync with playback here on IVDB — this player is video-only. Download the script and play it through your Handy setup for synced strokes.",

  tag: {
    unmuteAria: "Unmute tag: {tag}",
    mutedTitle: "“{tag}” is muted — click to unmute",
    browse: "Browse this tag",
    mute: "Mute this tag"
  },

  details: {
    title: "Details",
    script: "Script",
    free: "Free",
    premium: "Premium",
    published: "Published",
    duration: "Duration",
    format: "Format",
    // the non-VR case: an ordinary 2D video
    formatFlat: "Flat",
    site: "Site",
    scriptBy: "Script by",
    rating: "Rating",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}% · {votes}",
    scriptPlays: "Script plays"
  },

  rate: {
    title: "Rate this script",
    community: "Community: {percent}%",
    thanks: "Thanks for rating this script",
    errorTitle: "Couldn't save your rating"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "Photos",
    previewTitle: "Preview",
    previewBadge: "Preview",
    clipAria: "Play preview clip full size",
    photoAria: "Open photo {index} of {total}",
    stillAlt: "Still {number} from {title}",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    closeViewer: "Close viewer",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Comments",
    gateHint: "Comments need your connection key.",
    gateAction: "Add key",
    inputLabel: "Add a comment",
    submit: "Comment",
    errorHint: "Couldn't load comments.",
    emptyHint: "No comments yet — be the first.",
    postedTitle: "Comment submitted",
    postedBody: "It shows up once it passes review.",
    postErrorTitle: "Couldn't post your comment"
  },

  more: {
    related: "More like this",
    fromPartner: "More from {site}"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "Scripts are bound to your Handy. Enter the connection key from the Handy app to continue.",
    action:
      "Rating and comments are bound to your Handy. Enter the connection key from the Handy app to continue."
  },

  script: {
    readyTitle: "Script ready",
    readyBody: "The download opened in a new tab.",
    errorTitle: "Couldn't get the script",
    errorBody:
      "Either the connection key is wrong or your Handy isn't online. Check both, then try again."
  },

  mute: {
    refusedTitle: "“{tag}” can't be muted",
    refusedBody:
      "Orientation tags decide which catalog you see — change that in settings.",
    doneTitle: "Muted “{tag}”",
    doneBody: "It's in your muted list — unmute any time.",
    undoneTitle: "Unmuted “{tag}”"
  },

  share: {
    copiedTitle: "Link copied",
    errorTitle: "Couldn't copy the link"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "I want to report a video",
    intro: "I want to report a video.",
    titleLine: "Title: {title}",
    untitled: "(untitled)",
    idLine: "Video ID: {id}",
    siteLine: "Site: {site}",
    linkLine: "Link: {link}",
    reasonLine: "Reason for the report:"
  }
};
