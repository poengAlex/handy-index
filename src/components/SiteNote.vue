<template>
  <div class="site-note">
    <q-icon :name="icon" size="24px" class="site-note__icon" />
    <i18n-t
      :keypath="keypath"
      tag="p"
      class="text-body site-note__text"
      scope="global"
    >
      <template #link>
        <a :href="href">{{ host }}</a>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
// A card pointing to one of IVDB's other addresses: old.ivdb.io where v1
// still runs, next.ivdb.io where changes go live first, or back to ivdb.io
// from next. The message carries a {link} slot that becomes the address. An
// announcement, not an alert — a plain card, neutral icon, the address as the
// only link. No outer margin: each page spaces it on its own rail.
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** message with a {link} slot */
    keypath: string;
    href: string;
    icon?: string;
  }>(),
  { icon: "new_releases" }
);

// the address as people would type it: "old.ivdb.io"
const host = computed(() => new URL(props.href).host);
</script>

<style scoped lang="scss">
.site-note {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
}

.site-note__icon {
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.site-note__text {
  margin: 0;
  color: var(--color-text-primary);

  a {
    font-weight: 600;
  }
}
</style>
