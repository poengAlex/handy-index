// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
export default {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "Video",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating}%"
  },

  menu: {
    open: "Open",
    openNewTab: "Open in new tab",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    addToPlaylist: "Add to playlist…",
    copyLink: "Copy link",
    downloadScript: "Download script",
    downloadBlocked: "Download not possible",
    downloadBlockedCaption: "This is a premium script",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Watch on {site}",
    watchOnSite: "Watch on the site"
  },

  toast: {
    linkCopied: "Link copied",
    linkCopyFailed: "Couldn't copy the link",
    scriptDownloaded: "Script downloaded",
    scriptFailedTitle: "Couldn't get the script",
    scriptFailedBody:
      "Either the connection key is wrong or your Handy isn't online. Check both, then try again."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Scripts are bound to your Handy. Enter the connection key from the Handy app to continue."
  }
};
