import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "Моё избранное",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} в избранном",
    emptyTitle: "Избранного пока нет",
    emptyBody:
      "Нажми на сердечко на странице любого видео — и оно сохранится здесь для быстрого доступа."
  },

  history: {
    title: "История просмотров",
    note: "Хранится только в этом браузере — история просмотров нигде не отслеживается и никуда не отправляется.",
    emptyTitle: "Пока ничего не просмотрено",
    emptyBody:
      "Открытые тобой видео запоминаются здесь — только на этом устройстве.",
    clearTitle: "Очистить историю просмотров?",
    clearBody:
      "Видео останутся в каталоге — исчезнет только список того, что было открыто в этом браузере.",
    clearConfirm: "Очистить историю",
    clearedToast: "История просмотров очищена"
  }
};

export default library;
