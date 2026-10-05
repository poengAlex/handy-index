<template>
  <section class="performer-panel" :aria-labelledby="headingId">
    <div class="performer-panel__head">
      <div class="performer-panel__avatar">
        <MediaImage
          v-if="settings.nsfw && avatar"
          :src="avatar"
          :alt="displayName"
          error-icon="person"
          position="50% 20%"
        />
        <q-icon v-else name="person" size="48px" />
      </div>
      <div class="performer-panel__intro">
        <p class="text-caption performer-panel__eyebrow">
          {{ $t("performers.profile.eyebrow") }}
        </p>
        <h2 :id="headingId" class="text-h3 performer-panel__name">
          {{ displayName }}
        </h2>
        <p v-if="statsLine" class="text-body-sm performer-panel__stats">
          {{ statsLine }}
        </p>
        <div v-if="links.length" class="performer-panel__links">
          <a
            v-for="link in links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer nofollow"
            :aria-label="
              $t('performers.profile.linkAria', { site: link.label })
            "
            class="performer-panel__link"
          >
            <HChip>
              {{ link.label }}
              <q-icon
                name="open_in_new"
                size="14px"
                class="performer-panel__link-icon"
              />
            </HChip>
          </a>
        </div>
      </div>
    </div>

    <div
      v-if="facts.length || hasAbout"
      :class="[
        'performer-panel__body',
        { 'performer-panel__body--split': facts.length && hasAbout }
      ]"
    >
      <!-- HInfoCard's look, laid out in columns: as one column of thirteen
           rows it pushed the videos a screen down -->
      <div v-if="facts.length" class="performer-panel__facts">
        <div class="text-h5 performer-panel__facts-title">
          {{ $t("performers.profile.details") }}
        </div>
        <dl class="performer-panel__fact-list">
          <div
            v-for="fact in facts"
            :key="fact.label"
            class="performer-panel__fact"
          >
            <dt class="text-body-sm">{{ fact.label }}</dt>
            <dd class="text-body-compact">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>

      <HTextCard
        v-if="hasAbout"
        :title="$t('performers.profile.about')"
        :height="aboutHeight"
      >
        <p v-for="(paragraph, index) in bio" :key="index">{{ paragraph }}</p>
        <template v-if="hobbies">
          <h3 class="text-h6 performer-panel__subhead">
            {{ $t("performers.profile.hobbies") }}
          </h3>
          <p>{{ hobbies }}</p>
        </template>
      </HTextCard>
    </div>
  </section>
</template>

<script setup lang="ts">
// Who a performer is, above their videos: avatar, name, what the index holds
// of theirs, their own links, a bio and the profile card. The head draws
// from the catalog and shows at once; the bio, links and card come from the
// performer's profile, which most performers have little of — so a missing
// profile, or a sparse one, is a shorter panel rather than an error.
import { computed, toRef, useId } from "vue";
import { useI18n } from "vue-i18n";
import { HChip, HTextCard } from "@/components/handy";
import MediaImage from "@/components/MediaImage.vue";
import { useFormat } from "@/composables/useFormat";
import { usePerformerProfile } from "@/composables/usePerformerProfile";
import {
  feetAndInches,
  pounds,
  profileBio,
  profileBirth,
  profileCareer,
  profileHeight,
  profileLinks,
  profilePlace,
  profileText,
  profileWeight,
  profileYesNo,
  type ProfileCareer
} from "@/services/script-index/performer-profile";
import { performerStats } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{
  performerId: string;
  /** the name the link in carried — printed until the catalog or the
   * profile can say */
  name?: string;
}>();

/** Past this many characters the about card stops growing and scrolls, with
 * the kit's expand button for the full text. Below it, a fixed height would
 * only leave a short bio sitting in empty card. */
const ABOUT_SCROLL_CHARS = 640;

const catalog = useCatalogStore();
const settings = useSettingsStore();
const { t, n } = useI18n();
const format = useFormat();
const headingId = useId();
const profile = usePerformerProfile(toRef(props, "performerId"));

// the same pool the directory card counts — orientation lifted, access and
// mutes applied — so the two never disagree about the same person
const stats = computed(() =>
  catalog.status === "ready"
    ? performerStats(catalog.anyOrientation, props.performerId)
    : undefined
);

const displayName = computed(
  () =>
    stats.value?.name ??
    (profile.value?.name?.trim() ||
      props.name ||
      t("browse.chip.performerFallback"))
);

// the catalog's and the profile's are the same picture wherever both exist
const avatar = computed(
  () =>
    stats.value?.avatar ?? profile.value?.avatar ?? profile.value?.images?.[0]
);

const statsLine = computed(() => {
  const current = stats.value;
  if (!current?.count) return "";
  const parts = [format.count("videos", current.count)];
  if (current.avgRating) {
    parts.push(
      t("performers.ratingBadge", { rating: n(Math.round(current.avgRating)) })
    );
  }
  if (current.plays) {
    parts.push(
      t("performers.profile.plays", { count: n(current.plays) }, current.plays)
    );
  }
  return parts.join(" · ");
});

const links = computed(() =>
  profile.value ? profileLinks(profile.value) : []
);

const bio = computed(() => (profile.value ? profileBio(profile.value) : []));

const hobbies = computed(() => profileText(profile.value?.hobbies));

const hasAbout = computed(() => bio.value.length > 0 || Boolean(hobbies.value));

const aboutHeight = computed(() => {
  const length =
    bio.value.reduce((sum, paragraph) => sum + paragraph.length, 0) +
    (hobbies.value?.length ?? 0);
  return length > ABOUT_SCROLL_CHARS ? "280px" : "";
});

function careerValue(career: ProfileCareer | undefined): string {
  if (!career) return "";
  // years go in as strings: through n() they would come out as "2,009"
  switch (career.kind) {
    case "span":
      return t("performers.profile.careerSpan", {
        start: String(career.start),
        end: String(career.end)
      });
    case "since":
      return t("performers.profile.careerSince", {
        start: String(career.start)
      });
    case "active":
      return t("performers.profile.careerActive");
    case "inactive":
      return t("performers.profile.careerInactive");
  }
}

function yesNoValue(raw?: string): string | undefined {
  const value = profileYesNo(raw);
  if (typeof value !== "boolean") return value;
  return value ? t("performers.profile.yes") : t("performers.profile.no");
}

// The scrapes write height and weight half a dozen ways each ("5'5\"/165cm",
// "5 ft 6 in (168 cm)", "115lbs/52kg"); read to one number, they print in
// whichever units the language's own message asks for.
function heightValue(raw?: string): string | undefined {
  const cm = profileHeight(raw);
  if (cm === undefined) return undefined;
  const { feet, inches } = feetAndInches(cm);
  return t("performers.profile.heightValue", {
    cm: n(cm),
    feet: n(feet),
    inches: n(inches)
  });
}

function weightValue(raw?: string): string | undefined {
  const kg = profileWeight(raw);
  if (kg === undefined) return undefined;
  return t("performers.profile.weightValue", { kg: n(kg), lb: n(pounds(kg)) });
}

const facts = computed<{ label: string; value: string }[]>(() => {
  const current = profile.value;
  if (!current) return [];
  const birth = profileBirth(current);
  // label first, value second; a row whose value comes out empty is dropped
  const rows: [string, string | undefined][] = [
    [t("performers.profile.born"), birth && format.day(birth.date)],
    [t("performers.profile.age"), birth && n(birth.age)],
    [t("performers.profile.from"), profilePlace(current.country)],
    [t("performers.profile.career"), careerValue(profileCareer(current))],
    [t("performers.profile.height"), heightValue(current.height)],
    [t("performers.profile.weight"), weightValue(current.weight)],
    [t("performers.profile.measurements"), profileText(current.measurements)],
    [t("performers.profile.hair"), profileText(current.hair)],
    [t("performers.profile.eyes"), profileText(current.eyes)],
    [t("performers.profile.ethnicity"), profileText(current.ethnicity)],
    [t("performers.profile.starSign"), profileText(current.starSign)],
    [t("performers.profile.tattoos"), yesNoValue(current.tattoos)],
    [t("performers.profile.piercings"), yesNoValue(current.piercings)]
  ];
  return rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => ({ label, value }));
});
</script>

<style scoped lang="scss">
.performer-panel {
  display: grid;
  gap: var(--space-md);
}

// profile and bio side by side from the breakpoint the video page splits at;
// either one alone takes the full width
.performer-panel__body {
  display: grid;
  gap: var(--space-md);
  align-items: start;

  @media (min-width: 1024px) {
    &--split {
      grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
      gap: var(--space-lg);
    }
  }
}

// HInfoCard's surface and type, in columns instead of rows
.performer-panel__facts {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  min-width: 0;
}

.performer-panel__facts-title {
  margin: 0 0 var(--space-sm);
  color: var(--color-text-primary);
}

.performer-panel__fact-list {
  display: grid;
  // narrow enough for two columns inside a card on a 390px phone
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-sm) var(--space-md);
  margin: 0;
}

.performer-panel__fact {
  min-width: 0;

  dt {
    color: var(--color-text-secondary);
  }

  dd {
    margin: 0;
    color: var(--color-text-primary);
    overflow-wrap: break-word;
  }
}

.performer-panel__head {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

// a rounded square rather than the cast pill's circle: the source pictures
// are portraits, and a circle this size crops the face at the forehead
.performer-panel__avatar {
  width: 112px;
  height: 112px;
  flex: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-page-alt);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 600px) {
    width: 144px;
    height: 144px;
  }
}

.performer-panel__intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
}

.performer-panel__eyebrow {
  margin: 0;
  color: var(--color-text-tertiary);
}

.performer-panel__name {
  margin: 0;
  overflow-wrap: anywhere;
}

.performer-panel__stats {
  margin: 0;
  color: var(--color-text-secondary);
}

.performer-panel__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

// naked link around the chip, hover ring as on the browse filter chips
.performer-panel__link {
  border-radius: var(--radius-full);
  text-decoration: none !important;

  :deep(.h-chip) {
    transition: box-shadow 180ms ease;
  }

  &:hover :deep(.h-chip) {
    box-shadow: 0 0 0 1px var(--color-stroke-default);
  }
}

.performer-panel__link-icon {
  color: var(--color-text-tertiary);
}

.performer-panel__subhead {
  margin: 0 0 var(--space-xs);
  color: var(--color-text-primary);
}

// a breath between the bio and the hobbies under it
p + .performer-panel__subhead {
  margin-top: var(--space-md);
}
</style>
