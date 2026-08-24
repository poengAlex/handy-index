<template>
  <div class="request-filters">
    <div class="request-filters__row">
      <q-input
        :model-value="search"
        filled
        dense
        clearable
        :placeholder="$t('requests.filters.searchPlaceholder')"
        :aria-label="$t('requests.filters.searchAria')"
        class="request-filters__search"
        @update:model-value="emit('update:search', String($event ?? ''))"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        :model-value="sort"
        :options="sortOptions"
        emit-value
        map-options
        filled
        dense
        :aria-label="$t('requests.filters.sortAria')"
        class="request-filters__sort"
        @update:model-value="emit('update:sort', $event)"
      >
        <template #prepend>
          <q-icon name="sort" />
        </template>
      </q-select>

      <q-select
        :model-value="null"
        :options="tagOptions"
        emit-value
        map-options
        use-input
        input-debounce="150"
        filled
        dense
        :label="$t('requests.filters.tagLabel')"
        class="request-filters__tag"
        @filter="filterTags"
        @update:model-value="onAddTag"
      >
        <template #prepend>
          <q-icon name="sell" />
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-body-sm">
              {{ $t("requests.filters.tagEmpty") }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <HBtn
        :variant="hideVoted ? 'secondary' : 'tertiary'"
        icon="how_to_vote"
        :label="$t('requests.filters.hideVoted')"
        :aria-pressed="hideVoted"
        :title="$t('requests.filters.hideVotedTitle')"
        @click="emit('update:hideVoted', !hideVoted)"
      />

      <HBtn
        v-if="activeCount"
        variant="tertiary"
        icon="filter_alt_off"
        :label="$t('common.action.clear')"
        @click="emit('clear')"
      />
    </div>

    <div v-if="tags.length" class="request-filters__chips">
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="request-filters__chip"
        :aria-label="$t('requests.filters.removeTagAria', { tag })"
        @click="emit('remove-tag', tag)"
      >
        <HChip icon="sell">
          {{ tag }}
          <q-icon name="close" size="16px" class="request-filters__chip-x" />
        </HChip>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// The control row shared by the voting board and the queue: search, sort, a
// tag picker and the "hide what I've voted on" switch. Dumb on purpose —
// state and result composition live in useRequestFilters, so both pages show
// the same controls over their own list.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HChip } from "@/components/handy";
import { REQUEST_SORT_KEYS } from "@/composables/useRequestFilters";
import type { RequestSortKey } from "@/composables/useRequestFilters";
import type { TagSummary } from "@/services/script-index/queries";

const props = defineProps<{
  search: string;
  sort: RequestSortKey;
  tags: string[];
  hideVoted: boolean;
  /** every tag on the board, most-used first */
  allTags: TagSummary[];
  activeCount: number;
}>();

const emit = defineEmits<{
  "update:search": [value: string];
  "update:sort": [value: RequestSortKey];
  "update:hideVoted": [value: boolean];
  "add-tag": [tag: string];
  "remove-tag": [tag: string];
  clear: [];
}>();

const { t, n } = useI18n();

interface PickOption {
  label: string;
  value: string;
}

const needle = ref("");
const tagOptions = ref<PickOption[]>([]);

/** Switched rather than built from the key with a template literal: the
 * message paths stay greppable, and a key that never existed is a visible
 * hole here instead of `requests.sort.votes` rendered into the picker. */
function sortLabel(key: RequestSortKey): string {
  switch (key) {
    case "votes":
      return t("requests.sort.votes");
    case "newest":
      return t("requests.sort.newest");
    case "longest":
      return t("requests.sort.longest");
    case "title":
      return t("requests.sort.title");
  }
}

// a computed, not a module constant: the labels have to follow the locale
const sortOptions = computed(() =>
  REQUEST_SORT_KEYS.map(value => ({ label: sortLabel(value), value }))
);

// q-select's filter callback owns the update timing, so the options are
// materialized here rather than in a computed
function filterTags(input: string, update: (fn: () => void) => void) {
  update(() => {
    needle.value = input.trim().toLowerCase();
    tagOptions.value = props.allTags
      .filter(
        summary =>
          !props.tags.includes(summary.tag) &&
          summary.tag.includes(needle.value)
      )
      .slice(0, 30)
      .map(summary => ({
        label: t("requests.filters.tagOption", {
          tag: summary.tag,
          count: n(summary.count)
        }),
        value: summary.tag
      }));
  });
}

function onAddTag(tag: string | null) {
  if (tag) emit("add-tag", tag);
}
</script>

<style scoped lang="scss">
.request-filters__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.request-filters__search {
  flex: 1 1 240px;
  max-width: 380px;
}

.request-filters__sort {
  min-width: 170px;
}

.request-filters__tag {
  min-width: 170px;
}

.request-filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

// naked button around the chip so the whole pill is the remove target
.request-filters__chip {
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

.request-filters__chip-x {
  color: var(--color-text-tertiary);
}
</style>
