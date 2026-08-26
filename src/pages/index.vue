<template>
  <q-layout
    view="lHh Lpr lFf"
    class="app-shell"
    :class="{
      'app-shell--full-width': settings.fullWidth,
      'app-shell--bg': bgScene !== null
    }"
  >
    <!-- Decorative gradient field behind everything. mount="none" overrides
         both scenes' bloom entrance — the field is simply there on arrival,
         which is the honest choice for a tool you come back to rather than
         a front door.

         motion="still" is how the motion switch is spent: the look stays
         exactly as tuned and only the movement stops. Passing null instead
         leaves the scene's own motion alone. -->
    <HandyBackground
      v-if="bgScene"
      ref="bg"
      :scene="bgScene"
      :motion="settings.backgroundMotion ? null : 'still'"
      mount="none"
    />

    <q-header
      :class="[
        'app-header',
        scrolled ? (dark ? 'glass-dark' : 'glass-light') : 'app-header--top'
      ]"
    >
      <q-toolbar class="app-toolbar h-container">
        <q-btn
          v-if="$q.screen.xs"
          flat
          round
          dense
          icon="menu"
          :aria-label="$t('nav.menuAria')"
          class="app-toolbar__btn"
          @click="drawer = !drawer"
        />
        <router-link to="/" class="app-logo" :aria-label="$t('nav.homeAria')">
          <HLogo :height="22" :mark="$q.screen.xs" />
          <span class="text-body-compact app-logo__suffix">IVDB</span>
        </router-link>
        <nav
          v-if="!$q.screen.xs"
          class="app-nav"
          :aria-label="$t('nav.mainNavAria')"
        >
          <HBtn
            v-for="link in navLinks"
            :key="link.to"
            variant="tertiary"
            size="sm"
            :label="link.label"
            :to="link.to"
            :class="{ 'app-nav__link--active': isActive(link.to) }"
          />
        </nav>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="favorite"
          :aria-label="$t('nav.links.favorites')"
          class="app-toolbar__btn"
          to="/favorites"
        />
        <q-btn
          flat
          round
          dense
          icon="history"
          :aria-label="$t('nav.links.history')"
          class="app-toolbar__btn"
          to="/history"
        />
        <OrientationMenu />
        <!-- only while mutes are on: a gate that removes more of the catalog
             than any other had no presence in the chrome at all -->
        <q-btn
          v-if="settings.mutedTags.length"
          flat
          round
          dense
          icon="volume_off"
          :aria-label="mutedLabel"
          class="app-toolbar__btn"
          @click="mutedTagsOpen = true"
        >
          <q-badge floating rounded color="primary">
            {{ $n(settings.mutedTags.length) }}
          </q-badge>
          <q-tooltip>{{ mutedLabel }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="help"
          :aria-label="$t('nav.links.help')"
          class="app-toolbar__btn"
          to="/help"
        >
          <q-tooltip>{{ $t("nav.links.help") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="tune"
          :aria-label="$t('nav.settingsAria')"
          class="app-toolbar__btn"
          @click="settingsOpen = true"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="left" overlay behavior="mobile" bordered>
      <div class="app-drawer">
        <HDrawerItem
          :label="$t('nav.links.home')"
          icon="home"
          to="/"
          :active="route.path === '/'"
          @click="drawer = false"
        />
        <HDrawerItem
          v-for="link in navLinks"
          :key="link.to"
          :label="link.label"
          :icon="link.icon"
          :to="link.to"
          :active="isActive(link.to)"
          @click="drawer = false"
        />
        <HDrawerItem
          :label="$t('nav.links.favorites')"
          icon="favorite"
          to="/favorites"
          :active="isActive('/favorites')"
          @click="drawer = false"
        />
        <HDrawerItem
          :label="$t('nav.links.history')"
          icon="history"
          to="/history"
          :active="isActive('/history')"
          @click="drawer = false"
        />
        <HDrawerItem
          :label="$t('nav.links.help')"
          icon="help"
          to="/help"
          :active="isActive('/help')"
          @click="drawer = false"
        />
        <HDrawerItem
          :label="$t('nav.links.privacy')"
          icon="policy"
          to="/privacy"
          :active="isActive('/privacy')"
          @click="drawer = false"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="route-fade" mode="out-in" @before-enter="scrollToTop">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <BackToTop v-if="showBackToTop" :label="$t('nav.backToTop')" />

    <SettingsDialog v-model="settingsOpen" />
    <MutedTagsDialog v-model="mutedTagsOpen" />
    <ConsentDialog />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import {
  HBtn,
  HDrawerItem,
  HLogo,
  useGlassOnScroll,
  useHandyTheme
} from "@/components/handy";
import { HandyBackground } from "@/components/background";
import BackToTop from "@/components/BackToTop.vue";
import ConsentDialog from "@/components/ConsentDialog.vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import OrientationMenu from "@/components/OrientationMenu.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const $q = useQuasar();
const route = useRoute();
const { t, n } = useI18n();
const settingsOpen = ref(false);
const mutedTagsOpen = ref(false);
const drawer = ref(false);
const { dark, init } = useHandyTheme();
const { scrolled } = useGlassOnScroll();
const catalog = useCatalogStore();
const settings = useSettingsStore();

// One source for both the desktop nav row and the drawer. A module constant
// would freeze today's language at import time (the labels would survive a
// language switch untranslated), so the list is a computed over `t`.
const navLinks = computed(() => [
  { label: t("nav.links.videos"), to: "/videos", icon: "movie" },
  { label: t("nav.links.tags"), to: "/tags", icon: "sell" },
  { label: t("nav.links.sites"), to: "/sites", icon: "language" },
  { label: t("nav.links.performers"), to: "/performers", icon: "person" },
  { label: t("nav.links.playlists"), to: "/playlists", icon: "playlist_play" },
  { label: t("nav.links.requests"), to: "/requests", icon: "how_to_vote" }
]);

// leads with the cost, not the count: "1 tag muted" reads as trivia, while
// the video figure is the thing that surprised you
const mutedLabel = computed(() => {
  const tags = settings.mutedTags.length;
  const tagPart = t("nav.mutedTags", { count: n(tags) }, tags);
  const hidden = catalog.gates.byMutedTags;
  if (!hidden) return tagPart;
  // one message, not two glued halves — the tag phrase goes in as a param so
  // the translator decides where it lands in the sentence
  return t("nav.mutedHidden", { count: n(hidden), tags: tagPart }, hidden);
});

// Navigating surges the field. This used to be hand-rolled here, driving the
// `speed` prop down a rAF; the component now ships the same idea done
// properly as burst(), and the difference matters as soon as a scene moves
// with CSS rather than JS. Driving `speed` rewrites animation-duration,
// which restarts a CSS animation mid-flight — invisible under `handy`
// (morph is a JS loop) and a visible jump under `erin` (drift is CSS).
// burst() pushes playbackRate instead, so every layer accelerates in phase
// and lands back at exactly its resting rate.
const bg = useTemplateRef<InstanceType<typeof HandyBackground>>("bg");

// null when the field is switched off, which is also what keeps `scene`
// narrowed to a SceneId the component will accept.
const bgScene = computed(() =>
  settings.backgroundScene === "off" ? null : settings.backgroundScene
);

// Path only — a query or filter change is the same page. Skipped while the
// motion switch is off: with motion="still" there is nothing to accelerate,
// so a burst would only spin a rAF for two seconds to no effect.
watch(
  () => route.path,
  () => {
    if (settings.backgroundMotion) bg.value?.burst();
  }
);

// Every route but the site directory gets the back-to-top button: the button
// only surfaces two viewports down, so on the short pages it simply never
// appears and the list pages are what is left. The directory is the one
// long-ish list that opts out — it is a jumping-off point you leave from a
// card, not a feed you read to the end of.
const showBackToTop = computed(() => route.path !== "/sites");

// exact match only — design.md: "prefix matching must not light up a parent"
function isActive(to: string): boolean {
  return route.path === to;
}

// Reset scroll on route change inside the out-in transition — doing it in
// before-enter (new page already in the DOM) makes it stick.
function scrollToTop() {
  window.scrollTo({ top: 0 });
}

onMounted(() => {
  // No stored choice → init() follows the OS colour scheme (and keeps
  // following it until the user picks a side).
  init();
  void catalog.load();
});
</script>

<style scoped lang="scss">
.app-shell {
  background: var(--color-bg-page);
  // full-bleed carousels use 100vw break-outs; clip horizontal overflow so
  // the vw width (which counts the scrollbar) never adds a page scrollbar
  overflow-x: clip;
}

// HandyBackground's contract: the field sits at z-index 0, content above it.
// Quasar leaves q-page-container unpositioned, which would paint page text
// underneath the fixed backdrop.
.app-shell .q-page-container {
  position: relative;
  z-index: 1;
}

// Nav: edge-to-edge strip, no radius, no bottom border ever; the page
// surface at the top, glass once scrolled.
.app-header {
  color: var(--color-text-primary);
  box-shadow: none;
  transition: background 180ms ease;
}

.app-header--top {
  background: var(--color-bg-page);
}

// The unscrolled header is the page surface, which over a gradient field
// reads as a solid strip cutting the top off it. With the field on, let it
// show through instead — once scrolled the glass treatment takes over as
// usual. Header ink is primary weight, which the field carries at AA.
.app-shell--bg .app-header--top {
  background: transparent;
}

.app-toolbar {
  height: 64px;
  width: 100%;

  @media (max-width: 599px) {
    height: 56px;
  }
}

.app-toolbar__btn {
  color: var(--color-text-primary);
  // icon buttons with a `to` render as <a>; kill the global anchor underline
  text-decoration: none !important;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-left: var(--space-md);

  // nav buttons with a `to` render as <a>; kill the global anchor underline
  a {
    text-decoration: none !important;
  }
}

// active nav label reads in the link tint (design.md: active nav on dark).
// !important + nesting: HBtn's tertiary color is itself !important-ed.
.app-nav .app-nav__link--active {
  color: var(--color-text-link) !important;
}

.app-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-primary);
  text-decoration: none !important;
}

.app-logo__suffix {
  color: var(--color-text-tertiary);
  white-space: nowrap;
  // optical: the lockup's viewBox keeps descender room under the wordmark,
  // so pure flex centering leaves neighbor text riding high — nudge it down
  transform: translateY(2px);
}

.app-drawer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-sm);
  background: var(--color-bg-page);
  height: 100%;
}
</style>
