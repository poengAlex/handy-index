<template>
  <p
    v-if="catalog.gates.hidden"
    v-bind="$attrs"
    class="text-caption gate-notice"
  >
    <template v-for="(part, index) in parts" :key="part.key">
      <span v-if="index" aria-hidden="true"> · </span>
      <button
        v-if="part.key === 'muted'"
        type="button"
        class="gate-notice__action"
        @click="mutedOpen = true"
      >
        {{ part.label }}
      </button>
      <template v-else>{{ part.label }}</template>
    </template>
  </p>

  <!-- outside the v-if: unmuting the last tag from the dialog empties the
       line while the dialog is still open -->
  <MutedTagsDialog v-model="mutedOpen" />
</template>

<script setup lang="ts">
// The one honest answer to "why is the catalog smaller than the index?", on
// every listing surface. Muted tags are what makes this necessary: a single
// common tag can carry half the index (muting "blowjob" hides 49% of it) and
// nothing in the browsing chrome hints that it is on — so the muted figure is
// also the click target that opens the manager.
import { computed, ref } from "vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import { ORIENTATION_LABELS } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

// two roots (the line + its dialog), so class/style from the consumer has to
// be routed to the paragraph by hand
defineOptions({ inheritAttrs: false });

const catalog = useCatalogStore();
const settings = useSettingsStore();

const mutedOpen = ref(false);

function videoCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "video" : "videos"}`;
}

interface Reason {
  key: string;
  count: number;
  /** the "by …" clause, phrased to follow either a total or its own count */
  by: string;
}

const reasons = computed<Reason[]>(() => {
  const gates = catalog.gates;
  const list: Reason[] = [];
  if (gates.byMutedTags) {
    list.push({ key: "muted", count: gates.byMutedTags, by: "by muted tags" });
  }
  if (gates.byOrientation) {
    list.push({
      key: "orientation",
      count: gates.byOrientation,
      by: `by the ${ORIENTATION_LABELS[settings.orientation]} filter`
    });
  }
  // named in full, both of them: they are different paywalls, and "hidden by
  // the premium filter" would not say which one did it
  if (gates.byScript) {
    list.push({
      key: "script",
      count: gates.byScript,
      by: "by the premium-script filter"
    });
  }
  if (gates.byVideo) {
    list.push({
      key: "video",
      count: gates.byVideo,
      by: "by the premium-video filter"
    });
  }
  return list;
});

interface NoticePart {
  key: string;
  label: string;
}

// One reason reads as a sentence ("7,468 videos hidden by muted tags"); two or
// more lead with the total, because "7,468 by muted tags · 1,816 by the
// Straight filter" leaves the reader to add it up
const parts = computed<NoticePart[]>(() => {
  const list = reasons.value;
  const only = list[0];
  if (!only) return [];
  if (list.length === 1) {
    return [
      { key: only.key, label: `${videoCount(only.count)} hidden ${only.by}` }
    ];
  }
  return [
    { key: "total", label: `${videoCount(catalog.gates.hidden)} hidden` },
    ...list.map(reason => ({
      key: reason.key,
      label: `${reason.count.toLocaleString()} ${reason.by}`
    }))
  ];
});
</script>

<style scoped lang="scss">
.gate-notice {
  margin: var(--space-xs) 0 0;
  color: var(--color-text-tertiary);
}

// a link, not a button shape: it sits inside a sentence
.gate-notice__action {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  color: var(--color-text-link);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
