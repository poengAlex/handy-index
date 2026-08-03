<template>
  <div>
    <div class="video-grid">
      <VideoCard
        v-for="video in shown"
        :key="video.partnerVideoId"
        :video="video"
      />
    </div>
    <div v-if="!done" ref="sentinel" class="video-grid__sentinel" />
  </div>
</template>

<script setup lang="ts">
// Responsive card grid with endless scroll — a 15k-item result list never
// mounts at once (see useIncrementalReveal).
import { toRef } from "vue";
import VideoCard from "@/components/VideoCard.vue";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import type { PartnerVideo } from "@/services/script-index/types";

const props = defineProps<{ videos: readonly PartnerVideo[] }>();

const { shown, done, sentinel } = useIncrementalReveal(
  toRef(props, "videos"),
  36
);
</script>

<style scoped lang="scss">
.video-grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.video-grid__sentinel {
  height: 1px;
}
</style>
