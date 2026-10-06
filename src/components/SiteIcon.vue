<template>
  <img
    v-if="src && !failed"
    :src="src"
    alt=""
    aria-hidden="true"
    width="16"
    height="16"
    class="site-icon"
    @error="failed = true"
  />
  <!-- what to show where there is no icon — nothing, unless given -->
  <slot v-else />
</template>

<script setup lang="ts">
// The icon of the site a link goes to, beside the link's own text — only on
// the links out to a performer's socials, their partner profiles and a
// video's partner page. Decorative: the text beside it already names the
// site. A site without a bundled icon gets the default slot, if any.
import { computed, ref, watch } from "vue";
import { faviconFor } from "@/services/favicons";

const props = defineProps<{ url: string | undefined }>();

const src = computed(() => faviconFor(props.url));
const failed = ref(false);

watch(src, () => {
  failed.value = false;
});
</script>

<style scoped lang="scss">
.site-icon {
  flex: none;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  object-fit: contain;
}
</style>
