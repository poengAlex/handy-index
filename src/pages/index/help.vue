<template>
  <q-page class="help-page h-section">
    <div class="h-container">
      <header class="help-page__header">
        <h1 class="text-h2 help-page__title">Help</h1>
        <p class="text-body-sm help-page__lead">
          Everything this site can do, in one place. Rows with an arrow take you
          straight there.
        </p>
      </header>

      <div class="help-page__stack">
        <HList title="Finding videos">
          <HListRow
            icon="search"
            label="Search and filter"
            caption="Search titles, then narrow by tag, site, performer, VR and duration — every filter lives in the URL, so results are shareable"
            chevron
            to="/videos"
          />
          <HListRow
            icon="sort"
            label="Sort any way you like"
            caption="Recently added, top rated, most played and more — the arrow button next to the sort reverses the direction"
          />
          <HListRow
            icon="sell"
            label="Tag cloud"
            caption="Every tag in the catalog you haven't muted, searchable and sortable — one click filters the browse page"
            chevron
            to="/tags"
          />
          <HListRow
            icon="person"
            label="Performers"
            caption="Browse by performer, biggest filmography first"
            chevron
            to="/performers"
          />
          <HListRow
            icon="language"
            label="Sites"
            caption="Every partner site in the index with its video count"
            chevron
            to="/sites"
          />
        </HList>

        <HList title="Your library">
          <HListRow
            icon="favorite"
            label="Favorites"
            caption="Heart any video to keep it handy — stored on this device"
            chevron
            to="/favorites"
          />
          <HListRow
            icon="playlist_play"
            label="Playlists"
            caption="Create, rename and curate playlists of any videos"
            chevron
            to="/playlists"
          />
          <HListRow
            icon="ios_share"
            label="Share, import & export playlists"
            caption="Move a playlist as a file, as copyable JSON text, or as a temporary share link — and import from any of them"
          />
          <HListRow
            icon="download"
            label="Get all scripts at once"
            caption="One click on a playlist downloads every free script in it"
          />
          <HListRow
            icon="touch_app"
            label="Quick menu"
            caption="Right-click (or long-press) any video thumbnail for favorites, playlists, copy link and more"
          />
        </HList>

        <HList title="Scripts & your Handy">
          <HListRow
            icon="bolt"
            label="Free scripts"
            caption="Videos marked Free have a script you can download with your Handy connection key"
          />
          <HListRow
            icon="star"
            label="Rate scripts"
            caption="Star-rate any free script right on the video page"
          />
          <HListRow
            icon="chat_bubble"
            label="Script comments"
            caption="Read and post anonymous comments on scripts"
          />
          <HListRow
            icon="how_to_vote"
            label="Request videos"
            caption="Ask for a script for any video, and vote on what gets scripted next"
            chevron
            to="/requests"
          />
        </HList>

        <HList title="Make it yours">
          <HListRow
            icon="visibility"
            label="Explicit previews"
            caption="Off by default — turn artwork on in settings"
          />
          <HListRow
            icon="play_circle"
            label="Embedded players"
            caption="Off by default — watch Pornhub and xHamster videos right on the video page (playback doesn't sync with the Handy)"
          />
          <HListRow
            icon="filter_alt"
            label="Orientation, script & video filters"
            caption="Free or premium scripts, free or paid videos, and who's in them — in settings, or right in the browse filters"
          />
          <HListRow
            icon="block"
            label="Muted tags"
            caption="Mute a tag and every video carrying it drops out of the catalog — right-click any tag pill, or manage the list in settings"
          />
          <HListRow
            icon="dark_mode"
            label="Light & dark theme"
            caption="Toggle in the header — follows your choice everywhere"
          />
          <HListRow
            icon="share"
            label="Share"
            caption="Every video page and every filtered result list has a shareable link"
          />
        </HList>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// The feature tour: one page listing everything the site can do, grouped the
// way people use it. Reached from the settings dialog.
import { HList, HListRow } from "@/components/handy";
</script>

<style scoped lang="scss">
.help-page {
  padding-bottom: var(--space-3xl);
}

// one centered 720px column — header and lists share the same rail
.help-page__header {
  max-width: 720px;
  margin: 0 auto var(--space-md);
}

.help-page__title {
  margin: 0;
}

.help-page__lead {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.help-page__stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 720px;
  margin: 0 auto;
}
</style>
