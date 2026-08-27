<template>
  <div class="h-info">
    <div v-if="title || $slots.action" class="h-info__head">
      <div v-if="title" class="h-info__title text-h5">{{ title }}</div>
      <div v-if="$slots.action" class="h-info__action">
        <slot name="action" />
      </div>
    </div>
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
            >{{ item.value
            }}<q-tooltip
              v-if="item.tooltip"
              class="h-info__tooltip"
              max-width="min(90vw, 420px)"
              >{{ item.tooltip }}</q-tooltip
            ></span
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
// values use the success text token. Slot above the list hosts gauges; the
// "action" slot puts one icon-only control on the title row's right edge
// (refresh and friends) — it never grows the row, so a card with an action
// lines up with one without.
import { kitLabel } from "@/components/handy/labels";

export interface InfoItem {
  label: string;
  value?: string;
  note?: string;
  /** hover/long-press reveal for the untruncated form of a long value */
  tooltip?: string;
  highlight?: boolean;
  badge?: string;
  badgeColor?: "primary" | "positive" | "negative" | "warning" | "muted";
  bool?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  /** the true state is a problem (e.g. "Charger fault") */
  error?: boolean;
}

withDefaults(defineProps<{ title?: string; items: InfoItem[] }>(), {
  title: ""
});

function boolLabel(item: InfoItem): string {
  return item.bool
    ? (item.trueLabel ?? kitLabel("yes"))
    : (item.falseLabel ?? kitLabel("no"));
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

.h-info__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

// the action hugs the card's corner: pulled out by its own padding so the
// icon sits on the card's inner margin, and zero-height so it can't push
// the title row taller than the text
.h-info__action {
  display: flex;
  align-items: center;
  height: 0;
  margin-right: calc(var(--space-xs) * -1);
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

// long identifiers (hashes, uids) tooltip their full form; monospace wrap
:global(.h-info__tooltip) {
  font-family:
    ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, monospace;
  word-break: break-all;
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
