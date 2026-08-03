<template>
  <q-layout view="lHh Lpr lFf" class="app-shell">
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
          aria-label="Menu"
          class="app-toolbar__btn"
          @click="drawer = !drawer"
        />
        <router-link to="/" class="app-logo" aria-label="IVDB home">
          <HLogo :height="22" :mark="$q.screen.xs" />
          <span class="text-body-compact app-logo__suffix">IVDB</span>
        </router-link>
        <nav v-if="!$q.screen.xs" class="app-nav" aria-label="Main">
          <HBtn
            v-for="link in NAV_LINKS"
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
          aria-label="Favorites"
          class="app-toolbar__btn"
          to="/favorites"
        />
        <q-btn
          flat
          round
          dense
          icon="tune"
          aria-label="Settings"
          class="app-toolbar__btn"
          @click="settingsOpen = true"
        />
        <HThemeToggle />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="left" overlay behavior="mobile" bordered>
      <div class="app-drawer">
        <HDrawerItem
          label="Home"
          icon="home"
          to="/"
          :active="route.path === '/'"
          @click="drawer = false"
        />
        <HDrawerItem
          v-for="link in NAV_LINKS"
          :key="link.to"
          :label="link.label"
          :icon="link.icon"
          :to="link.to"
          :active="isActive(link.to)"
          @click="drawer = false"
        />
        <HDrawerItem
          label="Favorites"
          icon="favorite"
          to="/favorites"
          :active="isActive('/favorites')"
          @click="drawer = false"
        />
        <HDrawerItem
          label="Privacy"
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
    <ConsentDialog />
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import {
  HBtn,
  HDrawerItem,
  HLogo,
  HThemeToggle,
  useGlassOnScroll,
  useHandyTheme
} from "@/components/handy";
import ConsentDialog from "@/components/ConsentDialog.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import { useCatalogStore } from "@/stores/catalog";

const NAV_LINKS = [
  { label: "Videos", to: "/videos", icon: "movie" },
  { label: "Tags", to: "/tags", icon: "sell" },
  { label: "Sites", to: "/sites", icon: "language" },
  { label: "Performers", to: "/performers", icon: "person" },
  { label: "Playlists", to: "/playlists", icon: "playlist_play" },
  { label: "Requests", to: "/requests", icon: "how_to_vote" }
];

const $q = useQuasar();
const route = useRoute();
const settingsOpen = ref(false);
const drawer = ref(false);
const { dark, apply, init } = useHandyTheme();
const { scrolled } = useGlassOnScroll();
const catalog = useCatalogStore();

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
  // Adult-context surface defaults to dark (design.md §5.11); the kit's
  // init() falls back to light when no choice is stored yet.
  if (localStorage.getItem("handy-theme") === null) {
    apply(true);
  } else {
    init();
  }
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

.app-toolbar {
  height: 64px;
  width: 100%;

  @media (max-width: 599px) {
    height: 56px;
  }
}

.app-toolbar__btn {
  color: var(--color-text-primary);
}

.app-nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-left: var(--space-md);
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
