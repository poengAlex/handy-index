<template>
  <div class="h-info">
    <div v-if="title" class="h-info__title text-h5">{{ title }}</div>
    <slot />
    <dl class="h-info__list">
      <div v-for="item in items" :key="item.label" class="h-info__row">
        <dt>
          <span class="text-body-sm">{{ item.label }}</span>
          <span v-if="item.note" class="text-caption h-info__note">{{
            item.note
          }}</span>
        </dt>
        <dd class="text-body-compact">
          <span
            v-if="item.value !== undefined"
            :class="{ 'h-info__value--highlight': item.highlight }"
            >{{ item.value }}</span
          >
          <span
            v-if="item.bool !== undefined"
            :class="['h-info__pill', `h-info__pill--${boolTone(item)}`]"
            >{{ boolLabel(item) }}</span
          >
          <span
            v-else-if="item.badge"
            :class="[
              'h-info__pill',
              `h-info__pill--${item.badgeColor ?? 'primary'}`
            ]"
            >{{ item.badge }}</span
          >
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
// Proposed spec for the InfoCard key/value pattern (device info):
// plain card + key/value rows. Label = secondary small, value =
// body-compact. Hairline dividers only because rows are dense (§7 Lists).
// Booleans render as state pills, never raw true/false: on-and-good =
// positive, on-and-bad (error flag) = negative, off = muted. Highlighted
// values use the success text token. Slot above the list hosts gauges.
export interface InfoItem {
  label: string;
  value?: string;
  note?: string;
  highlight?: boolean;
  badge?: string;
  badgeColor?: "primary" | "positive" | "negative" | "warning" | "muted";
  bool?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  /** the true state is a problem (e.g. "Charger fault") */
  error?: boolean;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    items: InfoItem[];
    /** Fallback for a `bool` item that carries no `trueLabel`. */
    trueLabel?: string;
    /** Fallback for a `bool` item that carries no `falseLabel`. */
    falseLabel?: string;
  }>(),
  { title: "", trueLabel: "Yes", falseLabel: "No" }
);

function boolLabel(item: InfoItem): string {
  return item.bool
    ? (item.trueLabel ?? props.trueLabel)
    : (item.falseLabel ?? props.falseLabel);
}

function boolTone(item: InfoItem): string {
  if (!item.bool) return "muted";
  return item.error ? "negative" : "positive";
}
</script>

<style scoped lang="scss">
.h-info {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.h-info__title {
  margin-bottom: var(--space-sm);
}

.h-info__list {
  margin: 0;
}

.h-info__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
  padding-block: 10px;

  & + & {
    border-top: 1px solid var(--color-stroke-subtle);
  }

  dt {
    color: var(--color-text-secondary);
    display: flex;
    flex-direction: column;
  }

  dd {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--space-xs);
    text-align: right;
  }
}

.h-info__note {
  color: var(--color-text-tertiary);
}

.h-info__value--highlight {
  color: var(--color-text-success);
}

.h-info__pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  line-height: 144%;
}

.h-info__pill--primary {
  background: var(--color-action-primary);
  color: var(--color-text-on-fill);
}

.h-info__pill--positive {
  background: var(--color-feedback-positive);
  color: var(--color-text-on-fill);
}

.h-info__pill--negative {
  background: var(--color-feedback-negative);
  color: var(--color-text-on-fill);
}

.h-info__pill--warning {
  background: var(--color-feedback-warning);
  color: var(--color-text-on-warning);
}

.h-info__pill--muted {
  background: var(--color-bg-page-alt);
  color: var(--color-text-secondary);
}
</style>
