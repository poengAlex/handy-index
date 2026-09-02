<template>
  <q-page class="video-page">
    <div v-if="state === 'loading'" class="video-page__loading">
      <HandyLoader />
    </div>

    <div v-else-if="state === 'missing'" class="h-section">
      <div class="h-container video-page__missing">
        <HEmptyState
          icon="videocam_off"
          :title="$t('video.missingTitle')"
          :body="$t('video.missingBody')"
          :action-label="$t('common.action.backToHome')"
          @action="router.push('/')"
        />
      </div>
    </div>

    <template v-else-if="video">
      <!-- Media banner, same anatomy as the home hero -->
      <MediaHero
        size="md"
        :artwork="artworkOf(video)"
        :alt="video.title ?? $t('video.fallback.video')"
      >
        <h1 class="text-h2 video-page__title">{{ video.title }}</h1>
        <div class="video-page__chips">
          <HChip v-if="video.partnerName" :label="video.partnerName" />
          <HChip
            v-if="video.duration"
            icon="schedule"
            :label="format.duration(video.duration)"
          />
          <HChip v-if="formatLabel" icon="view_in_ar" :label="formatLabel" />
          <HChip
            v-if="video.publishedAt"
            icon="calendar_today"
            :label="format.relative(video.publishedAt)"
          />
          <HChip
            v-if="!expectFree"
            icon="workspace_premium"
            :label="$t('video.hero.premiumChip')"
          />
        </div>
      </MediaHero>

      <div class="h-container video-page__body">
        <div class="video-page__actions">
          <HBtn
            v-if="expectFree"
            :label="$t('video.action.getScript')"
            arrow
            :loading="gettingScript"
            @click="getScript"
          />
          <HBtn
            v-else-if="video.videoUrl"
            :label="watchLabel"
            arrow
            @click="openOnSite"
          />
          <HBtn
            v-if="expectFree && video.videoUrl"
            variant="secondary"
            :label="watchLabel"
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
              favorite
                ? $t('video.action.removeFavorite')
                : $t('video.action.addFavorite')
            "
            @click="settings.toggleFavorite(video.partnerVideoId)"
          />
          <q-btn
            flat
            round
            icon="share"
            class="video-page__action"
            :aria-label="$t('common.action.share')"
            @click="share"
          />
          <q-btn
            flat
            round
            icon="playlist_add"
            class="video-page__action"
            :aria-label="$t('video.action.addToPlaylist')"
            @click="playlistDialog = true"
          />
          <q-btn
            flat
            round
            icon="flag"
            class="video-page__action"
            :aria-label="$t('video.action.report')"
            :href="reportMailto"
          />
        </div>
        <p v-if="!expectFree" class="text-body-sm video-page__premium-note">
          {{ $t("video.premiumNote") }}
        </p>

        <!-- Embedded partner player — opt-in via settings, default off -->
        <section
          v-if="settings.inlinePlayers && embedUrl"
          class="video-page__player"
        >
          <div class="video-page__player-frame">
            <iframe
              :src="embedUrl"
              :title="video.title ?? $t('video.fallback.player')"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              class="video-page__player-iframe"
            />
          </div>
          <p class="text-body-sm video-page__player-note">
            <q-icon name="info" size="16px" />
            {{ $t("video.playerNote") }}
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
                  :aria-label="$t('video.tag.unmuteAria', { tag })"
                  :title="$t('video.tag.mutedTitle', { tag })"
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
                        <q-item-section>
                          {{ $t("video.tag.browse") }}
                        </q-item-section>
                      </q-item>
                      <q-item v-close-popup clickable @click="mute(tag)">
                        <q-item-section side>
                          <q-icon name="block" size="20px" />
                        </q-item-section>
                        <q-item-section>
                          {{ $t("video.tag.mute") }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </router-link>
              </template>
            </div>
          </div>
          <div class="video-page__side">
            <HInfoCard :title="$t('video.details.title')" :items="details" />
            <div v-if="freeScript" class="video-page__rate">
              <h2 class="text-h5 video-page__rate-title">
                {{ $t("video.rate.title") }}
              </h2>
              <q-rating
                :model-value="settings.getScriptVote(freeScript.scriptId)"
                :max="5"
                icon="star"
                size="28px"
                :disable="ratingBusy"
                :aria-label="$t('video.rate.title')"
                @update:model-value="rate"
              />
              <p
                v-if="freeScript.rating"
                class="text-body-sm video-page__rate-community"
              >
                {{
                  $t("video.rate.community", {
                    percent: $n(Math.round(freeScript.rating))
                  })
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stills gallery — only when explicit previews are on. The partner
           roll clip, when there is one, rides at the front of the strip and
           plays on its own; the rest are stills. -->
      <section v-if="gallery.length" class="video-page__gallery">
        <div class="h-container">
          <h2 class="text-h4 video-page__gallery-title">{{ galleryTitle }}</h2>
        </div>
        <HPeekCarousel :items="gallery" item-width="clamp(220px, 60vw, 320px)">
          <template #default="{ item, index }">
            <button
              type="button"
              class="video-page__gallery-tile"
              :aria-label="galleryLabel(item, index)"
              @click="viewerIndex = index"
            >
              <video
                v-if="item.clip"
                :src="item.src"
                :poster="artworkOf(video) || undefined"
                class="video-page__gallery-img"
                muted
                loop
                autoplay
                playsinline
                preload="auto"
                disablepictureinpicture
                @error="brokenClip = item.src"
              />
              <img
                v-else
                :src="item.src"
                :alt="stillAlt(index)"
                loading="lazy"
                class="video-page__gallery-img"
                @error="brokenStills.add(item.src)"
              />
              <span v-if="item.clip" class="video-page__gallery-badge">
                <q-icon name="play_arrow" size="16px" />
                {{ $t("video.gallery.previewBadge") }}
              </span>
            </button>
          </template>
        </HPeekCarousel>
      </section>

      <!-- Script comments — anonymous, and key-gated even for reading -->
      <section v-if="freeScript" class="video-page__comments">
        <div class="h-container">
          <h2 class="text-h4 video-page__comments-title">
            {{ $t("video.comments.title") }}
          </h2>

          <div v-if="!hasKey" class="video-page__comments-gate">
            <span class="text-body-sm video-page__comments-hint">
              {{ $t("video.comments.gateHint") }}
            </span>
            <HBtn
              variant="tertiary"
              :label="$t('video.comments.gateAction')"
              @click="openKeyDialogForComments"
            />
          </div>

          <template v-else>
            <div class="video-page__comment-form">
              <q-input
                :model-value="commentDraft"
                filled
                dense
                :label="$t('video.comments.inputLabel')"
                maxlength="500"
                class="video-page__comment-input"
                @update:model-value="commentDraft = String($event ?? '')"
                @keyup.enter="submitComment"
              />
              <HBtn
                variant="secondary"
                :label="$t('video.comments.submit')"
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
              {{ $t("video.comments.errorHint") }}
            </p>
            <p
              v-else-if="!comments.length"
              class="text-body-sm video-page__comments-hint"
            >
              {{ $t("video.comments.emptyHint") }}
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
                  {{ format.relative(comment.createdAt) }}
                </p>
              </li>
            </ul>
          </template>
        </div>
      </section>

      <div v-if="related.length" class="video-page__more">
        <CarouselRow :title="$t('video.more.related')" :videos="related" />
      </div>

      <div v-if="moreFromPartner.length" class="video-page__more">
        <CarouselRow
          :title="partnerRowTitle"
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
      <div v-if="viewerItem" class="video-page__viewer">
        <!-- muted so autoplay is allowed everywhere; the roll clips are
             silent anyway, and controls are there if one isn't -->
        <video
          v-if="viewerItem.clip"
          :src="viewerItem.src"
          :poster="video ? artworkOf(video) || undefined : undefined"
          class="video-page__viewer-img"
          muted
          loop
          autoplay
          playsinline
          controls
          @error="brokenClip = viewerItem.src"
        />
        <img
          v-else
          :src="viewerItem.src"
          :alt="stillAlt(viewerIndex ?? 0)"
          class="video-page__viewer-img"
        />
        <div class="video-page__viewer-bar">
          <q-btn
            flat
            round
            icon="chevron_left"
            :disable="(viewerIndex ?? 0) === 0"
            :aria-label="$t('video.gallery.previousPhoto')"
            @click="viewerIndex = (viewerIndex ?? 0) - 1"
          />
          <span class="text-body-sm video-page__viewer-count">
            {{
              $t("video.gallery.viewerCount", {
                index: $n((viewerIndex ?? 0) + 1),
                total: $n(gallery.length)
              })
            }}
          </span>
          <q-btn
            flat
            round
            icon="chevron_right"
            :disable="(viewerIndex ?? 0) >= gallery.length - 1"
            :aria-label="$t('video.gallery.nextPhoto')"
            @click="viewerIndex = (viewerIndex ?? 0) + 1"
          />
          <q-btn
            v-close-popup
            flat
            round
            icon="close"
            :aria-label="$t('video.gallery.closeViewer')"
          />
        </div>
      </div>
    </q-dialog>

    <!-- Connection key prompt for the script download -->
    <ConnectionKeyDialog v-model="keyDialog" @saved="getScript">
      {{ $t("video.keyPrompt.script") }}
    </ConnectionKeyDialog>

    <!-- Connection key prompt for rating and comments -->
    <ConnectionKeyDialog v-model="actionKeyDialog" @saved="runPendingAction">
      {{ $t("video.keyPrompt.action") }}
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
import { useI18n } from "vue-i18n";
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
import { useFormat } from "@/composables/useFormat";
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
const { t, n } = useI18n();
const format = useFormat();

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

// gallery + full-size viewer (broken media drops out of the gallery entirely
// — a strip of error tiles would be worse than no strip). Roughly half the
// catalog ships a short silent roll clip; where there is one it leads the
// strip and plays on its own, so the section shows motion before anything is
// clicked. A clip that won't decode (plenty are AV1) falls out the same way a
// dead still does, leaving the stills-only strip.
const brokenStills = ref(new Set<string>());
/** this clip URL was tried and didn't play — never offer it again */
const brokenClip = ref("");
const viewerIndex = ref<number | null>(null);

interface GalleryItem {
  src: string;
  /** the partner roll clip, rather than a still */
  clip: boolean;
}

const gallery = computed<GalleryItem[]>(() => {
  if (!settings.nsfw) return [];
  const preview = video.value?.preview;
  const items: GalleryItem[] =
    preview && preview !== brokenClip.value
      ? [{ src: preview, clip: true }]
      : [];
  for (const still of video.value?.images ?? []) {
    if (!brokenStills.value.has(still)) items.push({ src: still, clip: false });
  }
  return items;
});

const viewerItem = computed(() =>
  viewerIndex.value === null ? undefined : gallery.value[viewerIndex.value]
);

const hasClip = computed(() => gallery.value[0]?.clip === true);

/** stills-only heading, so a video whose only item is the clip isn't
 * announced as "Photos" */
const galleryTitle = computed(() =>
  gallery.value.some(item => !item.clip)
    ? t("video.gallery.photosTitle")
    : t("video.gallery.previewTitle")
);

/** the clip sits at index 0, so a still's own number is one behind the
 * strip's */
function photoNumber(index: number): number {
  return hasClip.value ? index : index + 1;
}

const photoCount = computed(
  () => gallery.value.length - (hasClip.value ? 1 : 0)
);

function galleryLabel(item: GalleryItem, index: number): string {
  return item.clip
    ? t("video.gallery.clipAria")
    : t("video.gallery.photoAria", {
        index: n(photoNumber(index)),
        total: n(photoCount.value)
      });
}

/** Alt text for one still. The title is the video's own, so a missing one
 * falls back to the generic noun rather than an empty alt. */
function stillAlt(index: number): string {
  return t("video.gallery.stillAlt", {
    number: n(photoNumber(index)),
    title: video.value?.title ?? t("video.fallback.video")
  });
}

const videoId = computed(() => route.params.partnerVideoId);

const favorite = computed(() =>
  video.value ? settings.isFavorite(video.value.partnerVideoId) : false
);

const embedUrl = computed(() =>
  video.value ? embedUrlOf(video.value) : undefined
);

const formatLabel = computed(() => {
  const videoFormat = video.value?.format;
  if (videoFormat?.format !== "vr") return "";
  const view =
    videoFormat.view && videoFormat.view !== "na"
      ? ` ${videoFormat.view}°`
      : "";
  return `VR${view}`;
});

/** Both "Watch on …" buttons name the partner, so the label is built once. */
const watchLabel = computed(() =>
  t("video.action.watchOn", {
    site: video.value?.partnerName ?? t("video.fallback.site")
  })
);

const partnerRowTitle = computed(() =>
  t("video.more.fromPartner", {
    site: video.value?.partnerName ?? t("video.fallback.thisSite")
  })
);

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
      label: t("video.details.script"),
      badge: expectFree.value
        ? t("video.details.free")
        : t("video.details.premium"),
      badgeColor: expectFree.value ? "positive" : "primary"
    }
  ];
  if (current.publishedAt) {
    items.push({
      label: t("video.details.published"),
      value: format.relative(current.publishedAt)
    });
  }
  if (current.duration) {
    items.push({
      label: t("video.details.duration"),
      value: format.duration(current.duration)
    });
  }
  items.push({
    label: t("video.details.format"),
    value: formatLabel.value || t("video.details.formatFlat")
  });
  if (current.partnerName) {
    items.push({ label: t("video.details.site"), value: current.partnerName });
  }
  if (current.scripterName) {
    items.push({
      label: t("video.details.scriptBy"),
      value: current.scripterName
    });
  }
  if (current.rating) {
    const votes = (current.upVotes ?? 0) + (current.downVotes ?? 0);
    const percent = n(Math.round(current.rating));
    items.push({
      label: t("video.details.rating"),
      value: votes
        ? t("video.details.ratingWithVotes", {
            percent,
            votes: format.count("votes", votes)
          })
        : t("video.details.ratingValue", { percent })
    });
  }
  if (current.scriptPlays) {
    items.push({
      label: t("video.details.scriptPlays"),
      value: format.num(current.scriptPlays)
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
  // gated like every other listing surface: /videos?partnerId= stopped
  // lifting the orientation filter (an ungated site row under a Straight
  // filter reads as a broken filter, not a deliberate override), and this
  // shelf is the same query in carousel form.
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
  brokenClip.value = "";
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
    hToast(
      "positive",
      t("video.script.readyTitle"),
      t("video.script.readyBody")
    );
  } catch {
    scriptWindow?.close();
    hToast(
      "negative",
      t("video.script.errorTitle"),
      t("video.script.errorBody")
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
      t("video.mute.refusedTitle", { tag }),
      t("video.mute.refusedBody")
    );
    return;
  }
  hToast("info", t("video.mute.doneTitle", { tag }), t("video.mute.doneBody"));
}

function unmute(tag: string) {
  settings.unmuteTag(tag);
  hToast("info", t("video.mute.undoneTitle", { tag }));
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
    hToast("positive", t("video.share.copiedTitle"));
  } catch {
    hToast("negative", t("video.share.errorTitle"));
  }
}

/** Reports go to a mailbox, not a moderation backend, so the link ships the
 * video already identified — a report that only says "this one" is useless
 * once it lands in an inbox. The draft is written in the reader's language:
 * they are the one who has to read and finish it. */
const reportMailto = computed(() => {
  const v = video.value;
  if (!v) return "";
  const body = [
    t("video.report.intro"),
    "",
    t("video.report.titleLine", {
      title: v.title ?? t("video.report.untitled")
    }),
    t("video.report.idLine", { id: v.partnerVideoId }),
    t("video.report.siteLine", { site: v.partnerName ?? v.partnerId }),
    t("video.report.linkLine", { link: window.location.href }),
    "",
    t("video.report.reasonLine"),
    ""
  ].join("\n");
  return (
    "mailto:lars@ohdoki.com" +
    `?subject=${encodeURIComponent(t("video.report.subject"))}` +
    `&body=${encodeURIComponent(body)}`
  );
});

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
    hToast("positive", t("video.rate.thanks"));
  } catch (error) {
    if (isAuthError(error)) {
      pendingAction.value = () => void rate(stars);
      actionKeyDialog.value = true;
    } else {
      hToast("negative", t("video.rate.errorTitle"));
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
      t("video.comments.postedTitle"),
      t("video.comments.postedBody")
    );
  } catch (error) {
    if (isAuthError(error)) {
      pendingAction.value = () => void submitComment();
      actionKeyDialog.value = true;
    } else {
      hToast("negative", t("video.comments.postErrorTitle"));
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

// the clip tile is already moving; the badge says why, without covering it
.video-page__gallery-badge {
  position: absolute;
  left: var(--space-xs);
  bottom: var(--space-xs);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.62);
  color: #fff;
  font-family: var(--font-brand);
  font-size: 12px;
  line-height: 20px;
  pointer-events: none;
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
