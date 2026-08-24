<template>
  <div class="not-found">
    <HEmptyState
      icon="explore_off"
      :title="$t('errors.notFound.title')"
      :body="$t('errors.notFound.body')"
      :action-label="$t('common.action.backToHome')"
      @action="router.push('/')"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { HEmptyState } from "@/components/handy";

const router = useRouter();
</script>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-page);
  padding: var(--space-md);
}
</style>
