// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
export default {
  favorites: {
    title: "My favorites",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} saved",
    emptyTitle: "No favorites yet",
    emptyBody:
      "Tap the heart button on any video page and it's saved here for quick access."
  },

  history: {
    title: "Recently viewed",
    note: "Only stored in this browser — your viewing history is never tracked or sent anywhere.",
    emptyTitle: "Nothing viewed yet",
    emptyBody: "Videos you open are remembered here, on this device only.",
    clearTitle: "Clear recently viewed?",
    clearBody:
      "The videos stay in the catalog — only this browser's list of what you've opened goes away.",
    clearConfirm: "Clear history",
    clearedToast: "Recently viewed cleared"
  }
};
