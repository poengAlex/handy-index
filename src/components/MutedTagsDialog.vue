<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal title="Muted tags" closable class="muted-tags">
      <p class="text-body-sm muted-tags__lead">
        Muted tags disappear from the catalog — browse, search, rows and related
        videos all skip them. Matching is exact, so muting “gay” won’t mute “gay
        massage”. Favorites and playlists are yours, so they stay put.
      </p>

      <q-select
        :model-value="null"
        :options="tagOptions"
        emit-value
        map-options
        use-input
        input-debounce="150"
        filled
        dense
        label="Mute a tag"
        @filter="filterTags"
        @update:model-value="mute"
      >
        <template #prepend>
          <q-icon name="sell" />
        </template>
        <!-- the cost belongs in the picker, not in a regret afterwards: tags
             here are dense enough that one pick can take half the catalog -->
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.value }}</q-item-label>
              <q-item-label caption>{{ scope.opt.cost }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-body-sm">
              No matching tags
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- inline rather than a nested dialog: the tag list behind it is the
           context for the decision -->
      <div v-if="pending" class="muted-tags__confirm">
        <p class="text-body-sm muted-tags__confirm-text">
          “{{ pending }}” is on {{ pendingCostLabel }} — {{ pendingShare }} of
          what you can currently see. Muting it removes them from browse,
          search, rows and related videos everywhere.
        </p>
        <div class="muted-tags__confirm-actions">
          <HBtn variant="tertiary" label="Cancel" @click="pending = ''" />
          <HBtn variant="danger" label="Mute anyway" @click="commitMute" />
        </div>
      </div>

      <div v-if="mutedSorted.length" class="muted-tags__chips">
        <button
          v-for="tag in mutedSorted"
          :key="tag"
          type="button"
          class="muted-tags__chip"
          :aria-label="`Unmute tag: ${tag}`"
          @click="settings.unmuteTag(tag)"
        >
          <HChip icon="sell">
            {{ tag }}
            <q-icon name="close" size="16px" class="muted-tags__chip-close" />
          </HChip>
        </button>
      </div>
      <p v-else class="text-body-sm muted-tags__empty">
        Nothing muted yet. Pick a tag above and every video carrying it leaves
        the catalog.
      </p>

      <template #actions>
        <HBtn
          variant="tertiary"
          label="Unmute all"
          :disable="!settings.mutedTags.length"
          @click="unmuteAll"
        />
        <HBtn v-close-popup label="Done" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// The muted-tag manager: pick a tag to mute, click a chip to unmute. The
// picker sources from the RAW catalog on purpose — sourcing from the gated
// catalog would make a muted tag vanish from its own picker, and would hide
// tags that only exist on the half of the catalog the script gate drops.
import { computed, ref, watch } from "vue";
import { HBtn, HChip, HModal, hToast } from "@/components/handy";
import { UNMUTABLE_TAGS, tagsOf } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const catalog = useCatalogStore();
const settings = useSettingsStore();

const tagNeedle = ref("");

const allTags = computed(() =>
  catalog.status === "ready" ? tagsOf(catalog.videos) : []
);

/** What muting a tag would actually cost: how many of the videos you can see
 * right now carry it. Deliberately not the raw catalog count above — a tag
 * sitting entirely on already-hidden videos costs you nothing. */
const visibleTagCounts = computed(() => {
  const counts = new Map<string, number>();
  if (catalog.status !== "ready") return counts;
  for (const summary of tagsOf(catalog.visible)) {
    counts.set(summary.tag, summary.count);
  }
  return counts;
});

function costOf(tag: string): number {
  return visibleTagCounts.value.get(tag) ?? 0;
}

function shareOf(tag: string): number {
  const visible = catalog.visible.length;
  return visible ? costOf(tag) / visible : 0;
}

function costLabel(tag: string): string {
  const cost = costOf(tag);
  if (!cost) return "none of the videos you can see";
  const noun = cost === 1 ? "video" : "videos";
  return `${cost.toLocaleString()} ${noun} · ${percent(shareOf(tag))} of what you see`;
}

function percent(share: number): string {
  return share >= 0.01 ? `${Math.round(share * 100)}%` : "<1%";
}

const tagOptions = computed(() =>
  allTags.value
    .filter(
      summary =>
        !settings.mutedSet.has(summary.tag) &&
        !UNMUTABLE_TAGS.has(summary.tag) &&
        summary.tag.includes(tagNeedle.value)
    )
    .slice(0, 30)
    .map(summary => ({
      label: summary.tag,
      value: summary.tag,
      cost: costLabel(summary.tag)
    }))
);

// writes a local needle only — committing on keystroke would invalidate the
// whole gated catalog (and every derived row) on every letter typed
function filterTags(input: string, update: (fn: () => void) => void) {
  update(() => {
    tagNeedle.value = input.trim().toLowerCase();
  });
}

/** alphabetical: reading this list is a lookup ("did I already mute that?"),
 * while the store keeps insertion order */
const mutedSorted = computed(() =>
  [...settings.mutedTags].sort((a, b) => a.localeCompare(b))
);

/** a tag this share of the visible catalog asks before it takes it */
const HEAVY_MUTE_SHARE = 0.1;

const pending = ref("");

const pendingCostLabel = computed(() => {
  const cost = costOf(pending.value);
  return `${cost.toLocaleString()} ${cost === 1 ? "video" : "videos"}`;
});

const pendingShare = computed(() => percent(shareOf(pending.value)));

// closing on an unanswered confirm is a decline — reopening to a question
// about a tag you no longer remember picking is worse than asking again
watch(
  () => props.modelValue,
  open => {
    if (!open) pending.value = "";
  }
);

function mute(tag: string | null) {
  if (!tag) return;
  if (shareOf(tag) >= HEAVY_MUTE_SHARE) {
    pending.value = tag;
    return;
  }
  settings.muteTag(tag);
}

// the cost has to be read before the mute lands, or the tag's videos are
// already out of `visible` and it reports zero
function commitMute() {
  const tag = pending.value;
  const cost = costOf(tag);
  pending.value = "";
  if (!settings.muteTag(tag)) return;
  const noun = cost === 1 ? "video" : "videos";
  hToast("info", `Muted “${tag}”`, `${cost.toLocaleString()} ${noun} hidden`);
}

function unmuteAll() {
  settings.clearMutedTags();
  hToast("info", "All tags unmuted");
}
</script>

<style scoped lang="scss">
.muted-tags {
  width: min(480px, 100%);
}

.muted-tags__lead {
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-sm);
}

.muted-tags__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
  max-height: 40vh;
  overflow-y: auto;
}

// naked button around the chip so the whole pill is the unmute target
.muted-tags__chip {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-full);

  :deep(.h-chip) {
    transition: box-shadow 180ms ease;
  }

  &:hover :deep(.h-chip) {
    box-shadow: 0 0 0 1px var(--color-stroke-default);
  }
}

.muted-tags__chip-close {
  color: var(--color-text-tertiary);
}

.muted-tags__empty {
  color: var(--color-text-tertiary);
  margin: var(--space-sm) 0 0;
}

.muted-tags__confirm {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  border: 1px solid var(--color-stroke-default);
  border-radius: var(--radius-md);
}

.muted-tags__confirm-text {
  margin: 0 0 var(--space-sm);
}

.muted-tags__confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
}
</style>
