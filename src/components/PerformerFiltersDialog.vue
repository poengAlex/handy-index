<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal
      :title="$t('performers.filters.title')"
      closable
      class="performer-filters"
    >
      <!-- a filter that silently drops whoever it cannot judge is the same
           failure the browse page's speed note owns up to, so it is said
           before anything is picked -->
      <p class="text-caption performer-filters__lead">
        {{ $t("performers.filters.lead") }}
      </p>

      <div v-if="status === 'error'" class="performer-filters__state">
        <HEmptyState
          icon="cloud_off"
          :title="$t('performers.filters.errorTitle')"
          :body="$t('performers.filters.errorBody')"
          :action-label="$t('common.action.retry')"
          @action="emit('retry')"
        />
      </div>

      <div v-else-if="status !== 'ready'" class="performer-filters__state">
        <HandyLoader />
      </div>

      <div v-else class="performer-filters__stack">
        <div
          v-for="(column, index) in COLUMNS"
          :key="index"
          class="performer-filters__col"
        >
          <template v-for="item in column" :key="item">
            <section v-if="isRange(item)" class="performer-filters__group">
              <HLabeledSlider
                :model-value="drafts[item]"
                :label="facetLabel(item)"
                :min="TRAIT_RANGES[item].min"
                :max="TRAIT_RANGES[item].max"
                :step="TRAIT_RANGES[item].step"
                :editable="false"
                @update:model-value="onRangeInput(item, $event)"
                @change="emit('set-range', item, { ...drafts[item] })"
              >
                <template #value>{{ rangeLabel(item) }}</template>
              </HLabeledSlider>
            </section>

            <section
              v-else-if="optionsOf(item).length"
              class="performer-filters__group"
            >
              <h4 class="text-h5 performer-filters__group-title">
                {{ facetLabel(item) }}
              </h4>
              <div
                class="performer-filters__options"
                role="group"
                :aria-label="facetLabel(item)"
              >
                <button
                  v-for="code in optionsOf(item)"
                  :key="code"
                  type="button"
                  :class="[
                    'performer-filters__option',
                    { 'performer-filters__option--on': picked(item, code) }
                  ]"
                  :aria-pressed="picked(item, code)"
                  @click="emit('toggle', item, code)"
                >
                  <HChip :icon="picked(item, code) ? 'check' : ''">
                    {{ optionLabel(item, code) }}
                    <span class="performer-filters__count">
                      {{ $n(counts[item].get(code) ?? 0) }}
                    </span>
                  </HChip>
                </button>
              </div>
            </section>
          </template>
        </div>
      </div>

      <template #actions>
        <HBtn
          variant="tertiary"
          :label="$t('common.action.clearFilters')"
          :disable="!activeCount"
          @click="emit('clear')"
        />
        <HBtn v-close-popup :label="$t('common.action.done')" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// The performer directory's property filters: a row of toggle pills per
// facet (hair, eyes, cup size, …) and a track each for age and height. Dumb
// on purpose — state, counts and the roster download live in
// usePerformerFilters.
import { reactive, watch } from "vue";
import {
  HBtn,
  HChip,
  HEmptyState,
  HLabeledSlider,
  HModal,
  HandyLoader
} from "@/components/handy";
import type { HLabeledSliderRange } from "@/components/handy/HLabeledSlider.vue";
import type { TraitsStatus } from "@/composables/usePerformerFilters";
import { usePerformerFilterLabels } from "@/composables/usePerformerFilterLabels";
import {
  TRAIT_FACETS,
  TRAIT_RANGE_KEYS,
  TRAIT_RANGES,
  type RangeValue,
  type TraitFacet,
  type TraitFilters,
  type TraitRange
} from "@/services/script-index/performer-traits";

const props = defineProps<{
  modelValue: boolean;
  status: TraitsStatus;
  filters: TraitFilters;
  /** per facet, how many performers each code would leave */
  counts: Record<TraitFacet, ReadonlyMap<string, number>>;
  activeCount: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  toggle: [facet: TraitFacet, code: string];
  "set-range": [key: TraitRange, value: RangeValue];
  clear: [];
  retry: [];
}>();

type Item = TraitFacet | TraitRange;

/** Who they are on the left, what they look like on the right; one column
 * on a phone, in the same order. */
const COLUMNS: readonly (readonly Item[])[] = [
  ["gender", "ethnicity", "age", "height", "bmi"],
  ["hair", "eyes", "cup", "natural", "tattoos", "piercings"]
];

const {
  facetLabel,
  optionLabel,
  rangeLabel: labelOf
} = usePerformerFilterLabels();

function isRange(item: Item): item is TraitRange {
  return item in TRAIT_RANGES;
}

function picked(facet: TraitFacet, code: string): boolean {
  return props.filters.codes[facet].includes(code);
}

/** The codes worth offering: any that would leave someone, and any already
 * picked — a pick the other filters have since emptied stays removable. */
function optionsOf(facet: TraitFacet): string[] {
  return TRAIT_FACETS[facet].filter(
    code => (props.counts[facet].get(code) ?? 0) > 0 || picked(facet, code)
  );
}

// the band being dragged lives here; only the track's commit (@change)
// reaches the filters, so the grid and the counts don't recompute on every
// pixel. A clear from outside resyncs it.
function copyRanges(
  ranges: Record<TraitRange, RangeValue>
): Record<TraitRange, RangeValue> {
  return Object.fromEntries(
    TRAIT_RANGE_KEYS.map(key => [key, { ...ranges[key] }])
  ) as Record<TraitRange, RangeValue>;
}

const drafts = reactive(copyRanges(props.filters.ranges));

watch(
  () => props.filters.ranges,
  ranges => Object.assign(drafts, copyRanges(ranges)),
  { deep: true }
);

function onRangeInput(key: TraitRange, value: number | HLabeledSliderRange) {
  if (typeof value === "number") return;
  drafts[key] = { min: value.min, max: value.max };
}

function rangeLabel(key: TraitRange): string {
  return labelOf(key, drafts[key]);
}
</script>

<style scoped lang="scss">
.performer-filters {
  width: 480px;
  // the kit caps at 560; on a narrow phone a fixed 480 would overhang
  max-width: 100%;
}

// Two columns on a wide screen, as the browse filters do: twelve groups of
// pills in one 560px column is a scroller on any display. HModal's cap is a
// kit rule and the kit is never forked, so it is lifted from here — the
// doubled class beats the component's own scoped rule without !important.
@media (min-width: 1024px) {
  .performer-filters.performer-filters {
    width: 860px;
    max-width: calc(100vw - 2 * var(--space-lg));
  }
}

.performer-filters__lead {
  margin: 0 0 var(--space-md);
  color: var(--color-text-tertiary);
  text-wrap: pretty;
}

.performer-filters__state {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.performer-filters__stack {
  display: grid;
  gap: var(--space-md);
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }
}

.performer-filters__col {
  display: grid;
  gap: var(--space-md);
  align-content: start;
  min-width: 0;
}

.performer-filters__group {
  display: grid;
  gap: var(--space-sm);
  min-width: 0;
}

.performer-filters__group-title {
  margin: 0;
  color: var(--color-text-primary);
}

.performer-filters__options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

// naked button around the chip so the whole pill is the toggle
.performer-filters__option {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-full);

  :deep(.h-chip) {
    transition:
      box-shadow 180ms ease,
      background-color 180ms ease;
  }

  &:hover :deep(.h-chip) {
    box-shadow: 0 0 0 1px var(--color-stroke-default);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
    outline-offset: 2px;
  }
}

.performer-filters__option--on :deep(.h-chip) {
  background: var(--color-action-primary);
  color: var(--color-action-primary-label);
}

.performer-filters__count {
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
</style>
