<template>
  <q-layout
    view="lHh Lpr lFf"
    class="app-shell"
    :class="{
      'app-shell--full-width': settings.fullWidth,
      'app-shell--bg': settings.background
    }"
  >
    <!-- decorative gradient field behind everything; the route watcher below
         speeds it up briefly on every page change -->
    <HandyBackground
      v-if="settings.background"
      :config="BACKGROUND_CONFIG"
      :speed="bgSpeed"
      :strength="bgStrength"
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

    <SettingsDialog v-model="settingsOpen" />
    <MutedTagsDialog v-model="mutedTagsOpen" />
    <ConsentDialog />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
import ConsentDialog from "@/components/ConsentDialog.vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import OrientationMenu from "@/components/OrientationMenu.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import { BACKGROUND_CONFIG } from "@/services/background-config";
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

// Navigating speeds the field up rather than restarting it. The morph tick
// reads its speed every frame and advances a running counter, so raising the
// speed mid-flight makes the same walk go faster — there is no reset and no
// seam, which a mount replay could not avoid. The burst decays back to the
// configured speed on an ease-out, so the field sprints and then settles
// rather than dropping back to slow in one step.
//
// Speed is the component's own unit (a cycle-length multiplier, 0.1-24).
// Resting comes from the config so retuning it there stays the one place
// that decides "normal"; the burst runs at the top of the range. Nothing
// downstream clamps a speed handed in as a prop, so 24 is the documented
// ceiling rather than an enforced one.
const BASE_SPEED = BACKGROUND_CONFIG.settings.motion.speed;
const BURST_SPEED = 24;

// The field also surges, not just accelerates. `strength` is its opacity;
// motion.amount would be the obvious knob for "more animation" and is the
// wrong one here — LensField only applies the per-blob animation for the
// perBlob presets (wave, blobs), so under morph the amount vars are written
// and never read. Opacity is what morph actually responds to.
const BASE_STRENGTH = BACKGROUND_CONFIG.settings.strength;
const BURST_STRENGTH = Math.min(1, BASE_STRENGTH * 1.75);

const BURST_MS = 1400;

const bgSpeed = ref(BASE_SPEED);
const bgStrength = ref(BASE_STRENGTH);
let burstRaf = 0;

function burstBackground() {
  cancelAnimationFrame(burstRaf);
  // morph is JS-driven, so it has no CSS rule for the global reduced-motion
  // override to catch — and LensField parks the loop entirely under it.
  // Driving the field at that point would spin a rAF against a stopped one.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const start = performance.now();
  bgSpeed.value = BURST_SPEED;
  bgStrength.value = BURST_STRENGTH;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / BURST_MS);
    // one eased 1->0 ramp drives both, so they always arrive together
    const p = (1 - t) ** 3;
    bgSpeed.value = BASE_SPEED + (BURST_SPEED - BASE_SPEED) * p;
    bgStrength.value = BASE_STRENGTH + (BURST_STRENGTH - BASE_STRENGTH) * p;
    burstRaf = t < 1 ? requestAnimationFrame(step) : 0;
  };
  burstRaf = requestAnimationFrame(step);
}

// Path only — a query or filter change is the same page.
watch(() => route.path, burstBackground);

onBeforeUnmount(() => cancelAnimationFrame(burstRaf));

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
