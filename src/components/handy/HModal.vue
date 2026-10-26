<template>
  <div ref="rootEl" :class="['h-modal', { 'h-modal--sheet': sheet }]">
    <span v-if="sheet" class="h-modal__handle" aria-hidden="true" />
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
    <h3 v-if="title" :id="titleId" class="text-h4">{{ title }}</h3>
    <div class="h-modal__body text-body"><slot /></div>
    <div v-if="$slots.actions" class="h-modal__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
// The dialog card (design.md 6.5): 20px radius, 560px max, generous padding,
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
//
// `sheet` is the mobile form (design.md 6.5, Modal and sheet): put it in a
// `<q-dialog position="bottom">` and it rounds only its top corners and
// carries a centred drag handle. Quasar runs it edge to edge on a phone and
// caps it at the same 560px above that. The handle is a cue, not a control:
// the dialog closes the usual ways.
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { kitLabel } from "./labels";

const props = withDefaults(
  defineProps<{ title?: string; closable?: boolean; sheet?: boolean }>(),
  { title: "", closable: false, sheet: false }
);

const emit = defineEmits<{ close: [] }>();

// The title names the dialog. q-dialog owns the role="dialog" element, which
// sits outside this component, so the title's id is handed up to it — unless
// the host already named the dialog itself.
const titleId = useId();
const rootEl = ref<HTMLElement | null>(null);
let labelled: HTMLElement | null = null;

onMounted(() => {
  const dialog = rootEl.value?.closest<HTMLElement>('[role="dialog"]');
  if (!props.title || !dialog) return;
  if (
    dialog.hasAttribute("aria-labelledby") ||
    dialog.hasAttribute("aria-label")
  )
    return;
  dialog.setAttribute("aria-labelledby", titleId);
  labelled = dialog;
});

onBeforeUnmount(() => {
  labelled?.removeAttribute("aria-labelledby");
});
</script>

<style scoped lang="scss">
.h-modal {
  // a slider handle paints its gap in the host surface's colour, and this
  // surface is a card, not the page — on dark the two genuinely differ, so
  // without this the handle wears a page-coloured halo
  --h-slider-gap: var(--color-bg-card);
  // the card's side padding, which the body (below) reaches across so its
  // scrollbar lands on the card's edge
  --h-modal-pad-x: var(--space-lg);

  position: relative;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--h-modal-pad-x);
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

.h-modal--sheet {
  --h-modal-pad-x: var(--space-md);

  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-sm) var(--h-modal-pad-x)
    calc(var(--space-md) + env(safe-area-inset-bottom));
  max-height: calc(100dvh - var(--space-2xl));
}

.h-modal__handle {
  flex: none;
  align-self: center;
  width: 32px;
  height: var(--space-2xs);
  border-radius: var(--radius-full);
  background: var(--color-stroke-default);
  margin-bottom: var(--space-sm);
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
  // the slim scrollbar skin is global now (styles/_layout.scss, "Scrollbars")

  // A modal must never scroll sideways, and the usual reason it does is a
  // slider: Quasar's handle is a 40px box centred on its position, so at
  // either end of the track it hangs 20px past the width it was given. That
  // overhang is scrollable overflow, and since `overflow-y: auto` forces the
  // other axis to compute to `auto` too, the body grows a horizontal bar with
  // about 20px of travel. Clipping is the wrong answer — it slices the handle
  // in half exactly at 0 and 100 — so instead the box is padded by the
  // overhang and given the same amount back as negative margin. Content lands
  // where it always did; only the box's edges move outward, into padding the
  // card already had.
  //
  // This is the kit's `.slider-thumb-room` utility (styles/_layout.scss),
  // inlined: HModal owes the guarantee to every project that uses it,
  // whatever that project's own global CSS does.
  --slider-thumb-overhang: 20px;

  padding-left: var(--slider-thumb-overhang);
  margin-left: calc(-1 * var(--slider-thumb-overhang));
  // The right side takes the same trick the whole way, across all of the
  // card's padding, so the scrollbar runs down the card's own edge rather
  // than floating inside it (and the padding still covers the overhang).
  // Nothing is needed at the top and bottom: the card's padding plus the
  // body's own margins keep both ends of the bar well clear of the 20px
  // corners, with or without a title and actions.
  padding-right: var(--h-modal-pad-x);
  margin-right: calc(-1 * var(--h-modal-pad-x));
}

.h-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
}
</style>
