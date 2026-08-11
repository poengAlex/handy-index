<template>
  <q-page class="video-page">
    <div v-if="state === 'loading'" class="video-page__loading">
      <HandyLoader />
    </div>

    <div v-else-if="state === 'missing'" class="h-section">
      <div class="h-container video-page__missing">
        <HEmptyState
          icon="videocam_off"
          title="Video not found"
          body="This video isn't in the index anymore, or the link is wrong."
          action-label="Back to home"
          @action="router.push('/')"
        />
      </div>
    </div>

    <template v-else-if="video">
      <!-- Media banner, same anatomy as the home hero -->
      <MediaHero
        size="md"
        :artwork="artworkOf(video)"
        :alt="video.title ?? 'Video'"
      >
        <h1 class="text-h2 video-page__title">{{ video.title }}</h1>
        <div class="video-page__chips">
          <HChip v-if="video.partnerName" :label="video.partnerName" />
          <HChip
            v-if="video.duration"
            icon="schedule"
            :label="formatDuration(video.duration)"
          />
          <HChip v-if="formatLabel" icon="view_in_ar" :label="formatLabel" />
          <HChip
            v-if="video.publishedAt"
            icon="calendar_today"
            :label="relativeTime(video.publishedAt)"
          />
          <HChip
            v-if="!expectFree"
            icon="workspace_premium"
            label="Premium script"
          />
        </div>
      </MediaHero>

      <div class="h-container video-page__body">
        <div class="video-page__actions">
          <HBtn
            v-if="expectFree"
            label="Get script"
            arrow
            :loading="gettingScript"
            @click="getScript"
          />
          <HBtn
            v-else-if="video.videoUrl"
            :label="`Watch on ${video.partnerName ?? 'site'}`"
            arrow
            @click="openOnSite"
          />
          <HBtn
            v-if="expectFree && video.videoUrl"
            variant="secondary"
            :label="`Watch on ${video.partnerName ?? 'site'}`"
            @click="openOnSite"
          />
          <q-btn
            flat
            round
            icon="favorite"
            :class="[
              'video-page__fav',
              { 'video-page__fav--active': favorite }
            ]"
            :aria-label="
              favorite ? 'Remove from favorites' : 'Add to favorites'
            "
            @click="settings.toggleFavorite(video.partnerVideoId)"
          />
          <q-btn
            flat
            round
            icon="share"
            class="video-page__action"
            aria-label="Share"
            @click="share"
          />
          <q-btn
            flat
            round
            icon="playlist_add"
            class="video-page__action"
            aria-label="Add to playlist"
            @click="playlistDialog = true"
          />
        </div>
        <p v-if="!expectFree" class="text-body-sm video-page__premium-note">
          The script for this video is premium — it comes with the video on the
          partner site.
        </p>

        <!-- Embedded partner player — opt-in via settings, default off -->
        <section
          v-if="settings.inlinePlayers && embedUrl"
          class="video-page__player"
        >
          <div class="video-page__player-frame">
            <iframe
              :src="embedUrl"
              :title="video.title ?? 'Video player'"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              class="video-page__player-iframe"
            />
          </div>
          <p class="text-body-sm video-page__player-note">
            <q-icon name="info" size="16px" />
            The Handy doesn't sync with playback here on IVDB — this player is
            video-only. Download the script and play it through your Handy setup
            for synced strokes.
          </p>
        </section>

        <div class="video-page__columns">
          <div>
            <div v-if="video.performers?.length" class="video-page__performers">
              <router-link
                v-for="performer in video.performers"
                :key="performer.performerId"
                :to="performerLink(performer)"
                class="video-page__performer"
              >
                <MediaImage
                  v-if="settings.nsfw && performer.avatar"
                  :src="performer.avatar"
                  error-icon="person"
                  icon-size="16px"
                  class="video-page__performer-avatar"
                />
                <span v-else class="video-page__performer-fallback">
                  <q-icon name="person" size="16px" />
                </span>
                <span class="text-body-compact">{{ performer.name }}</span>
              </router-link>
            </div>
            <p
              v-if="video.description"
              class="text-body prose video-page__description"
            >
              {{ video.description }}
            </p>
            <!-- A muted tag's browse link is a guaranteed zero-result page,
                 so it renders as an unmute button instead of a link. The word
                 stays visible: hiding it would hide the explanation. -->
            <div v-if="video.tags?.length" class="video-page__tags">
              <template v-for="tag in video.tags" :key="tag">
                <button
                  v-if="settings.isMuted(tag)"
                  type="button"
                  class="video-page__tag-muted"
                  :aria-label="`Unmute tag: ${tag}`"
                  :title="`“${tag}” is muted — click to unmute`"
                  @click="unmute(tag)"
                >
                  <HChip icon="volume_off" :label="tag" />
                </button>
                <router-link
                  v-else
                  :to="`/videos?tag=${encodeURIComponent(tag)}`"
                  class="video-page__tag-link"
                >
                  <HChip :label="tag" />
                  <q-menu context-menu touch-position>
                    <q-list dense class="video-page__tag-menu">
                      <q-item
                        v-close-popup
                        clickable
                        :to="`/videos?tag=${encodeURIComponent(tag)}`"
                      >
                        <q-item-section side>
                          <q-icon name="sell" size="20px" />
                        </q-item-section>
                        <q-item-section>Browse this tag</q-item-section>
                      </q-item>
                      <q-item v-close-popup clickable @click="mute(tag)">
                        <q-item-section side>
                          <q-icon name="block" size="20px" />
                        </q-item-section>
                        <q-item-section>Mute this tag</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </router-link>
              </template>
            </div>
          </div>
          <div class="video-page__side">
            <HInfoCard title="Details" :items="details" />
            <div v-if="freeScript" class="video-page__rate">
              <h2 class="text-h5 video-page__rate-title">Rate this script</h2>
              <q-rating
                :model-value="settings.getScriptVote(freeScript.scriptId)"
                :max="5"
                icon="star"
                size="28px"
                :disable="ratingBusy"
                aria-label="Rate this script"
                @update:model-value="rate"
              />
              <p
                v-if="freeScript.rating"
                class="text-body-sm video-page__rate-community"
              >
                Community: {{ Math.round(freeScript.rating) }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stills gallery — only when explicit previews are on -->
      <section v-if="gallery.length" class="video-page__gallery">
        <div class="h-container">
          <h2 class="text-h4 video-page__gallery-title">Photos</h2>
        </div>
        <HPeekCarousel :items="gallery" item-width="clamp(220px, 60vw, 320px)">
          <template #default="{ item, index }">
            <button
              type="button"
              class="video-page__gallery-tile"
              :aria-label="`Open photo ${index + 1} of ${gallery.length}`"
              @click="viewerIndex = index"
            >
              <img
                :src="item"
                :alt="`Still ${index + 1} from ${video.title ?? 'video'}`"
                loading="lazy"
                class="video-page__gallery-img"
                @error="brokenStills.add(item)"
              />
            </button>
          </template>
        </HPeekCarousel>
      </section>

      <!-- Script comments — anonymous, and key-gated even for reading -->
      <section v-if="freeScript" class="video-page__comments">
        <div class="h-container">
          <h2 class="text-h4 video-page__comments-title">Comments</h2>

          <div v-if="!hasKey" class="video-page__comments-gate">
            <span class="text-body-sm video-page__comments-hint">
              Comments need your connection key.
            </span>
            <HBtn
              variant="tertiary"
              label="Add key"
              @click="openKeyDialogForComments"
            />
          </div>

          <template v-else>
            <div class="video-page__comment-form">
              <q-input
                :model-value="commentDraft"
                filled
                dense
                label="Add a comment"
                maxlength="500"
                class="video-page__comment-input"
                @update:model-value="commentDraft = String($event ?? '')"
                @keyup.enter="submitComment"
              />
              <HBtn
                variant="secondary"
                label="Comment"
                :loading="postingComment"
                :disable="!commentDraft.trim()"
                @click="submitComment"
              />
            </div>

            <div
              v-if="commentsState === 'loading' || commentsState === 'idle'"
              class="video-page__comments-loading"
            >
              <HandyLoader :size="32" />
            </div>
            <p
              v-else-if="commentsState === 'error'"
              class="text-body-sm video-page__comments-hint"
            >
              Couldn't load comments.
            </p>
            <p
              v-else-if="!comments.length"
              class="text-body-sm video-page__comments-hint"
            >
              No comments yet — be the first.
            </p>
            <ul v-else class="video-page__comment-list">
              <li
                v-for="comment in comments"
                :key="comment.commentId"
                class="video-page__comment"
              >
                <p class="text-body video-page__comment-message">
                  {{ comment.message }}
                </p>
                <p
                  v-if="comment.createdAt"
                  class="text-caption video-page__comment-time"
                >
                  {{ relativeTime(comment.createdAt) }}
                </p>
              </li>
            </ul>
          </template>
        </div>
      </section>

      <div v-if="related.length" class="video-page__more">
        <CarouselRow title="More like this" :videos="related" />
      </div>

      <div v-if="moreFromPartner.length" class="video-page__more">
        <CarouselRow
          :title="`More from ${video.partnerName ?? 'this site'}`"
          :videos="moreFromPartner"
          :to="`/videos?partnerId=${encodeURIComponent(video.partnerId)}`"
        />
      </div>
    </template>

    <!-- Full-size photo viewer -->
    <q-dialog
      :model-value="viewerIndex !== null"
      @update:model-value="viewerIndex = null"
    >
      <div v-if="viewerImage" class="video-page__viewer">
        <img
          :src="viewerImage"
          :alt="`Still ${(viewerIndex ?? 0) + 1} from ${video?.title ?? 'video'}`"
          class="video-page__viewer-img"
        />
        <div class="video-page__viewer-bar">
          <q-btn
            flat
            round
            icon="chevron_left"
            :disable="(viewerIndex ?? 0) === 0"
            aria-label="Previous photo"
            @click="viewerIndex = (viewerIndex ?? 0) - 1"
          />
          <span class="text-body-sm video-page__viewer-count">
            {{ (viewerIndex ?? 0) + 1 }} / {{ gallery.length }}
          </span>
          <q-btn
            flat
            round
            icon="chevron_right"
            :disable="(viewerIndex ?? 0) >= gallery.length - 1"
            aria-label="Next photo"
            @click="viewerIndex = (viewerIndex ?? 0) + 1"
          />
          <q-btn
            v-close-popup
            flat
            round
            icon="close"
            aria-label="Close viewer"
          />
        </div>
      </div>
    </q-dialog>

    <!-- Connection key prompt for the script download -->
    <ConnectionKeyDialog v-model="keyDialog" @saved="getScript">
      Scripts are bound to your Handy. Enter the connection key from the Handy
      app to continue.
    </ConnectionKeyDialog>

    <!-- Connection key prompt for rating and comments -->
    <ConnectionKeyDialog v-model="actionKeyDialog" @saved="runPendingAction">
      Rating and comments are bound to your Handy. Enter the connection key from
      the Handy app to continue.
    </ConnectionKeyDialog>

    <AddToPlaylistDialog
      v-if="video"
      v-model="playlistDialog"
      :video-id="video.partnerVideoId"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  HBtn,
  HChip,
  HEmptyState,
  HInfoCard,
  HPeekCarousel,
  HandyLoader,
  hToast
} from "@/components/handy";
import type { InfoItem } from "@/components/handy/HInfoCard.vue";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog.vue";
import CarouselRow from "@/components/CarouselRow.vue";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import MediaHero from "@/components/MediaHero.vue";
import MediaImage from "@/components/MediaImage.vue";
import { formatDuration, relativeTime } from "@/services/format";
import {
  getPublishedComments,
  getScriptTokenUrl,
  getVideo,
  getVideoScripts,
  isAuthError,
  postScriptComment,
  rateScript
} from "@/services/script-index/client";
import {
  artworkOf,
  byPartner,
  embedUrlOf,
  recentFirst,
  relatedTo
} from "@/services/script-index/queries";
import type {
  PartnerVideo,
  Performer,
  Script,
  ScriptComment
} from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const route = useRoute("//videos/[partnerVideoId]");
const router = useRouter();
const catalog = useCatalogStore();
const settings = useSettingsStore();

const video = ref<PartnerVideo>();
const scripts = ref<Script[]>([]);
const state = ref<"loading" | "ready" | "missing">("loading");
const gettingScript = ref(false);
const keyDialog = ref(false);
const playlistDialog = ref(false);

// key prompt shared by rating + comments; resumes the interrupted action
const actionKeyDialog = ref(false);
const pendingAction = ref<(() => void) | null>(null);

const ratingBusy = ref(false);

// script comments — key-gated even for reading
const comments = ref<ScriptComment[]>([]);
const commentsState = ref<"idle" | "loading" | "ready" | "error">("idle");
const commentDraft = ref("");
const postingComment = ref(false);

// stills gallery + full-size viewer (broken stills drop out of the gallery
// entirely — a strip of error tiles would be worse than no strip)
const brokenStills = ref(new Set<string>());
const viewerIndex = ref<number | null>(null);

const gallery = computed(() => {
  if (!settings.nsfw) return [];
  return (video.value?.images ?? []).filter(
    still => !brokenStills.value.has(still)
  );
});

const viewerImage = computed(() =>
  viewerIndex.value === null ? undefined : gallery.value[viewerIndex.value]
);

const videoId = computed(() => route.params.partnerVideoId);

const favorite = computed(() =>
  video.value ? settings.isFavorite(video.value.partnerVideoId) : false
);

const embedUrl = computed(() =>
  video.value ? embedUrlOf(video.value) : undefined
);

const formatLabel = computed(() => {
  const format = video.value?.format;
  if (format?.format !== "vr") return "";
  const view = format.view && format.view !== "na" ? ` ${format.view}°` : "";
  return `VR${view}`;
});

/** The index's own free-script indicator — drives the CTA without waiting
 * for (or depending on) the scripts fetch. */
const expectFree = computed(() => video.value?.scriptAccess === "public");

const freeScript = computed(() =>
  scripts.value.find(script => script.access === "public")
);

const hasKey = computed(() => settings.connectionKey.trim().length > 0);

const details = computed<InfoItem[]>(() => {
  const current = video.value;
  if (!current) return [];
  const items: InfoItem[] = [
    {
      label: "Script",
      badge: expectFree.value ? "Free" : "Premium",
      badgeColor: expectFree.value ? "positive" : "primary"
    }
  ];
  if (current.publishedAt) {
    items.push({
      label: "Published",
      value: relativeTime(current.publishedAt)
    });
  }
  if (current.duration) {
    items.push({ label: "Duration", value: formatDuration(current.duration) });
  }
  items.push({
    label: "Format",
    value: formatLabel.value || "Flat"
  });
  if (current.partnerName) {
    items.push({ label: "Site", value: current.partnerName });
  }
  if (current.scripterName) {
    items.push({ label: "Script by", value: current.scripterName });
  }
  if (current.rating) {
    const votes = (current.upVotes ?? 0) + (current.downVotes ?? 0);
    items.push({
      label: "Rating",
      value: votes
        ? `${Math.round(current.rating)}% · ${votes.toLocaleString()} vote${votes === 1 ? "" : "s"}`
        : `${Math.round(current.rating)}%`
    });
  }
  if (current.scriptPlays) {
    items.push({
      label: "Script plays",
      value: current.scriptPlays.toLocaleString()
    });
  }
  return items;
});

const related = computed(() => {
  const current = video.value;
  if (!current || catalog.status !== "ready") return [];
  return relatedTo(catalog.visible, current, 20);
});

const moreFromPartner = computed(() => {
  const current = video.value;
  if (!current || catalog.status !== "ready") return [];
  return recentFirst(byPartner(catalog.visible, current.partnerId))
    .filter(item => item.partnerVideoId !== current.partnerVideoId)
    .slice(0, 20);
});

// The component is reused across /videos/A → /videos/B navigation, so every
// await checks the route hasn't moved on before writing state.
async function load(id: string) {
  state.value = "loading";
  scripts.value = [];
  brokenStills.value = new Set();
  viewerIndex.value = null;
  comments.value = [];
  commentsState.value = "idle";
  commentDraft.value = "";
  pendingAction.value = null;
  const fromCatalog = catalog.videos.find(item => item.partnerVideoId === id);
  if (fromCatalog) {
    video.value = fromCatalog;
    state.value = "ready";
  } else {
    try {
      const fetched = await getVideo(id);
      if (videoId.value !== id) return;
      video.value = fetched;
      state.value = "ready";
    } catch {
      if (videoId.value !== id) return;
      state.value = "missing";
      return;
    }
  }
  settings.recordView(id);
  try {
    const list = await getVideoScripts(id);
    if (videoId.value !== id) return;
    scripts.value = list;
  } catch {
    // no script list yet: getScript() refetches on demand
  }
}

watch(
  videoId,
  id => {
    if (id) void load(id);
  },
  { immediate: true }
);

// a hard refresh can 404 on getVideo while the catalog snapshot is still
// downloading — retry the lookup once it lands
watch(
  () => catalog.status,
  status => {
    if (status === "ready" && state.value === "missing" && videoId.value) {
      void load(videoId.value);
    }
  }
);

function openOnSite() {
  if (video.value?.videoUrl) {
    window.open(video.value.videoUrl, "_blank", "noopener");
  }
}

async function getScript() {
  const current = video.value;
  if (!current) return;
  const key = settings.connectionKey.trim();
  if (!key) {
    keyDialog.value = true;
    return;
  }
  gettingScript.value = true;
  // open the tab synchronously with the click — popup blockers kill a
  // window.open that fires after the token request resolves
  const scriptWindow = window.open("", "_blank");
  try {
    if (!freeScript.value) {
      scripts.value = await getVideoScripts(current.partnerVideoId);
    }
    const script = freeScript.value;
    if (!script) throw new Error("no free script listed");
    const token = await getScriptTokenUrl(
      current.partnerVideoId,
      script.scriptId,
      key
    );
    if (scriptWindow) {
      scriptWindow.location.href = token.url;
    } else {
      window.open(token.url, "_blank", "noopener");
    }
    hToast("positive", "Script ready", "The download opened in a new tab.");
  } catch {
    scriptWindow?.close();
    hToast(
      "negative",
      "Couldn't get the script",
      "Check your connection key and try again."
    );
  } finally {
    gettingScript.value = false;
  }
}

function mute(tag: string) {
  // a refusal is always an orientation tag here: a muted tag already renders
  // as an unmute button, so the mute item isn't offered for it
  if (!settings.muteTag(tag)) {
    hToast(
      "info",
      `“${tag}” can't be muted`,
      "Orientation tags decide which catalog you see — change that in settings."
    );
    return;
  }
  hToast(
    "info",
    `Muted “${tag}”`,
    "It's in your muted list — unmute any time."
  );
}

function unmute(tag: string) {
  settings.unmuteTag(tag);
  hToast("info", `Unmuted “${tag}”`);
}

function performerLink(performer: Performer): string {
  const id = encodeURIComponent(performer.performerId);
  const name = encodeURIComponent(performer.name);
  return `/videos?performerId=${id}&performerName=${name}`;
}

async function share() {
  const url = window.location.href;
  // real share sheet where the platform has one; clipboard elsewhere
  if (navigator.share) {
    try {
      await navigator.share({ title: video.value?.title ?? "IVDB", url });
    } catch {
      // user dismissed the sheet — not an error
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    hToast("positive", "Link copied");
  } catch {
    hToast("negative", "Couldn't copy the link");
  }
}

/** Resumes whatever rating/comment action the key prompt interrupted. */
function runPendingAction() {
  const action = pendingAction.value;
  pendingAction.value = null;
  action?.();
}

/** The comments gate only needs the key saved — the [freeScript, hasKey]
 * watch does the fetch. Clearing pendingAction here keeps an action the
 * user abandoned at the key prompt from firing on this unrelated save. */
function openKeyDialogForComments() {
  pendingAction.value = null;
  actionKeyDialog.value = true;
}

// dismissing the key prompt without saving abandons the interrupted action
// (saved fires synchronously on save, before this watcher's flush, so a
// legitimate resume has already run by the time we clear)
watch(actionKeyDialog, open => {
  if (!open) pendingAction.value = null;
});

async function rate(stars: number) {
  const current = video.value;
  const script = freeScript.value;
  if (!current || !script || stars < 1) return;
  const key = settings.connectionKey.trim();
  if (!key) {
    pendingAction.value = () => void rate(stars);
    actionKeyDialog.value = true;
    return;
  }
  ratingBusy.value = true;
  try {
    await rateScript(current.partnerVideoId, script.scriptId, stars * 20, key);
    settings.setScriptVote(script.scriptId, stars);
    hToast("positive", "Thanks for rating this script");
  } catch (error) {
    if (isAuthError(error)) {
      pendingAction.value = () => void rate(stars);
      actionKeyDialog.value = true;
    } else {
      hToast("negative", "Couldn't save your rating");
    }
  } finally {
    ratingBusy.value = false;
  }
}

async function loadComments() {
  const current = video.value;
  const script = freeScript.value;
  const key = settings.connectionKey.trim();
  if (!current || !script || !key) return;
  const id = current.partnerVideoId;
  commentsState.value = "loading";
  try {
    const list = await getPublishedComments(id, script.scriptId, key);
    if (videoId.value !== id) return;
    comments.value = list;
    commentsState.value = "ready";
  } catch {
    if (videoId.value !== id) return;
    // page state only — one signal per failure, same as the catalog error
    commentsState.value = "error";
  }
}

// comments need the key even to read — fetch once both the free script and
// a key exist (also picks up a key saved through the "Add key" gate)
watch(
  [freeScript, hasKey],
  () => {
    if (freeScript.value && hasKey.value && commentsState.value === "idle") {
      void loadComments();
    }
  },
  { immediate: true }
);

async function submitComment() {
  const current = video.value;
  const script = freeScript.value;
  const message = commentDraft.value.trim();
  if (!current || !script || !message || postingComment.value) return;
  const key = settings.connectionKey.trim();
  if (!key) {
    pendingAction.value = () => void submitComment();
    actionKeyDialog.value = true;
    return;
  }
  postingComment.value = true;
  try {
    await postScriptComment(
      current.partnerVideoId,
      script.scriptId,
      message,
      key
    );
    // not appended locally — new comments start unpublished
    commentDraft.value = "";
    hToast(
      "positive",
      "Comment submitted",
      "It shows up once it passes review."
    );
  } catch (error) {
    if (isAuthError(error)) {
      pendingAction.value = () => void submitComment();
      actionKeyDialog.value = true;
    } else {
      hToast("negative", "Couldn't post your comment");
    }
  } finally {
    postingComment.value = false;
  }
}
</script>

<style scoped lang="scss">
.video-page {
  padding-bottom: var(--space-3xl);
}

.video-page__loading {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-page__missing {
  display: flex;
  justify-content: center;
}

.video-page__title {
  margin: 0;
  max-width: 30ch;
}

.video-page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.video-page__body {
  padding-top: var(--space-lg);
}

.video-page__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.video-page__fav {
  color: var(--color-text-secondary);
}

// link tint, not raw Brand Blue — the fill token fails contrast on dark
.video-page__fav--active {
  color: var(--color-text-link);
}

.video-page__action {
  color: var(--color-text-secondary);
}

.video-page__premium-note {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.video-page__player {
  margin-top: var(--space-lg);
  max-width: 960px;
}

.video-page__player-frame {
  aspect-ratio: 16 / 9;
  background: var(--color-bg-page-alt);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.video-page__player-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-page__player-note {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.video-page__performers {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

// pill link on the card surface; hover = the hairline ring on both themes
.video-page__performer {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm) var(--space-xs) var(--space-xs);
  // chip contract: a pill never shares its background with the surface
  // behind it (bg-card equals the page surface in light theme)
  background: var(--h-chip-bg);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  text-decoration: none !important;
  transition: box-shadow 180ms ease;

  &:hover {
    box-shadow: 0 0 0 1px var(--color-stroke-default);
  }
}

.video-page__performer-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  flex: none;
}

.video-page__performer-fallback {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  // page surface so the well reads inside the page-alt pill on both themes
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.video-page__columns {
  display: grid;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
}

.video-page__description {
  color: var(--color-text-secondary);
  margin: 0;
}

.video-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-md);
}

.video-page__tag-link {
  text-decoration: none !important;
}

// naked button around the chip, same recipe as the browse filter chips
.video-page__tag-muted {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-full);
  opacity: 0.6;
  transition: opacity 180ms ease;

  &:hover {
    opacity: 1;
  }
}

.video-page__side {
  display: grid;
  gap: var(--space-md);
}

.video-page__rate {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);

  // link tint, not raw Brand Blue — the fill token fails contrast on dark
  // (same treatment as the active favorite heart)
  :deep(.q-rating__icon) {
    color: var(--color-stroke-strong);
  }

  :deep(.q-rating__icon--active) {
    color: var(--color-text-link);
  }
}

.video-page__rate-title {
  margin: 0 0 var(--space-xs);
}

.video-page__rate-community {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.video-page__comments {
  margin-top: var(--space-xl);
}

.video-page__comments-title {
  margin: 0 0 var(--space-sm);
}

.video-page__comments-gate {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.video-page__comments-hint {
  color: var(--color-text-tertiary);
  margin: 0;
}

.video-page__comments-loading {
  display: flex;
  justify-content: center;
  padding: var(--space-lg) 0;
}

.video-page__comment-form {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  max-width: 680px;
  margin-bottom: var(--space-md);
}

.video-page__comment-input {
  flex: 1;
}

.video-page__comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-sm);
}

.video-page__comment {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  max-width: 680px;
}

.video-page__comment-message {
  margin: 0;
  overflow-wrap: anywhere;
}

.video-page__comment-time {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.video-page__more {
  margin-top: var(--space-xl);
}

.video-page__gallery {
  margin-top: var(--space-xl);
}

.video-page__gallery-title {
  margin: 0 0 var(--space-sm);
}

// bare button wrapper so the whole still is the tap target
.video-page__gallery-tile {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: var(--color-bg-page-alt);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16 / 10;
  position: relative;
  transition: box-shadow 180ms ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.video-page__gallery-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-page__viewer {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  max-width: min(1100px, 94vw);
  box-shadow: var(--shadow-xl);
}

.video-page__viewer-img {
  display: block;
  max-width: 100%;
  max-height: 76vh;
  border-radius: var(--radius-sm);
  margin: 0 auto;
}

.video-page__viewer-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  color: var(--color-text-secondary);
}

.video-page__viewer-count {
  min-width: 56px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
</style>

<style lang="scss">
// dark hover: hairline ring, not shadow (same rule as the cards)
[data-theme="dark"] .video-page__gallery-tile:hover,
.section-dark .video-page__gallery-tile:hover {
  box-shadow: 0 0 0 1px var(--color-stroke-default);
}

// unscoped — the menu teleports to the body, outside this page's scope
.video-page__tag-menu {
  min-width: 200px;
  font-family: var(--font-brand);
}
</style>
