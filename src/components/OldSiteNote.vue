<template>
  <div class="old-site-note">
    <q-icon name="new_releases" size="24px" class="old-site-note__icon" />
    <i18n-t
      keypath="home.oldSite"
      tag="p"
      class="text-body old-site-note__text"
      scope="global"
    >
      <template #link>
        <a href="https://old.ivdb.io/">old.ivdb.io</a>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
// v2 took over the old site's address, so returning visitors land here
// first: one card pointing to where v1 still runs. Shown on home under the
// hero and under help's "About this site" group. An announcement, not an
// alert — a plain card, neutral icon, the address as the only link. No outer
// margin: each page spaces it on its own rail.
</script>

<style scoped lang="scss">
.old-site-note {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
}

.old-site-note__icon {
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.old-site-note__text {
  margin: 0;
  color: var(--color-text-primary);

  a {
    font-weight: 600;
  }
}
</style>
