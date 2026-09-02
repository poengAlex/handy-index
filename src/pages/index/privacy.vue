<template>
  <q-page class="privacy-page">
    <div class="h-section">
      <div class="h-container">
        <h1 class="text-h2 privacy-page__title">{{ $t("privacy.title") }}</h1>

        <PrivacyStatement class="privacy-page__statement" />

        <HBtn
          variant="tertiary"
          :label="$t('common.action.backToHome')"
          to="/"
          class="privacy-page__back"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Static informational page — the consent modal owns acceptance, so this is
// documentation only. The text lives in PrivacyStatement, which the dialog
// under Help shows as well.
import PrivacyStatement from "@/components/PrivacyStatement.vue";
import { HBtn } from "@/components/handy";
</script>

<style scoped lang="scss">
.privacy-page__title {
  margin: 0;
}

.privacy-page__statement {
  display: block;
  margin-top: var(--space-lg);
}

.privacy-page__back {
  margin-top: var(--space-lg);
}
</style>
