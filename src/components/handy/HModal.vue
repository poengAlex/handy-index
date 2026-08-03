<template>
  <div class="h-modal">
    <q-btn
      v-if="closable"
      v-close-popup
      flat
      round
      icon="close"
      class="h-modal__close"
      aria-label="Close"
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
withDefaults(defineProps<{ title?: string; closable?: boolean }>(), {
  title: "",
  closable: false
});

const emit = defineEmits<{ close: [] }>();
</script>

<style scoped lang="scss">
.h-modal {
  position: relative;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow-xl);

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
}

.h-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
}
</style>
