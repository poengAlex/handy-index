<template>
  <q-page class="help-page h-section">
    <div class="h-container">
      <header class="help-page__header">
        <h1 class="text-h2 help-page__title">{{ $t("help.title") }}</h1>
        <p class="text-body-sm help-page__lead">{{ $t("help.lead") }}</p>
      </header>

      <div class="help-page__stack">
        <HList :title="$t('help.finding.title')">
          <HListRow
            icon="search"
            :label="$t('help.finding.search.label')"
            :caption="$t('help.finding.search.caption')"
            chevron
            to="/videos"
          />
          <HListRow
            icon="sort"
            :label="$t('help.finding.sort.label')"
            :caption="$t('help.finding.sort.caption')"
          />
          <HListRow
            icon="sell"
            :label="$t('help.finding.tags.label')"
            :caption="$t('help.finding.tags.caption')"
            chevron
            to="/tags"
          />
          <HListRow
            icon="person"
            :label="$t('help.finding.performers.label')"
            :caption="$t('help.finding.performers.caption')"
            chevron
            to="/performers"
          />
          <HListRow
            icon="language"
            :label="$t('help.finding.sites.label')"
            :caption="$t('help.finding.sites.caption')"
            chevron
            to="/sites"
          />
        </HList>

        <HList :title="$t('help.library.title')">
          <HListRow
            icon="favorite"
            :label="$t('help.library.favorites.label')"
            :caption="$t('help.library.favorites.caption')"
            chevron
            to="/favorites"
          />
          <HListRow
            icon="playlist_play"
            :label="$t('help.library.playlists.label')"
            :caption="$t('help.library.playlists.caption')"
            chevron
            to="/playlists"
          />
          <HListRow
            icon="ios_share"
            :label="$t('help.library.transfer.label')"
            :caption="$t('help.library.transfer.caption')"
          />
          <HListRow
            icon="download"
            :label="$t('help.library.bulkDownload.label')"
            :caption="$t('help.library.bulkDownload.caption')"
          />
          <HListRow
            icon="touch_app"
            :label="$t('help.library.quickMenu.label')"
            :caption="$t('help.library.quickMenu.caption')"
          />
        </HList>

        <HList :title="$t('help.scripts.title')">
          <HListRow
            icon="bolt"
            :label="$t('help.scripts.free.label')"
            :caption="$t('help.scripts.free.caption')"
          />
          <HListRow
            icon="star"
            :label="$t('help.scripts.rate.label')"
            :caption="$t('help.scripts.rate.caption')"
          />
          <HListRow
            icon="chat_bubble"
            :label="$t('help.scripts.comments.label')"
            :caption="$t('help.scripts.comments.caption')"
          />
          <HListRow
            icon="how_to_vote"
            :label="$t('help.scripts.requests.label')"
            :caption="$t('help.scripts.requests.caption')"
            chevron
            to="/requests"
          />
        </HList>

        <HList :title="$t('help.personalize.title')">
          <HListRow
            icon="visibility"
            :label="$t('help.personalize.previews.label')"
            :caption="$t('help.personalize.previews.caption')"
          />
          <HListRow
            icon="play_circle"
            :label="$t('help.personalize.players.label')"
            :caption="$t('help.personalize.players.caption')"
          />
          <HListRow
            icon="filter_alt"
            :label="$t('help.personalize.filters.label')"
            :caption="$t('help.personalize.filters.caption')"
          />
          <HListRow
            icon="block"
            :label="$t('help.personalize.mutedTags.label')"
            :caption="$t('help.personalize.mutedTags.caption')"
          />
          <HListRow
            icon="dark_mode"
            :label="$t('help.personalize.theme.label')"
            :caption="$t('help.personalize.theme.caption')"
          />
          <HListRow
            icon="share"
            :label="$t('help.personalize.share.label')"
            :caption="$t('help.personalize.share.caption')"
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
