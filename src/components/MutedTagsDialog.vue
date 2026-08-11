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
        <template #no-option>
          <q-item>
            <q-item-section class="text-body-sm">
              No matching tags
            </q-item-section>
          </q-item>
        </template>
      </q-select>

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
// tags that only exist on premium videos while that filter is off.
import { computed, ref } from "vue";
import { HBtn, HChip, HModal, hToast } from "@/components/handy";
import { UNMUTABLE_TAGS, tagsOf } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const catalog = useCatalogStore();
const settings = useSettingsStore();

const tagNeedle = ref("");

const allTags = computed(() =>
  catalog.status === "ready" ? tagsOf(catalog.videos) : []
);

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
      label: `${summary.tag} (${summary.count.toLocaleString()})`,
      value: summary.tag
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

function mute(tag: string | null) {
  if (!tag) return;
  settings.muteTag(tag);
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
</style>
