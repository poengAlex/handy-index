<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to || undefined"
    :class="['h-product', { 'h-product--interactive': interactive }]"
    :role="!to && interactive ? 'button' : undefined"
    :tabindex="!to && interactive ? 0 : undefined"
    @keydown="onKeydown"
  >
    <div class="h-product__media">
      <span v-if="badge" class="h-product__badge text-body-sm">{{
        badge
      }}</span>
      <slot name="media">
        <svg viewBox="0 0 320 240" class="h-product__render" aria-hidden="true">
          <ellipse
            cx="160"
            cy="206"
            rx="84"
            ry="10"
            fill="rgba(28, 43, 51, 0.08)"
          />
          <rect x="124" y="44" width="72" height="160" rx="32" fill="#3A4750" />
          <rect
            x="124"
            y="44"
            width="72"
            height="160"
            rx="32"
            fill="url(#sheen)"
          />
          <circle
            cx="160"
            cy="170"
            r="9"
            fill="#1C1E21"
            stroke="rgba(255,255,255,0.25)"
          />
          <defs>
            <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="rgba(255,255,255,0.22)" />
              <stop offset="0.4" stop-color="rgba(255,255,255,0)" />
              <stop offset="1" stop-color="rgba(0,0,0,0.18)" />
            </linearGradient>
          </defs>
        </svg>
      </slot>
    </div>
    <div class="h-product__body">
      <div class="text-h5">{{ name }}</div>
      <div class="h-product__price-row">
        <span class="text-h4 h-product__price">{{ price }}</span>
        <span v-if="oldPrice" class="h-product__old text-body-sm">{{
          oldPrice
        }}</span>
      </div>
      <div v-if="rating" class="h-product__rating text-body-sm">
        <q-icon
          v-for="i in 5"
          :key="i"
          :name="i <= Math.round(rating) ? 'star' : 'star_outline'"
          size="16px"
          :class="
            i <= Math.round(rating)
              ? 'h-product__star--full'
              : 'h-product__star--empty'
          "
        />
        <span>{{ ratingText }} · {{ ratingCountText }}</span>
      </div>
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
// DESIGN.md §7 Product cards — edge-to-edge render, H5 name, H4/700
// price, Brand Blue sale pill top-left, hover lift via --shadow-md.
// Interactive only when it can go somewhere: pass `to` (renders a
// router-link) or bind @click (falls through to the root element; Enter/
// Space dispatch it too). Otherwise it's a plain display card — no
// pointer cursor, no tab stop.
import { computed, useAttrs } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    price: string;
    oldPrice?: string;
    badge?: string;
    rating?: number;
    ratingCount?: number;
    /**
     * Pre-formatted rating / count, for an app that knows its own locale.
     * Without them the kit falls back to the browser's locale, which is the
     * right guess only when nobody has a better one.
     */
    ratingLabel?: string;
    ratingCountLabel?: string;
    to?: string;
  }>(),
  {
    oldPrice: "",
    badge: "",
    rating: 0,
    ratingCount: 0,
    ratingLabel: "",
    ratingCountLabel: "",
    to: ""
  }
);

// A bare toLocaleString() reads navigator.language, not the app's locale — a
// Norwegian app in a US browser prints "15,000" beside "15 000" everywhere
// else. So the caller's own formatting wins; the browser's is only the guess
// we fall back to when nobody has expressed an opinion.
const ratingText = computed(() => props.ratingLabel || `${props.rating}`);
const ratingCountText = computed(
  () => props.ratingCountLabel || props.ratingCount?.toLocaleString()
);

const attrs = useAttrs();
const interactive = computed(() => !!props.to || !!attrs["onClick"]);

// Enter/Space activate like a real button (router-link handles Enter itself)
function onKeydown(e: KeyboardEvent) {
  if (!interactive.value || props.to || e.target !== e.currentTarget) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    (e.currentTarget as HTMLElement).click();
  }
}
</script>

<style scoped lang="scss">
.h-product {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow 200ms ease;
  color: inherit;
  text-decoration: none !important;
  // fill the height the row gives us, so cards in a stretch grid/flex row
  // line up — equal height is the row's job; the card just fills its cell
  height: 100%;
  display: flex;
  flex-direction: column;
}

// pointer + hover lift only when the card actually goes somewhere
.h-product--interactive {
  cursor: pointer;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.h-product__media {
  position: relative;
  aspect-ratio: 4 / 3;
  // §8: product renders sit on Soft Gray — the well also catches
  // transparent images
  background: var(--color-bg-page-alt);
}

.h-product__render {
  width: 100%;
  height: 100%;
  display: block;
}

.h-product__badge {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  z-index: 1;
  background: var(--color-action-primary);
  color: #fff;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.h-product__body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
}

.h-product__price-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
}

.h-product__price {
  font-weight: 700;
}

.h-product__old {
  color: var(--color-text-tertiary);
  text-decoration: line-through;
}

.h-product__rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--color-text-secondary);

  span {
    margin-left: 6px;
  }
}

.h-product__star--full {
  color: var(--color-action-primary);
}

.h-product__star--empty {
  color: var(--color-stroke-subtle);
}
</style>

<style lang="scss">
// Shadows don't read on dark, so the light-mode hover lift is invisible
// there. On dark, hover lifts via a hairline outline instead (the dark-mode
// "separation is surface/stroke, not shadow" rule). An *outset* ring, not
// inset: the media's opaque Soft-Gray top paints over an inset shadow,
// leaving only the body's bottom edge — the outset ring sits outside the
// card and reads all the way around. overflow:hidden clips children, not this.
[data-theme="dark"] .h-product--interactive:hover,
.section-dark .h-product--interactive:hover {
  box-shadow: 0 0 0 1px var(--color-stroke-default);
}

// --color-action-primary is a FILL token — #0064e0 in both themes, sized for
// a button carrying a white label. As a foreground on --color-bg-card it
// computes to 2.74:1, under WCAG 1.4.11's 3:1 for graphical objects. The link
// tint is the correction design.md already applies to the active tab label
// and the focused field label, for exactly this reason.
[data-theme="dark"] .h-product__star--full,
.section-dark .h-product__star--full {
  color: var(--color-text-link);
}
</style>
