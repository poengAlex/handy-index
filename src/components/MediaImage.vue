<template>
  <q-img
    :src="src"
    :alt="alt"
    fit="cover"
    no-spinner
    loading="lazy"
    :draggable="false"
    class="media-image"
  >
    <template #error>
      <div class="media-image__error">
        <q-icon v-if="errorIcon" :name="errorIcon" :size="iconSize" />
      </div>
    </template>
  </q-img>
</template>

<script setup lang="ts">
// The one way to render remote artwork: q-img with a standard error state
// (media-well surface + outlined broken-image icon) instead of per-consumer
// @error bookkeeping. Dead partner CDNs are common in the index, so every
// image needs this. Pass errorIcon="" for a plain-surface error (heroes).
// NSFW gating stays with the consumer — this only handles load failures.
withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    errorIcon?: string;
    iconSize?: string;
  }>(),
  { alt: "", errorIcon: "broken_image", iconSize: "32px" }
);
</script>

<style scoped lang="scss">
.media-image {
  width: 100%;
  height: 100%;
}

.media-image__error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-page-alt);
  color: var(--color-text-tertiary);
}
</style>
