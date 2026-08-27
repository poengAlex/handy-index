<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal :title="$t('gates.muted.title')" closable class="muted-tags">
      <p class="text-body-sm muted-tags__lead">{{ $t("gates.muted.lead") }}</p>

      <q-select
        :model-value="null"
        :options="tagOptions"
        emit-value
        map-options
        use-input
        input-debounce="150"
        filled
        dense
        :label="$t('gates.muted.pickerLabel')"
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
              {{ $t("gates.muted.pickerEmpty") }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- inline rather than a nested dialog: the tag list behind it is the
           context for the decision -->
      <div v-if="pending" class="muted-tags__confirm">
        <p class="text-body-sm muted-tags__confirm-text">
          {{
            $t("gates.muted.confirmBody", {
              tag: pending,
              count: pendingCostLabel,
              share: pendingShare
            })
          }}
        </p>
        <div class="muted-tags__confirm-actions">
          <HBtn
            variant="tertiary"
            :label="$t('common.action.cancel')"
            @click="pending = ''"
          />
          <HBtn
            variant="danger"
            :label="$t('gates.muted.confirmMute')"
            @click="commitMute"
          />
        </div>
      </div>

      <div v-if="mutedSorted.length" class="muted-tags__chips">
        <button
          v-for="tag in mutedSorted"
          :key="tag"
          type="button"
          class="muted-tags__chip"
          :aria-label="$t('gates.muted.chipUnmuteAria', { tag })"
          @click="settings.unmuteTag(tag)"
        >
          <HChip icon="sell">
            {{ tag }}
            <q-icon name="close" size="16px" class="muted-tags__chip-close" />
          </HChip>
        </button>
      </div>
      <p v-else class="text-body-sm muted-tags__empty">
        {{ $t("gates.muted.empty") }}
      </p>

      <template #actions>
        <HBtn
          variant="tertiary"
          :label="$t('gates.muted.unmuteAll')"
          :disable="!settings.mutedTags.length"
          @click="unmuteAll"
        />
        <HBtn v-close-popup :label="$t('common.action.done')" />
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
import { useI18n } from "vue-i18n";
import { HBtn, HChip, HModal, hToast } from "@/components/handy";
import { useFormat } from "@/composables/useFormat";
import { UNMUTABLE_TAGS, tagsOf } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const catalog = useCatalogStore();
const settings = useSettingsStore();
const { t, n, locale } = useI18n();
const format = useFormat();

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
  if (!cost) return t("gates.muted.costNone");
  return t("gates.muted.costLine", {
    count: format.count("videos", cost),
    share: percent(shareOf(tag))
  });
}

function percent(share: number): string {
  return share >= 0.01
    ? t("gates.muted.percent", { value: n(Math.round(share * 100)) })
    : t("gates.muted.percentTiny");
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
  [...settings.mutedTags].sort((a, b) => a.localeCompare(b, locale.value))
);

/** a tag this share of the visible catalog asks before it takes it */
const HEAVY_MUTE_SHARE = 0.1;

const pending = ref("");

const pendingCostLabel = computed(() =>
  format.count("videos", costOf(pending.value))
);

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
  hToast(
    "info",
    t("gates.muted.toastMutedTitle", { tag }),
    t("gates.muted.toastMutedBody", { count: format.count("videos", cost) })
  );
}

function unmuteAll() {
  settings.clearMutedTags();
  hToast("info", t("gates.muted.toastUnmutedAll"));
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
