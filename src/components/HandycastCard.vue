<template>
  <a
    v-if="shown"
    class="handycast-card"
    :href="SHOW.href"
    target="_blank"
    rel="noopener"
    @click="track('promo_clicked', { promo: 'handycast' })"
  >
    <img
      v-if="settings.nsfw"
      class="handycast-card__photo"
      :src="photoUrl"
      alt=""
      width="96"
      height="96"
    />
    <q-icon v-else name="schedule" size="24px" class="handycast-card__icon" />
    <span class="handycast-card__text">
      <span class="text-body-compact handycast-card__title">
        <template v-if="live">{{ $t("home.handycast.live") }}</template>
        <i18n-t v-else keypath="home.handycast.next" tag="span" scope="global">
          <template #when>
            <span class="handycast-card__when">{{ when }}</span>
          </template>
        </i18n-t>
      </span>
      <span class="text-body-sm handycast-card__caption">{{
        $t("home.handycast.body", { host: SHOW.host })
      }}</span>
    </span>
    <q-icon name="open_in_new" size="20px" class="handycast-card__go" />
  </a>
</template>

<script setup lang="ts">
// The ad for the next Handycast, a card the size of the site notes beside it.
// It says when the show starts in the visitor's own language and time zone,
// and it renders nothing once the show is over. Each new show is one edit to
// SHOW, plus a new photo in public/promo when the host changes.
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { track } from "@/services/analytics";
import { useSettingsStore } from "@/stores/settings";

const SHOW = {
  host: "Montana Moore",
  /** the main event on Stripchat: Saturday 7 November 2026, 3:30 pm ET */
  startsAt: Date.parse("2026-11-07T20:30:00Z"),
  /** when the card goes away: three hours later, as shows have no set end */
  hiddenFrom: Date.parse("2026-11-07T23:30:00Z"),
  photo: "promo/handycast-montana-moore.webp",
  /** the page itself: Handyverse's #/handycast route opens its device picker
   * first for anyone new to Handyverse */
  href: "https://handyverse.com/handycast/handycast.html"
};

const settings = useSettingsStore();
const { locale } = useI18n();

const photoUrl = `${import.meta.env.BASE_URL}${SHOW.photo}`;

// a tab left open still has to say "live" at the start and lose the card at
// the end
const now = ref(Date.now());
const clock = setInterval(() => {
  now.value = Date.now();
}, 60_000);
onBeforeUnmount(() => clearInterval(clock));

// this host's show is not for someone browsing only gay or trans videos
const shown = computed(
  () =>
    now.value < SHOW.hiddenFrom &&
    (settings.orientation === "straight" || settings.orientation === "all")
);

const live = computed(() => now.value >= SHOW.startsAt);

// no timeZone option, so this is the date and time where the visitor is, and
// timeZoneName says which zone that is, so nobody has to guess
const when = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(SHOW.startsAt)
);
</script>

<style scoped lang="scss">
// HNavCard's whole-card target, with a photo where its icon chip goes: the
// kit's card only links inside the app and only takes an icon
.handycast-card {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  color: var(--color-text-primary);
  // a card that is a link: kill the global anchor underline
  text-decoration: none !important;
  transition: box-shadow 180ms ease;

  // a touch screen keeps :hover on the last thing touched (see HListRow)
  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-md);
    }
  }
}

// runs to the card's top, bottom and left edges, whatever height the row is
.handycast-card__photo {
  flex-shrink: 0;
  align-self: stretch;
  width: 96px;
  height: auto;
  min-height: 96px;
  margin-block: calc(-1 * var(--space-sm));
  margin-inline-start: calc(-1 * var(--space-md));
  object-fit: cover;

  @media (max-width: 599px) {
    width: 80px;
    min-height: 80px;
  }
}

.handycast-card__icon {
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.handycast-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.handycast-card__title {
  font-weight: 600;
}

// a date broken across two lines is hard to read: as an inline block it moves
// to a line of its own in one piece, and only wraps if that is still too narrow
// (a long zone name on the narrowest phones)
.handycast-card__when {
  display: inline-block;
}

.handycast-card__caption {
  color: var(--color-text-secondary);
  // no last word alone on its line
  text-wrap: pretty;
}

// a phone's card needs the width for its words, and the whole card is the
// target anyway
.handycast-card__go {
  flex-shrink: 0;
  color: var(--color-text-link);

  @media (max-width: 599px) {
    display: none;
  }
}
</style>

<style lang="scss">
// Shadows don't read on dark, so hover lifts via a hairline there (HNavCard)
@media (hover: hover) {
  [data-theme="dark"] .handycast-card:hover {
    box-shadow: inset 0 0 0 1px var(--color-stroke-default);
  }
}
</style>
