<template>
  <div class="h-modal">
    <q-btn
      v-if="closable"
      v-close-popup
      flat
      round
      icon="close"
      class="h-modal__close"
      :aria-label="kitLabel('close')"
      @click="emit('close')"
    />
    <h3 v-if="title" class="text-h4">{{ title }}</h3>
    <div class="h-modal__body text-body"><slot /></div>
    <div v-if="$slots.actions" class="h-modal__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
// The dialog card (§7 modal): 20px radius, 560px max, generous padding,
// optional close top-right, actions right-aligned — separation inside via
// spacing, never lines. Use INSIDE a q-dialog (which owns backdrop, focus
// trap, ESC):
//
//   <q-dialog v-model="open">
//     <HModal title="Delete your account?" closable>
//       This wipes everything. There's no undo.
//       <template #actions>
//         <HBtn variant="tertiary" label="Cancel" @click="open = false" />
//         <HBtn variant="danger" label="Delete account" @click="del" />
//       </template>
//     </HModal>
//   </q-dialog>
import { kitLabel } from "@/components/handy/labels";

withDefaults(defineProps<{ title?: string; closable?: boolean }>(), {
  title: "",
  closable: false
});

const emit = defineEmits<{ close: [] }>();
</script>

<style scoped lang="scss">
.h-modal {
  // a slider handle paints its gap in the host surface's colour, and this
  // surface is a card, not the page — on dark the two genuinely differ, so
  // without this the handle wears a page-coloured halo
  --h-slider-gap: var(--color-bg-card);

  position: relative;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow-xl);
  // cap the card to the viewport and let the BODY scroll (below) instead of
  // the dialog's default outer scroller — title + actions stay pinned
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 2 * var(--space-lg));

  h3 {
    margin: 0;
    padding-right: 48px;
  }
}

.h-modal__close {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  color: var(--color-text-secondary);
}

.h-modal__body {
  color: var(--color-text-secondary);
  margin: var(--space-sm) 0 var(--space-md);
  // the body absorbs overflow so the card never grows a default outer scroller
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  // the slim scrollbar skin is global now (app.scss, "Scrollbars")

  // A modal must never scroll sideways, and the usual reason it does is a
  // slider: Quasar's handle is a 40px box centred on its position, so at
  // either end of the track it hangs 20px past the width it was given. That
  // overhang is scrollable overflow, and since `overflow-y: auto` forces the
  // other axis to compute to `auto` too, the body grows a horizontal bar with
  // about 20px of travel. Clipping is the wrong answer — it slices the handle
  // in half exactly at 0 and 100 — so instead the box is padded by the
  // overhang and given the same amount back as negative margin. Content lands
  // where it always did; only the scrollbar moves outward, into padding the
  // card already had (--space-lg is 32px, so 12px still remains).
  //
  // This is the app.scss `.slider-thumb-room` utility, inlined: HModal owes
  // the guarantee to every project that copies it, and app.scss is
  // hand-merged per repo rather than synced.
  --slider-thumb-overhang: 20px;

  padding-inline: var(--slider-thumb-overhang);
  margin-inline: calc(-1 * var(--slider-thumb-overhang));
}

.h-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
}
</style>
