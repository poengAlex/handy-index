<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal
      :title="$t('performers.report.title')"
      closable
      class="profile-report"
    >
      <p class="text-body-sm profile-report__disclaimer">
        {{ $t("performers.report.disclaimer") }}
      </p>

      <div class="text-body-compact profile-report__question">
        {{ $t("performers.report.question") }}
      </div>
      <HList>
        <HToggleRow
          v-for="reason in REASONS"
          :key="reason"
          :model-value="picked.includes(reason)"
          :label="reasonLabel(reason)"
          @update:model-value="toggle(reason)"
        />
      </HList>

      <q-input
        v-model="details"
        type="textarea"
        autogrow
        filled
        :label="$t('performers.report.detailsLabel')"
        class="profile-report__details"
      />

      <p class="text-caption profile-report__note">
        {{ $t("performers.report.note") }}
      </p>

      <template #actions>
        <HBtn
          v-close-popup
          variant="tertiary"
          :label="$t('common.action.cancel')"
        />
        <HBtn
          :label="$t('performers.report.send')"
          :href="picked.length ? mailto : undefined"
          :disable="!picked.length"
          @click="onSend"
        />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// "Something on this profile is wrong": the disclaimer that profile details
// are scraped and unchecked, and a report the reader sends from their own
// email app — reports go to a mailbox (REPORT_EMAIL), not a moderation
// backend, as the video page's report does. The email arrives with the
// performer identified, the reasons ticked, and what the profile says now,
// so it can be acted on without a reply.
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HList, HModal, HToggleRow } from "@/components/handy";
import { REPORT_EMAIL } from "@/services/contact";

const props = defineProps<{
  modelValue: boolean;
  performerId: string;
  name: string;
  /** the profile as the page shows it, label and value */
  facts: readonly { label: string; value: string }[];
}>();

const emit = defineEmits<{ "update:modelValue": [open: boolean] }>();

const REASONS = [
  "measurements",
  "age",
  "details",
  "media",
  "self",
  "other"
] as const;
type Reason = (typeof REASONS)[number];

const { t } = useI18n();
const picked = ref<Reason[]>([]);
const details = ref("");

// a fresh form each time it opens, for whichever performer
watch(
  () => props.modelValue,
  open => {
    if (open) {
      picked.value = [];
      details.value = "";
    }
  }
);

/** Switched rather than built from the key: the message paths stay
 * greppable. */
function reasonLabel(reason: Reason): string {
  switch (reason) {
    case "measurements":
      return t("performers.report.reason.measurements");
    case "age":
      return t("performers.report.reason.age");
    case "details":
      return t("performers.report.reason.details");
    case "media":
      return t("performers.report.reason.media");
    case "self":
      return t("performers.report.reason.self");
    case "other":
      return t("performers.report.reason.other");
  }
}

function toggle(reason: Reason) {
  picked.value = picked.value.includes(reason)
    ? picked.value.filter(entry => entry !== reason)
    : [...picked.value, reason];
}

const mailto = computed(() => {
  const lines = [
    t("performers.report.email.intro"),
    "",
    t("performers.report.email.nameLine", { name: props.name }),
    t("performers.report.email.idLine", { id: props.performerId }),
    t("performers.report.email.linkLine", { link: window.location.href }),
    "",
    t("performers.report.email.reasonsLine"),
    ...picked.value.map(reason => `- ${reasonLabel(reason)}`),
    "",
    t("performers.report.email.detailsLine"),
    details.value.trim(),
    "",
    t("performers.report.email.profileLine"),
    ...props.facts.map(fact => `- ${fact.label}: ${fact.value}`)
  ];
  return (
    `mailto:${REPORT_EMAIL}` +
    `?subject=${encodeURIComponent(t("performers.report.email.subject", { name: props.name }))}` +
    `&body=${encodeURIComponent(lines.join("\n"))}`
  );
});

/** the email app takes over from here; the dialog has done its part */
function onSend() {
  if (picked.value.length) emit("update:modelValue", false);
}
</script>

<style scoped lang="scss">
.profile-report {
  width: 480px;
  max-width: 100%;
}

.profile-report__disclaimer {
  margin: 0 0 var(--space-md);
  color: var(--color-text-secondary);
}

.profile-report__question {
  margin-bottom: var(--space-xs);
  color: var(--color-text-primary);
}

.profile-report__details {
  margin-top: var(--space-sm);
}

.profile-report__note {
  margin: var(--space-sm) 0 0;
  color: var(--color-text-tertiary);
}
</style>
