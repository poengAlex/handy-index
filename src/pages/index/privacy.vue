<template>
  <q-page class="privacy-page">
    <div class="h-section">
      <div class="h-container">
        <h1 class="text-h2 privacy-page__title">Privacy &amp; terms</h1>

        <div class="prose privacy-page__prose">
          <p class="text-body">
            IVDB is a catalog of videos that have Handy scripts, maintained by
            the Handy team (Ohdoki AS). This page explains what the site does
            with your data — the short version: as little as possible.
          </p>

          <h2 class="text-h5">What this site is</h2>
          <p class="text-body">
            The site lists scripted videos and links you to the scripts and to
            the partner sites that host the actual content. No videos are stored
            on our servers — only the scripts. Browsing is free for Handy users.
          </p>
          <p class="text-body">
            The site is built on the public script index API — feel free to use
            it for your own projects:
            <a
              href="https://scripts01.handyfeeling.com/api/script/index/v0/docs/"
              target="_blank"
              rel="noopener"
              >API documentation</a
            >. The site itself is open source for full transparency:
            <a
              href="https://github.com/poengAlex/handy-index"
              target="_blank"
              rel="noopener"
              >GitHub repository</a
            >.
          </p>

          <h2 class="text-h5">What stays in this browser</h2>
          <p class="text-body">
            There are no accounts, no cookies, and no analytics. Everything you
            set is stored only in this browser's local storage:
          </p>
          <ul class="text-body privacy-page__list">
            <li>your answer to the first-visit consent dialog</li>
            <li>the explicit previews (NSFW) setting</li>
            <li>the orientation filter</li>
            <li>your script and video access filters</li>
            <li>your favorites</li>
            <li>votes you've cast on video requests</li>
            <li>your Handy connection key</li>
          </ul>
          <p class="text-body">
            Open the site on another device — or clear your browser data — and
            these are gone; there is nothing to recover from a server. The flip
            side of having no analytics is that we can't see errors happen, so
            bug reports are extra welcome.
          </p>

          <h2 class="text-h5">Where the catalog comes from</h2>
          <p class="text-body">
            The catalog, its metadata, and the scripts are loaded from the
            handyfeeling.com script index API. When you download a script,
            submit a video request, or vote on one, your connection key is sent
            to that API as authorization — that is the only time something
            you've entered leaves your browser.
          </p>

          <h2 class="text-h5">Third-party sites</h2>
          <p class="text-body">
            Video pages link out to the partner sites that host the videos.
            Those are third-party adult sites with their own privacy policies
            and their own analytics — once you leave IVDB, their rules apply.
            When explicit previews are enabled, thumbnails load directly from
            the partner sites, so your browser makes requests their servers can
            log. If that concerns you, keep previews off or use a VPN.
          </p>

          <h2 class="text-h5">Age requirement</h2>
          <p class="text-body">
            This site indexes adult content and is for adults only. You must be
            18 or older — or the age of majority where you live — to use it.
          </p>

          <h2 class="text-h5">Changing your choices</h2>
          <p class="text-body">
            Nothing you chose in the first-visit dialog is final. Explicit
            previews, orientation, and the script and video access filters can
            be changed at any time from the settings dialog in the top bar.
          </p>

          <h2 class="text-h5">Contact</h2>
          <p class="text-body">
            Questions, bug reports, or takedown requests:
            <a href="mailto:alexander@ohdoki.com">alexander@ohdoki.com</a>
          </p>
        </div>

        <HBtn
          variant="tertiary"
          label="Back to home"
          to="/"
          class="privacy-page__back"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Static informational page — the consent modal owns acceptance, so this is
// documentation only: what the service is, what stays local, what leaves.
import { HBtn } from "@/components/handy";
</script>

<style scoped lang="scss">
.privacy-page__title {
  margin: 0;
}

.privacy-page__prose {
  margin-top: var(--space-lg);

  h2 {
    margin: var(--space-xl) 0 var(--space-sm);
  }

  p {
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-md);
  }

  a {
    color: var(--color-text-link);
    text-decoration: none;
    transition: text-decoration-color 180ms ease;
    text-decoration-color: transparent;

    &:hover {
      text-decoration: underline;
      text-decoration-color: currentColor;
    }
  }
}

.privacy-page__list {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-md);
  padding-left: var(--space-lg);

  li {
    margin-bottom: var(--space-xs);
  }
}

.privacy-page__back {
  margin-top: var(--space-lg);
}
</style>
